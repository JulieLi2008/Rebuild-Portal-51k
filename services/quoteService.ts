import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { Quote, QuoteItem, QuoteStatus } from '../types';

const QUOTES_COLLECTION = 'quotes';

const normalizeDate = (value: any) =>
  value?.toDate?.()?.toISOString?.() || value || '';

const normalizeQuote = (id: string, data: any): Quote => ({
  id,
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
  subtotal:
    typeof data.subtotal === 'number' ? data.subtotal : Number(data.subtotal || 0),
  discount:
    typeof data.discount === 'number' ? data.discount : Number(data.discount || 0),
  taxRate:
    typeof data.taxRate === 'number' ? data.taxRate : Number(data.taxRate || 0),
  taxAmount:
    typeof data.taxAmount === 'number'
      ? data.taxAmount
      : Number(data.taxAmount || 0),
  total: typeof data.total === 'number' ? data.total : Number(data.total || 0),
  status: (data.status || 'Draft') as QuoteStatus,
  notes: data.notes || '',
  createdAt: normalizeDate(data.createdAt),
  updatedAt: normalizeDate(data.updatedAt),
  createdBy: data.createdBy || '',
});

export const getQuotes = async (): Promise<Quote[]> => {
  const snapshot = await getDocs(
    query(collection(db, QUOTES_COLLECTION), orderBy('createdAt', 'desc'))
  );

  return snapshot.docs.map((quoteDoc) =>
    normalizeQuote(quoteDoc.id, quoteDoc.data())
  );
};

export const createQuote = async (
  quote: Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>
) => {
  const docRef = await addDoc(collection(db, QUOTES_COLLECTION), {
    ...quote,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
};

export const updateQuoteStatus = async (
  quoteId: string,
  status: QuoteStatus
) => {
  await updateDoc(doc(db, QUOTES_COLLECTION, quoteId), {
    status,
    updatedAt: serverTimestamp(),
  });
};

export const makeQuoteItem = (
  product: {
    id: string;
    sku: string;
    name: string;
    category: string;
    unit: string;
    base_price: number;
  },
  quantity: number
): QuoteItem => {
  const lineTotal = Number(product.base_price || 0) * quantity;

  return {
    productId: product.id,
    sku: product.sku,
    name: product.name,
    category: product.category,
    unit: product.unit,
    base_price: Number(product.base_price || 0),
    quantity,
    lineTotal,
  };
};

export const generateQuoteNumber = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const suffix = String(now.getTime()).slice(-5);

  return `Q-${yyyy}${mm}${dd}-${suffix}`;
};
