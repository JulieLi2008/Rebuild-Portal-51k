import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import {
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { db, storage } from './firebase';
import {
  ERPFile,
  FileCategory,
  FileEntityType,
} from '../types';

const FILES_COLLECTION = 'files';
const STORAGE_ROOT = 'erpFiles';

const normalizeDate = (value: any) =>
  value?.toDate?.()?.toISOString?.() || value || '';

const normalizeERPFile = (id: string, data: any): ERPFile => ({
  id,
  fileName: data.fileName || '',
  originalName: data.originalName || '',
  contentType: data.contentType || '',
  size: typeof data.size === 'number' ? data.size : Number(data.size || 0),
  storagePath: data.storagePath || '',
  downloadUrl: data.downloadUrl || '',
  entityType: data.entityType || 'lead',
  entityId: data.entityId || '',
  relatedCustomerId: data.relatedCustomerId || '',
  relatedLeadId: data.relatedLeadId || '',
  relatedQuoteId: data.relatedQuoteId || '',
  relatedOrderId: data.relatedOrderId || '',
  fileCategory: data.fileCategory || 'Other',
  notes: data.notes || '',
  uploadedAt: normalizeDate(data.uploadedAt),
  uploadedBy: data.uploadedBy || '',
});

const sanitizeFileName = (fileName: string) => {
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
};

export const uploadERPFile = async ({
  file,
  entityType,
  entityId,
  fileCategory,
  uploadedBy,
  notes,
  relatedCustomerId,
  relatedLeadId,
  relatedQuoteId,
  relatedOrderId,
}: {
  file: File;
  entityType: FileEntityType;
  entityId: string;
  fileCategory: FileCategory;
  uploadedBy: string;
  notes?: string;
  relatedCustomerId?: string;
  relatedLeadId?: string;
  relatedQuoteId?: string;
  relatedOrderId?: string;
}) => {
  if (!file) {
    throw new Error('No file selected.');
  }

  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif',
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Only PDF and image files are allowed.');
  }

  const maxSize = 25 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error('File must be smaller than 25 MB.');
  }

  const safeFileName = sanitizeFileName(file.name);
  const fileName = `${Date.now()}-${safeFileName}`;
  const storagePath = `${STORAGE_ROOT}/${entityType}/${entityId}/${fileName}`;
  const storageRef = ref(storage, storagePath);

  await uploadBytes(storageRef, file, {
    contentType: file.type,
  });

  const downloadUrl = await getDownloadURL(storageRef);

  const docRef = await addDoc(collection(db, FILES_COLLECTION), {
    fileName,
    originalName: file.name,
    contentType: file.type,
    size: file.size,
    storagePath,
    downloadUrl,
    entityType,
    entityId,
    relatedCustomerId: relatedCustomerId || '',
    relatedLeadId: relatedLeadId || '',
    relatedQuoteId: relatedQuoteId || '',
    relatedOrderId: relatedOrderId || '',
    fileCategory,
    notes: notes || '',
    uploadedAt: serverTimestamp(),
    uploadedBy,
  });

  return docRef.id;
};

export const getFilesForEntity = async (
  entityType: FileEntityType,
  entityId: string
): Promise<ERPFile[]> => {
  const snapshot = await getDocs(
    query(
      collection(db, FILES_COLLECTION),
      where('entityType', '==', entityType),
      where('entityId', '==', entityId),
      orderBy('uploadedAt', 'desc')
    )
  );

  return snapshot.docs.map((fileDoc) =>
    normalizeERPFile(fileDoc.id, fileDoc.data())
  );
};

export const getAllERPFiles = async (): Promise<ERPFile[]> => {
  const snapshot = await getDocs(
    query(collection(db, FILES_COLLECTION), orderBy('uploadedAt', 'desc'))
  );

  return snapshot.docs.map((fileDoc) =>
    normalizeERPFile(fileDoc.id, fileDoc.data())
  );
};
