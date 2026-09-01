import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { mockDatabase } from '../script.js';
import { Product } from '../types';

const seedProducts = async () => {
  const now = new Date().toISOString();

  try {
    const email = process.env.SEED_ADMIN_EMAIL;
    const password = process.env.SEED_ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error('SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD are required to write products.');
    }

    await signInWithEmailAndPassword(auth, email, password);
    console.log(`Signed in as ${email}`);

    for (const product of mockDatabase.products as Product[]) {
      const productId = product.sku || product.id;

      await setDoc(doc(db, 'catalogProducts', productId), {
        sku: product.sku,
        name: product.name,
        base_price: Number(product.base_price || 0),
        unit: product.unit || 'Piece',
        dimensions: {
          w: product.dimensions?.w || '0',
          h: product.dimensions?.h || '0',
          d: product.dimensions?.d || '0',
        },
        modifications: product.modifications || [],
        category: product.category || 'Other',
        stockLevel: Number(product.stockLevel || 0),
        minStock: Number(product.minStock || 0),
        supplier: (product as any).supplier || '',
        status: 'Active',
        createdAt: now,
        updatedAt: now,
      });

      console.log(`Seeded product: ${product.sku} - ${product.name}`);
    }

    console.log('All products seeded successfully.');
    await signOut(auth);
  } catch (error) {
    console.error('Failed to seed products:', error);
    process.exit(1);
  }
};

seedProducts();
