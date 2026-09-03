import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  Transaction,
  where,
} from 'firebase/firestore';
import {
  FirestoreOrder,
  Product,
  QuoteItem,
  StockMovement,
  StockMovementType,
} from '../types';
import { db } from './firebase';

const PRODUCTS_COLLECTION = 'catalogProducts';
const ORDERS_COLLECTION = 'orders';
const STOCK_MOVEMENTS_COLLECTION = 'stockMovements';

const normalizeDate = (value: any) =>
  value?.toDate?.()?.toISOString?.() || value || '';

const normalizeNumber = (value: any) =>
  typeof value === 'number' ? value : Number(value || 0);

const normalizeMovement = (id: string, data: any): StockMovement => ({
  id,
  productId: data.productId || '',
  sku: data.sku || '',
  productName: data.productName || '',
  orderId: data.orderId || '',
  orderNumber: data.orderNumber || '',
  customerName: data.customerName || '',
  movementType: (data.movementType || 'Adjusted') as StockMovementType,
  quantity: normalizeNumber(data.quantity),
  previousStock: normalizeNumber(data.previousStock),
  newStock: normalizeNumber(data.newStock),
  notes: data.notes || '',
  createdAt: normalizeDate(data.createdAt),
  createdBy: data.createdBy || '',
});

const productLookupKeys = (item: QuoteItem) => {
  return [
    item.productId,
    item.sku,
  ].filter(Boolean);
};

export const getStockMovements = async (): Promise<StockMovement[]> => {
  const snapshot = await getDocs(
    query(collection(db, STOCK_MOVEMENTS_COLLECTION), orderBy('createdAt', 'desc'))
  );

  return snapshot.docs.map((movementDoc) =>
    normalizeMovement(movementDoc.id, movementDoc.data())
  );
};

export const getStockMovementsForOrder = async (
  orderId: string
): Promise<StockMovement[]> => {
  const snapshot = await getDocs(
    query(
      collection(db, STOCK_MOVEMENTS_COLLECTION),
      where('orderId', '==', orderId),
      orderBy('createdAt', 'desc')
    )
  );

  return snapshot.docs.map((movementDoc) =>
    normalizeMovement(movementDoc.id, movementDoc.data())
  );
};

const findProductDocInTransaction = async (
  transaction: Transaction,
  lineItem: QuoteItem
) => {
  const keys = productLookupKeys(lineItem);

  for (const key of keys) {
    const ref = doc(db, PRODUCTS_COLLECTION, key);
    const snap = await transaction.get(ref);

    if (snap.exists()) {
      return {
        ref,
        snap,
        data: snap.data() as Product,
      };
    }
  }

  throw new Error(`Product not found in catalog: ${lineItem.name || lineItem.sku}`);
};

export const reserveStockForOrder = async (
  order: FirestoreOrder,
  createdBy: string
) => {
  if (order.inventoryStatus === 'Reserved') {
    throw new Error('Stock is already reserved for this order.');
  }

  if (order.inventoryStatus === 'Deducted') {
    throw new Error('Stock has already been deducted for this order.');
  }

  const orderRef = doc(db, ORDERS_COLLECTION, order.id);
  const movementRefs = order.lineItems.map(() =>
    doc(collection(db, STOCK_MOVEMENTS_COLLECTION))
  );

  await runTransaction(db, async (transaction) => {
    const orderSnap = await transaction.get(orderRef);

    if (!orderSnap.exists()) {
      throw new Error('Order no longer exists.');
    }

    const latestOrder = orderSnap.data();

    if (latestOrder.inventoryStatus === 'Reserved') {
      throw new Error('Stock is already reserved for this order.');
    }

    if (latestOrder.inventoryStatus === 'Deducted') {
      throw new Error('Stock has already been deducted for this order.');
    }

    for (let i = 0; i < order.lineItems.length; i += 1) {
      const lineItem = order.lineItems[i];
      const productDoc = await findProductDocInTransaction(transaction, lineItem);
      const previousStock = normalizeNumber(productDoc.data.stockLevel);
      const quantity = normalizeNumber(lineItem.quantity);

      transaction.set(movementRefs[i], {
        productId: productDoc.ref.id,
        sku: productDoc.data.sku || lineItem.sku || productDoc.ref.id,
        productName: productDoc.data.name || lineItem.name || '',
        orderId: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        movementType: 'Reserved',
        quantity,
        previousStock,
        newStock: previousStock,
        notes: 'Stock reserved for order.',
        createdAt: serverTimestamp(),
        createdBy,
      });
    }

    transaction.update(orderRef, {
      inventoryStatus: 'Reserved',
      inventoryReservedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });
};

export const deductStockForOrder = async (
  order: FirestoreOrder,
  createdBy: string
) => {
  if (order.inventoryStatus === 'Deducted') {
    throw new Error('Stock has already been deducted for this order.');
  }

  const orderRef = doc(db, ORDERS_COLLECTION, order.id);
  const movementRefs = order.lineItems.map(() =>
    doc(collection(db, STOCK_MOVEMENTS_COLLECTION))
  );

  await runTransaction(db, async (transaction) => {
    const orderSnap = await transaction.get(orderRef);

    if (!orderSnap.exists()) {
      throw new Error('Order no longer exists.');
    }

    const latestOrder = orderSnap.data();

    if (latestOrder.inventoryStatus === 'Deducted') {
      throw new Error('Stock has already been deducted for this order.');
    }

    const productDocs: Array<{
      lineItem: QuoteItem;
      productDoc: Awaited<ReturnType<typeof findProductDocInTransaction>>;
      previousStock: number;
      quantity: number;
    }> = [];

    for (const lineItem of order.lineItems) {
      const productDoc = await findProductDocInTransaction(transaction, lineItem);
      const previousStock = normalizeNumber(productDoc.data.stockLevel);
      const quantity = normalizeNumber(lineItem.quantity);

      if (previousStock < quantity) {
        throw new Error(
          `Not enough stock for ${productDoc.data.name || lineItem.name}. Available: ${previousStock}, required: ${quantity}.`
        );
      }

      productDocs.push({
        lineItem,
        productDoc,
        previousStock,
        quantity,
      });
    }

    productDocs.forEach(({ lineItem, productDoc, previousStock, quantity }, index) => {
      const newStock = previousStock - quantity;

      transaction.update(productDoc.ref, {
        stockLevel: newStock,
        updatedAt: serverTimestamp(),
      });

      transaction.set(movementRefs[index], {
        productId: productDoc.ref.id,
        sku: productDoc.data.sku || lineItem.sku || productDoc.ref.id,
        productName: productDoc.data.name || lineItem.name || '',
        orderId: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        movementType: 'Deducted',
        quantity,
        previousStock,
        newStock,
        notes: 'Stock deducted for order production.',
        createdAt: serverTimestamp(),
        createdBy,
      });
    });

    transaction.update(orderRef, {
      inventoryStatus: 'Deducted',
      inventoryDeductedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });
};
