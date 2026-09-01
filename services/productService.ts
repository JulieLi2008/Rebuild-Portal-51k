import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { Product } from '../types';

const PRODUCTS_COLLECTION = 'catalogProducts';

const normalizeProduct = (id: string, data: any): Product => ({
  id,
  sku: data.sku || id,
  name: data.name || '',
  base_price:
    typeof data.base_price === 'number'
      ? data.base_price
      : Number(data.base_price || 0),
  unit: data.unit || 'Piece',
  dimensions: {
    w: data.dimensions?.w || '0',
    h: data.dimensions?.h || '0',
    d: data.dimensions?.d || '0',
  },
  modifications: Array.isArray(data.modifications) ? data.modifications : [],
  category: data.category || 'Other',
  stockLevel:
    typeof data.stockLevel === 'number'
      ? data.stockLevel
      : Number(data.stockLevel || 0),
  minStock:
    typeof data.minStock === 'number'
      ? data.minStock
      : Number(data.minStock || 0),
  supplier: data.supplier || '',
  status: data.status || 'Active',
  createdAt: data.createdAt || '',
  updatedAt: data.updatedAt || '',
});

export const getProducts = async (): Promise<Product[]> => {
  const snapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));

  return snapshot.docs.map((productDoc) =>
    normalizeProduct(productDoc.id, productDoc.data())
  );
};

export const saveProduct = async (product: Product) => {
  const now = new Date().toISOString();
  const productId = product.id || product.sku || `P${Date.now()}`;

  await setDoc(doc(db, PRODUCTS_COLLECTION, productId), {
    sku: product.sku,
    name: product.name,
    base_price: Number(product.base_price || 0),
    unit: product.unit || 'Piece',
    dimensions: {
      w: product.dimensions?.w || '0',
      h: product.dimensions?.h || '0',
      d: product.dimensions?.d || '0',
    },
    modifications: product.modifications || [],
    category: product.category || 'Other',
    stockLevel: Number(product.stockLevel || 0),
    minStock: Number(product.minStock || 0),
    supplier: product.supplier || '',
    status: product.status || 'Active',
    createdAt: product.createdAt || now,
    updatedAt: now,
  });
};

export const deleteProduct = async (productId: string) => {
  await deleteDoc(doc(db, PRODUCTS_COLLECTION, productId));
};
