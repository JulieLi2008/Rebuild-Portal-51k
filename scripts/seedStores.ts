import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { saveStore } from '../services/storeService';

const stores = [
  {
    id: 'S1',
    store_name: '51wood Main Office',
    manager_name: 'Julie Li',
    address: '115 Ironside Crescent, Scarborough, ON',
    commissionRate: 0,
    phone: '',
    email: 'info@51wood.ca',
    city: 'Scarborough',
    province: 'ON',
    postalCode: '',
    status: 'Active' as const,
  },
];

const seedStores = async () => {
  try {
    const email = process.env.SEED_ADMIN_EMAIL;
    const password = process.env.SEED_ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error('SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD are required to write stores.');
    }

    await signInWithEmailAndPassword(auth, email, password);
    console.log(`Signed in as ${email}`);

    for (const store of stores) {
      await saveStore(store);
      console.log(`Seeded store: ${store.store_name}`);
    }

    console.log('All stores seeded successfully.');
    await signOut(auth);
  } catch (error) {
    console.error('Failed to seed stores:', error);
    process.exit(1);
  }
};

seedStores();
