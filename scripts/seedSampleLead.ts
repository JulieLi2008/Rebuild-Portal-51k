import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { createCustomerAndLead } from '../services/customerLeadService';

const seedSampleLead = async () => {
  try {
    const email = process.env.SEED_ADMIN_EMAIL;
    const password = process.env.SEED_ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error('SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD are required to write a sample lead.');
    }

    await signInWithEmailAndPassword(auth, email, password);
    console.log(`Signed in as ${email}`);

    const result = await createCustomerAndLead({
      firstName: 'Sample',
      lastName: 'Customer',
      email: 'sample@example.com',
      phone: '555-0100',
      customerAddress: '123 Sample Street',
      city: 'Scarborough',
      province: 'ON',
      postalCode: '',
      projectAddress: '123 Sample Street, Scarborough, ON',
      projectType: 'Kitchen Cabinet',
      source: 'info@51wood.ca',
      status: 'New',
      budget: '$5,000 - $10,000',
      timeline: 'Within 1 month',
      notes: 'Sample lead created for ERP testing.',
      assignedStoreId: 'S1',
      assignedManager: 'Julie Li',
      createdBy: 'seed-script',
    });

    console.log(`Seeded sample customer: ${result.customerId}`);
    console.log(`Seeded sample lead: ${result.leadId}`);
    console.log('Sample lead seeded successfully.');
    await signOut(auth);
  } catch (error) {
    console.error('Failed to seed sample lead:', error);
    process.exit(1);
  }
};

seedSampleLead();
