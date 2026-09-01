import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import {
  FirestoreOrder,
  FirestoreProductionTask,
  OrderStatusV2,
  PaymentStatus,
  ProductionStatus,
  ProductionTaskStatus,
  Quote,
} from '../types';
import { db } from './firebase';

const ORDERS_COLLECTION = 'orders';
const PRODUCTION_TASKS_COLLECTION = 'productionTasks';
const QUOTES_COLLECTION = 'quotes';

const normalizeDate = (value: any) =>
  value?.toDate?.()?.toISOString?.() || value || '';

const normalizeOrder = (id: string, data: any): FirestoreOrder => ({
  id,
  orderNumber: data.orderNumber || '',
  quoteId: data.quoteId || '',
  quoteNumber: data.quoteNumber || '',
  customerId: data.customerId || '',
  leadId: data.leadId || '',
  customerName: data.customerName || '',
  customerEmail: data.customerEmail || '',
  customerPhone: data.customerPhone || '',
  projectAddress: data.projectAddress || '',
  storeId: data.storeId || '',
  managerName: data.managerName || '',
  lineItems: Array.isArray(data.lineItems) ? data.lineItems : [],
  subtotal: typeof data.subtotal === 'number' ? data.subtotal : Number(data.subtotal || 0),
  discount: typeof data.discount === 'number' ? data.discount : Number(data.discount || 0),
  taxRate: typeof data.taxRate === 'number' ? data.taxRate : Number(data.taxRate || 0),
  taxAmount: typeof data.taxAmount === 'number' ? data.taxAmount : Number(data.taxAmount || 0),
  total: typeof data.total === 'number' ? data.total : Number(data.total || 0),
  status: (data.status || 'Pending') as OrderStatusV2,
  paymentStatus: (data.paymentStatus || 'Unpaid') as PaymentStatus,
  productionStatus: (data.productionStatus || 'Not Started') as ProductionStatus,
  orderDate: data.orderDate || '',
  dueDate: data.dueDate || '',
  notes: data.notes || '',
  createdAt: normalizeDate(data.createdAt),
  updatedAt: normalizeDate(data.updatedAt),
  createdBy: data.createdBy || '',
});

const normalizeProductionTask = (
  id: string,
  data: any
): FirestoreProductionTask => ({
  id,
  orderId: data.orderId || '',
  orderNumber: data.orderNumber || '',
  quoteId: data.quoteId || '',
  customerId: data.customerId || '',
  customerName: data.customerName || '',
  storeId: data.storeId || '',
  status: (data.status || 'Not Started') as ProductionTaskStatus,
  startedAt: normalizeDate(data.startedAt),
  completedAt: normalizeDate(data.completedAt),
  tasks: Array.isArray(data.tasks) ? data.tasks : [],
  createdAt: normalizeDate(data.createdAt),
  updatedAt: normalizeDate(data.updatedAt),
  createdBy: data.createdBy || '',
});

export const getOrders = async (): Promise<FirestoreOrder[]> => {
  const snapshot = await getDocs(
    query(collection(db, ORDERS_COLLECTION), orderBy('createdAt', 'desc'))
  );

  return snapshot.docs.map((orderDoc) =>
    normalizeOrder(orderDoc.id, orderDoc.data())
  );
};

export const getProductionTasks = async (): Promise<FirestoreProductionTask[]> => {
  const snapshot = await getDocs(
    query(collection(db, PRODUCTION_TASKS_COLLECTION), orderBy('createdAt', 'desc'))
  );

  return snapshot.docs.map((taskDoc) =>
    normalizeProductionTask(taskDoc.id, taskDoc.data())
  );
};

export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatusV2
) => {
  await updateDoc(doc(db, ORDERS_COLLECTION, orderId), {
    status,
    updatedAt: serverTimestamp(),
  });
};

export const updatePaymentStatus = async (
  orderId: string,
  paymentStatus: PaymentStatus
) => {
  await updateDoc(doc(db, ORDERS_COLLECTION, orderId), {
    paymentStatus,
    updatedAt: serverTimestamp(),
  });
};

export const updateProductionStatus = async (
  orderId: string,
  productionStatus: ProductionStatus
) => {
  await updateDoc(doc(db, ORDERS_COLLECTION, orderId), {
    productionStatus,
    updatedAt: serverTimestamp(),
  });
};

export const generateOrderNumber = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const suffix = String(now.getTime()).slice(-5);

  return `O-${yyyy}${mm}${dd}-${suffix}`;
};

