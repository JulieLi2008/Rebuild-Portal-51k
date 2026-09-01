import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';

const serviceAccountPath = path.resolve('scripts/serviceAccount.local.json');
const uidOutputPath = path.resolve('scripts/demoUserUids.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('');
  console.error('Missing Firebase service account file.');
  console.error('Please download it from Firebase Console > Project Settings > Service accounts > Generate new private key.');
  console.error('Save it as: scripts/serviceAccount.local.json');
  console.error('');
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const auth = getAuth();
const firestore = getFirestore();

const TEMP_PASSWORD =
  process.env.DEMO_USER_PASSWORD || 'Demo-51wood-Change-Me-2026!';

const demoUsers = [
  {
    email: 'manager@51wood.ca',
    name: 'Demo Manager',
    role: 'Manager',
    storeId: 'S1',
  },
  {
    email: 'sales@51wood.ca',
    name: 'Demo Sales',
    role: 'Sales',
    storeId: 'S1',
  },
  {
    email: 'designer@51wood.ca',
    name: 'Demo Designer',
    role: 'Designer',
    storeId: 'S1',
  },
  {
    email: 'cabinetmaker@51wood.ca',
    name: 'Demo Cabinet Maker',
    role: 'Cabinet Maker',
    storeId: 'S1',
  },
  {
    email: 'installer@51wood.ca',
    name: 'Demo Installer',
    role: 'Installer',
    storeId: 'S1',
  },
  {
    email: 'installerhelper@51wood.ca',
    name: 'Demo Installer Helper',
    role: 'Installer Helper',
    storeId: 'S1',
  },
  {
    email: 'countertop@51wood.ca',
    name: 'Demo Countertop Subcontractor',
    role: 'Countertop Subcontractor',
    storeId: 'S1',
  },
];

const getOrCreateUser = async (demoUser: (typeof demoUsers)[number]) => {
  try {
    const existingUser = await auth.getUserByEmail(demoUser.email);
    console.log(`Reusing existing Auth user: ${demoUser.email} (${existingUser.uid})`);

    await auth.updateUser(existingUser.uid, {
      displayName: demoUser.name,
      emailVerified: true,
      disabled: false,
    });

    return existingUser;
  } catch (error: any) {
    if (error?.code !== 'auth/user-not-found') {
      throw error;
    }

    const createdUser = await auth.createUser({
      email: demoUser.email,
      password: TEMP_PASSWORD,
      displayName: demoUser.name,
      emailVerified: true,
      disabled: false,
    });

    console.log(`Created Auth user: ${demoUser.email} (${createdUser.uid})`);
    return createdUser;
  }
};

const run = async () => {
  const uidMap: Record<string, string> = {};
  const today = new Date().toISOString().split('T')[0];

  for (const demoUser of demoUsers) {
    const authUser = await getOrCreateUser(demoUser);
    uidMap[demoUser.email] = authUser.uid;

    await firestore.collection('users').doc(authUser.uid).set(
      {
        name: demoUser.name,
        email: demoUser.email,
        role: demoUser.role,
        storeId: demoUser.storeId,
        approved: true,
        joinDate: today,
      },
      { merge: true }
    );

    console.log(`Seeded Firestore profile: users/${authUser.uid}`);
  }

  fs.writeFileSync(uidOutputPath, `${JSON.stringify(uidMap, null, 2)}\n`);

  console.log('');
  console.log('Demo Auth users and Firestore profiles are ready.');
  console.log(`UID mapping written to: ${uidOutputPath}`);
  console.log('');
  console.log('Temporary password used for all demo accounts:');
  console.log(TEMP_PASSWORD);
  console.log('');
  console.log('Change these passwords before using the system outside a demo.');
};

run().catch((error) => {
  console.error('Failed to create demo users:', error);
  process.exit(1);
});
