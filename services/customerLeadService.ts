import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { Customer, Lead, LeadStatus } from '../types';

const CUSTOMERS_COLLECTION = 'customers';
const LEADS_COLLECTION = 'leads';

const normalizeCustomer = (id: string, data: any): Customer => ({
  id,
  firstName: data.firstName || '',
  lastName: data.lastName || '',
  displayName: data.displayName || `${data.firstName || ''} ${data.lastName || ''}`.trim(),
  email: data.email || '',
  phone: data.phone || '',
  address: data.address || '',
  city: data.city || '',
  province: data.province || '',
  postalCode: data.postalCode || '',
  source: data.source || '',
  notes: data.notes || '',
  createdAt: data.createdAt?.toDate?.()?.toISOString?.() || data.createdAt || '',
  updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() || data.updatedAt || '',
  createdBy: data.createdBy || '',
});

const normalizeLead = (id: string, data: any): Lead => ({
  id,
  customerId: data.customerId || '',
  customerName: data.customerName || '',
  email: data.email || '',
  phone: data.phone || '',
  projectAddress: data.projectAddress || '',
  projectType: data.projectType || '',
  source: data.source || 'info@51wood.ca',
  status: (data.status || 'New') as LeadStatus,
  budget: data.budget || '',
  timeline: data.timeline || '',
  notes: data.notes || '',
  assignedStoreId: data.assignedStoreId || '',
  assignedManager: data.assignedManager || '',
  createdAt: data.createdAt?.toDate?.()?.toISOString?.() || data.createdAt || '',
  updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() || data.updatedAt || '',
  createdBy: data.createdBy || '',
});

export const getCustomers = async (): Promise<Customer[]> => {
  const snapshot = await getDocs(
    query(collection(db, CUSTOMERS_COLLECTION), orderBy('createdAt', 'desc'))
  );

  return snapshot.docs.map((customerDoc) =>
    normalizeCustomer(customerDoc.id, customerDoc.data())
  );
};

export const getLeads = async (): Promise<Lead[]> => {
  const snapshot = await getDocs(
    query(collection(db, LEADS_COLLECTION), orderBy('createdAt', 'desc'))
  );

  return snapshot.docs.map((leadDoc) =>
    normalizeLead(leadDoc.id, leadDoc.data())
  );
};

export const createCustomerAndLead = async ({
  firstName,
  lastName,
  email,
  phone,
  customerAddress,
  city,
  province,
  postalCode,
  projectAddress,
  projectType,
  source,
  status,
  budget,
  timeline,
  notes,
  assignedStoreId,
  assignedManager,
  createdBy,
}: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  customerAddress?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  projectAddress: string;
  projectType: string;
  source: string;
  status: LeadStatus;
  budget?: string;
  timeline?: string;
  notes?: string;
  assignedStoreId?: string;
  assignedManager?: string;
  createdBy: string;
}) => {
  const displayName = `${firstName} ${lastName}`.trim();

  const customerRef = await addDoc(collection(db, CUSTOMERS_COLLECTION), {
    firstName,
    lastName,
    displayName,
    email,
    phone,
    address: customerAddress || projectAddress,
    city: city || '',
    province: province || '',
    postalCode: postalCode || '',
    source,
    notes: notes || '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdBy,
  });

  const leadRef = await addDoc(collection(db, LEADS_COLLECTION), {
    customerId: customerRef.id,
    customerName: displayName,
    email,
    phone,
    projectAddress,
    projectType,
    source,
    status,
    budget: budget || '',
    timeline: timeline || '',
    notes: notes || '',
    assignedStoreId: assignedStoreId || '',
    assignedManager: assignedManager || '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdBy,
  });

  return {
    customerId: customerRef.id,
    leadId: leadRef.id,
  };
};

export const updateLeadStatus = async (leadId: string, status: LeadStatus) => {
  await updateDoc(doc(db, LEADS_COLLECTION, leadId), {
    status,
    updatedAt: serverTimestamp(),
  });
};

export const updateLead = async (leadId: string, data: Partial<Lead>) => {
  const { id, ...payload } = data;

  await updateDoc(doc(db, LEADS_COLLECTION, leadId), {
    ...payload,
    updatedAt: serverTimestamp(),
  });
};

export const saveCustomer = async (customer: Customer) => {
  await setDoc(doc(db, CUSTOMERS_COLLECTION, customer.id), {
    firstName: customer.firstName,
    lastName: customer.lastName,
    displayName: customer.displayName,
    email: customer.email,
    phone: customer.phone,
    address: customer.address || '',
    city: customer.city || '',
    province: customer.province || '',
    postalCode: customer.postalCode || '',
    source: customer.source || '',
    notes: customer.notes || '',
    createdAt: customer.createdAt || serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdBy: customer.createdBy || '',
  });
};
