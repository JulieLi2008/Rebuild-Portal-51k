import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { EmploymentType, TeamMember, WorkerType } from '../types';

const TEAM_MEMBERS_COLLECTION = 'teamMembers';

const normalizeDate = (value: any) =>
  value?.toDate?.()?.toISOString?.() || value || '';

const normalizeNumber = (value: any) =>
  typeof value === 'number' ? value : Number(value || 0);

const normalizeTeamMember = (id: string, data: any): TeamMember => ({
  id,
  displayName: data.displayName || '',
  email: data.email || '',
  phone: data.phone || '',
  role: data.role || '',
  permissionsRole: data.permissionsRole || data.role || '',
  workerType: (data.workerType || 'Other') as WorkerType,
  employmentType: (data.employmentType || 'Other') as EmploymentType,
  storeId: data.storeId || '',
  status: data.status || 'Active',
  canLogin: data.canLogin === true,
  linkedUserId: data.linkedUserId || '',
  hourlyRate: normalizeNumber(data.hourlyRate),
  pieceRate: normalizeNumber(data.pieceRate),
  caseRate: normalizeNumber(data.caseRate),
  contractRate: normalizeNumber(data.contractRate),
  commissionRate: normalizeNumber(data.commissionRate),
  notes: data.notes || '',
  createdAt: normalizeDate(data.createdAt),
  updatedAt: normalizeDate(data.updatedAt),
  createdBy: data.createdBy || '',
});

export const getTeamMembers = async (): Promise<TeamMember[]> => {
  const snapshot = await getDocs(
    query(collection(db, TEAM_MEMBERS_COLLECTION), orderBy('createdAt', 'desc'))
  );

  return snapshot.docs.map((memberDoc) =>
    normalizeTeamMember(memberDoc.id, memberDoc.data())
  );
};

export const createTeamMember = async (
  member: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>
) => {
  const docRef = await addDoc(collection(db, TEAM_MEMBERS_COLLECTION), {
    ...member,
    hourlyRate: Number(member.hourlyRate || 0),
    pieceRate: Number(member.pieceRate || 0),
    caseRate: Number(member.caseRate || 0),
    contractRate: Number(member.contractRate || 0),
    commissionRate: Number(member.commissionRate || 0),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
};

export const saveTeamMember = async (member: TeamMember) => {
  await setDoc(doc(db, TEAM_MEMBERS_COLLECTION, member.id), {
    displayName: member.displayName,
    email: member.email || '',
    phone: member.phone || '',
    role: member.role || '',
    permissionsRole: member.permissionsRole || '',
    workerType: member.workerType || 'Other',
    employmentType: member.employmentType || 'Other',
    storeId: member.storeId || '',
    status: member.status || 'Active',
    canLogin: member.canLogin === true,
    linkedUserId: member.linkedUserId || '',
    hourlyRate: Number(member.hourlyRate || 0),
    pieceRate: Number(member.pieceRate || 0),
    caseRate: Number(member.caseRate || 0),
    contractRate: Number(member.contractRate || 0),
    commissionRate: Number(member.commissionRate || 0),
    notes: member.notes || '',
    createdAt: member.createdAt || serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdBy: member.createdBy || '',
  });
};

export const updateTeamMember = async (
  memberId: string,
  data: Partial<TeamMember>
) => {
  const { id, ...payload } = data;

  await updateDoc(doc(db, TEAM_MEMBERS_COLLECTION, memberId), {
    ...payload,
    updatedAt: serverTimestamp(),
  });
};

export const deleteTeamMember = async (memberId: string) => {
  await deleteDoc(doc(db, TEAM_MEMBERS_COLLECTION, memberId));
};
