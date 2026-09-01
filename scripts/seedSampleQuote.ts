import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { getLeads } from '../services/customerLeadService';
import { getProducts } from '../services/productService';
import { getStores } from '../services/storeService';
import {
  createQuote,
  generateQuoteNumber,
  makeQuoteItem,
} from '../services/quoteService';

const seedSampleQuote = async () => {
  try {
    const email = process.env.SEED_ADMIN_EMAIL;
    const password = process.env.SEED_ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error('SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD are required to write a sample quote.');
    }

    await signInWithEmailAndPassword(auth, email, password);
    console.log(`Signed in as ${email}`);

    const [leads, products, stores] = await Promise.all([
      getLeads(),
      getProducts(),
      getStores(),
    ]);

    const lead = leads[0];
    const selectedProducts = products.slice(0, 2);
    const store = stores.find((item) => item.id === lead?.assignedStoreId) || stores[0];

    if (selectedProducts.length === 0) {
      throw new Error('No catalog products found. Seed products first.');
    }

    const lineItems = selectedProducts.map((product) => makeQuoteItem(product, 1));
    const subtotal = lineItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const discount = 0;
    const taxRate = 0.13;
    const taxAmount = subtotal * taxRate;
    const total = subtotal + taxAmount;

    const quoteId = await createQuote({
      quoteNumber: generateQuoteNumber(),
      customerId: lead?.customerId || `manual-${Date.now()}`,
      leadId: lead?.id || '',
      customerName: lead?.customerName || 'Sample Customer',
      customerEmail: lead?.email || 'sample@example.com',
      customerPhone: lead?.phone || '555-0100',
      projectAddress: lead?.projectAddress || '123 Sample Street, Scarborough, ON',
      storeId: store?.id || 'S1',
      managerName: lead?.assignedManager || store?.manager_name || 'Julie Li',
      lineItems,
      subtotal,
      discount,
      taxRate,
      taxAmount,
      total,
      status: 'Draft',
      notes: 'Sample quote created for ERP testing.',
      createdBy: 'seed-script',
    });

    console.log(`Seeded sample quote: ${quoteId}`);
    console.log('Sample quote seeded successfully.');
    await signOut(auth);
  } catch (error) {
    console.error('Failed to seed sample quote:', error);
    process.exit(1);
  }
};

seedSampleQuote();
