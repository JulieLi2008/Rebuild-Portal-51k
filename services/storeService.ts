import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { StoreInfo } from '../types';

const STORES_COLLECTION = 'stores';

export const getStores = async (): Promise<StoreInfo[]> => {
  const snapshot = await getDocs(collection(db, STORES_COLLECTION));

  return snapshot.docs.map((storeDoc) => {
    const data = storeDoc.data();

    return {
      id: storeDoc.id,
      store_name: data.store_name || '',
      manager_name: data.manager_name || '',
      address: data.address || '',
      commissionRate:
        typeof data.commissionRate === 'number'
          ? data.commissionRate
          : Number(data.commissionRate || 0),
      phone: data.phone || '',
      email: data.email || '',
      city: data.city || '',
      province: data.province || '',
      postalCode: data.postalCode || '',
      status: data.status || 'Active',
      createdAt: data.createdAt || '',
      updatedAt: data.updatedAt || '',
    };
  });
};

export const saveStore = async (store: StoreInfo) => {
  const now = new Date().toISOString();

  await setDoc(doc(db, STORES_COLLECTION, store.id), {
    store_name: store.store_name,
    manager_name: store.manager_name,
    address: store.address,
    commissionRate: Number(store.commissionRate || 0),
    phone: store.phone || '',
    email: store.email || '',
    city: store.city || '',
    province: store.province || '',
    postalCode: store.postalCode || '',
    status: store.status || 'Active',
    createdAt: store.createdAt || now,
    updatedAt: now,
  });
};

export const deleteStore = async (storeId: string) => {
  await deleteDoc(doc(db, STORES_COLLECTION, storeId));
};