export const buildDefaultProductionTasks = (
  orderId: string,
  orderNumber: string,
  quote: Quote,
  createdBy: string
): Omit<FirestoreProductionTask, 'id' | 'createdAt' | 'updatedAt'> => ({
  orderId,
  orderNumber,
  quoteId: quote.id,
  customerId: quote.customerId,
  customerName: quote.customerName,
  storeId: quote.storeId,
  status: 'Not Started',
  startedAt: '',
  completedAt: '',
  createdBy,
  tasks: [
    {
      id: `${orderId}-design-review`,
      taskName: 'Design Review',
      taskType: 'Design',
      isComplete: false,
      assignedTeamMemberId: '',
      assignedTeamMemberName: '',
      signedBy: '',
      notes: '',
      completedAt: '',
    },
    {
      id: `${orderId}-material-prep`,
      taskName: 'Material Prep',
      taskType: 'Production',
      isComplete: false,
      assignedTeamMemberId: '',
      assignedTeamMemberName: '',
      signedBy: '',
      notes: '',
      completedAt: '',
    },
    {
      id: `${orderId}-cutting`,
      taskName: 'Cutting / CNC',
      taskType: 'Production',
      isComplete: false,
      assignedTeamMemberId: '',
      assignedTeamMemberName: '',
      signedBy: '',
      notes: '',
      completedAt: '',
    },
    {
      id: `${orderId}-edgebanding`,
      taskName: 'Edgebanding',
      taskType: 'Production',
      isComplete: false,
      assignedTeamMemberId: '',
      assignedTeamMemberName: '',
      signedBy: '',
      notes: '',
      completedAt: '',
    },
    {
      id: `${orderId}-assembly`,
      taskName: 'Assembly',
      taskType: 'Production',
      isComplete: false,
      assignedTeamMemberId: '',
      assignedTeamMemberName: '',
      signedBy: '',
      notes: '',
      completedAt: '',
    },
    {
      id: `${orderId}-quality-check`,
      taskName: 'Quality Check',
      taskType: 'Quality',
      isComplete: false,
      assignedTeamMemberId: '',
      assignedTeamMemberName: '',
      signedBy: '',
      notes: '',
      completedAt: '',
    },
    {
      id: `${orderId}-installation`,
      taskName: 'Installation',
      taskType: 'Installation',
      isComplete: false,
      assignedTeamMemberId: '',
      assignedTeamMemberName: '',
      signedBy: '',
      notes: '',
      completedAt: '',
    },
  ],
});

export const convertQuoteToOrder = async (
  quote: Quote,
  createdBy: string
) => {
  if (quote.status === 'Converted') {
    throw new Error('This quote has already been converted.');
  }

  const orderNumber = generateOrderNumber();
  const orderDate = new Date().toISOString().split('T')[0];
  const dueDate = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];

  const orderRef = doc(collection(db, ORDERS_COLLECTION));
  const productionTaskRef = doc(collection(db, PRODUCTION_TASKS_COLLECTION));

  const orderPayload: Omit<FirestoreOrder, 'id' | 'createdAt' | 'updatedAt'> = {
    orderNumber,
    quoteId: quote.id,
    quoteNumber: quote.quoteNumber,
    customerId: quote.customerId,
    leadId: quote.leadId || '',
    customerName: quote.customerName,
    customerEmail: quote.customerEmail || '',
    customerPhone: quote.customerPhone,
    projectAddress: quote.projectAddress,
    storeId: quote.storeId,
    managerName: quote.managerName,
    lineItems: quote.lineItems,
    subtotal: quote.subtotal,
    discount: quote.discount,
    taxRate: quote.taxRate,
    taxAmount: quote.taxAmount,
    total: quote.total,
    status: 'Pending',
    paymentStatus: 'Unpaid',
    productionStatus: 'Not Started',
    orderDate,
    dueDate,
    notes: quote.notes || '',
    createdBy,
  };

  const taskPayload = buildDefaultProductionTasks(
    orderRef.id,
    orderNumber,
    quote,
    createdBy
  );

  await runTransaction(db, async (transaction) => {
    const quoteRef = doc(db, QUOTES_COLLECTION, quote.id);
    const quoteSnap = await transaction.get(quoteRef);

    if (!quoteSnap.exists()) {
      throw new Error('Quote no longer exists.');
    }

    const latestQuote = quoteSnap.data();

    if (latestQuote.status === 'Converted') {
      throw new Error('This quote has already been converted.');
    }

    transaction.set(orderRef, {
      ...orderPayload,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    transaction.set(productionTaskRef, {
      ...taskPayload,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    transaction.update(quoteRef, {
      status: 'Converted',
      updatedAt: serverTimestamp(),
    });
  });

  return {
    orderId: orderRef.id,
    orderNumber,
    productionTaskId: productionTaskRef.id,
  };
};
