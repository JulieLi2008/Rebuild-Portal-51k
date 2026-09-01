import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const demoUsers = [
  { email: 'manager@51wood.ca', name: 'Demo Manager', role: 'Manager', storeId: 'S1' },
  { email: 'sales@51wood.ca', name: 'Demo Sales', role: 'Sales', storeId: 'S1' },
  { email: 'designer@51wood.ca', name: 'Demo Designer', role: 'Designer', storeId: 'S1' },
  { email: 'cabinetmaker@51wood.ca', name: 'Demo Cabinet Maker', role: 'Cabinet Maker', storeId: 'S1' },
  { email: 'installer@51wood.ca', name: 'Demo Installer', role: 'Installer', storeId: 'S1' },
  { email: 'installerhelper@51wood.ca', name: 'Demo Installer Helper', role: 'Installer Helper', storeId: 'S1' },
  { email: 'countertop@51wood.ca', name: 'Demo Countertop Subcontractor', role: 'Countertop Subcontractor', storeId: 'S1' },
];

const PLACEHOLDER_UID = 'PASTE_FIREBASE_AUTH_UID_HERE';
const mappingPath = resolve(process.cwd(), 'scripts/demoUserUids.json');

const printSetupInstructions = () => {
  console.log('');
  console.log('Demo user profiles require Firebase Auth UIDs.');
  console.log('1. In Firebase Console > Authentication, create each demo user manually:');
  demoUsers.forEach((user) => {
    console.log(`   - ${user.email}  (${user.role})`);
  });
  console.log('2. Copy scripts/demoUserUids.example.json to scripts/demoUserUids.json');
  console.log('3. Paste each user UID next to their email.');
  console.log('4. Run: npm run seed:demo-users');
  console.log('');
};

const seedDemoUsers = async () => {
  try {
    if (!existsSync(mappingPath)) {
      console.error('Missing scripts/demoUserUids.json');
      printSetupInstructions();
      process.exit(1);
    }

    const uidMap = JSON.parse(readFileSync(mappingPath, 'utf8')) as Record<string, string>;
    const readyUsers = demoUsers.filter((user) => {
      const uid = uidMap[user.email];
      return uid && uid !== PLACEHOLDER_UID;
    });

    if (readyUsers.length === 0) {
      console.error('No valid Firebase Auth UIDs found in scripts/demoUserUids.json');
      printSetupInstructions();
      process.exit(1);
    }

    const email = process.env.SEED_ADMIN_EMAIL;
    const password = process.env.SEED_ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error('SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD are required to write demo user profiles.');
    }

    await signInWithEmailAndPassword(auth, email, password);
    console.log(`Signed in as ${email}`);

    const joinDate = new Date().toISOString().split('T')[0];

    for (const user of demoUsers) {
      const uid = uidMap[user.email];

      if (!uid || uid === PLACEHOLDER_UID) {
        console.log(`Skipped ${user.email}: paste a Firebase Auth UID first.`);
        continue;
      }

      await setDoc(doc(db, 'users', uid), {
        name: user.name,
        email: user.email,
        role: user.role,
        storeId: user.storeId,
        approved: true,
        joinDate,
      });

      console.log(`Seeded user profile: ${user.email} -> users/${uid}`);
    }

    console.log('Demo user profiles seeded successfully.');
    await signOut(auth);
  } catch (error) {
    console.error('Failed to seed demo users:', error);
    process.exit(1);
  }
};

seedDemoUsers();
