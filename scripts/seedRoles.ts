import { setDoc, doc } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '../services/firebase';

const roles = [
  {
    id: 'SuperAdmin',
    name: 'SuperAdmin',
    permissions: {
      Cell: true,
      Phone: true,
      Address: true,
      Email: true,
      Drawing: true,
      Upload: true,
      Payment: true,
      Order: true,
      Credit: true,
      Comment: true,
      Review: true,
      Reviews: true,
      'Store Orders': true,
      'All Orders': true,
      'Order Tasks': true,
      view_data_center: true,
      view_orders: true,
      view_products: true,
      view_stores: true,
      view_tasks: true,
    },
  },
  {
    id: 'Manager',
    name: 'Manager',
    permissions: {
      Cell: true,
      Phone: true,
      Address: true,
      Email: true,
      Drawing: true,
      Upload: true,
      Payment: false,
      Order: true,
      Credit: false,
      Comment: true,
      Review: true,
      Reviews: false,
      'Store Orders': true,
      'All Orders': false,
      'Order Tasks': true,
      view_data_center: true,
      view_orders: true,
      view_products: true,
      view_stores: true,
      view_tasks: true,
    },
  },
  {
    id: 'Sales',
    name: 'Sales',
    permissions: {
      Cell: true,
      Phone: true,
      Address: true,
      Email: true,
      Drawing: true,
      Upload: false,
      Payment: false,
      Order: true,
      Credit: false,
      Comment: true,
      Review: false,
      Reviews: false,
      'Store Orders': true,
      'All Orders': false,
      'Order Tasks': false,
      view_data_center: false,
      view_orders: false,
      view_products: false,
      view_stores: false,
      view_tasks: false,
    },
  },
  {
    id: 'Accounting',
    name: 'Accounting',
    permissions: {
      Cell: false,
      Phone: false,
      Address: false,
      Email: true,
      Drawing: false,
      Upload: false,
      Payment: true,
      Order: true,
      Credit: true,
      Comment: false,
      Review: false,
      Reviews: false,
      'Store Orders': false,
      'All Orders': true,
      'Order Tasks': false,
      view_data_center: true,
      view_orders: true,
      view_products: false,
      view_stores: false,
      view_tasks: false,
    },
  },
];

const seedRoles = async () => {
  try {
    const email = process.env.SEED_ADMIN_EMAIL;
    const password = process.env.SEED_ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error('SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD are required to write roles.');
    }

    await signInWithEmailAndPassword(auth, email, password);
    console.log(`Signed in as ${email}`);

    for (const role of roles) {
      await setDoc(doc(db, 'roles', role.id), {
        name: role.name,
        permissions: role.permissions,
      });

      console.log(`Seeded role: ${role.name}`);
    }

    console.log('All roles seeded successfully.');
    await signOut(auth);
  } catch (error) {
    console.error('Failed to seed roles:', error);
    process.exit(1);
  }
};

seedRoles();
