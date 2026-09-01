import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface RoleRecord {
  id: string;
  name: string;
  permissions: Record<string, boolean>;
}

export const getRoles = async (): Promise<RoleRecord[]> => {
  const snapshot = await getDocs(collection(db, 'roles'));

  return snapshot.docs.map((roleDoc) => {
    const data = roleDoc.data();

    return {
      id: roleDoc.id,
      name: data.name || roleDoc.id,
      permissions: data.permissions || {},
    };
  });
};

export const saveRole = async (role: RoleRecord) => {
  const roleId = role.name.trim();

  await setDoc(doc(db, 'roles', roleId), {
    name: role.name.trim(),
    permissions: role.permissions || {},
  });
};

export const updateRolePermissions = async (
  roleId: string,
  permissions: Record<string, boolean>
) => {
  await updateDoc(doc(db, 'roles', roleId), {
    permissions,
  });
};

export const deleteRole = async (roleId: string) => {
  await deleteDoc(doc(db, 'roles', roleId));
};
