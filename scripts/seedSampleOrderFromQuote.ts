import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { getQuotes } from '../services/quoteService';
import { convertQuoteToOrder } from '../services/orderService';

const seedSampleOrderFromQuote = async () => {
  try {
    const email = process.env.SEED_ADMIN_EMAIL;
    const password = process.env.SEED_ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error('SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD are required to convert a sample quote.');
    }

    await signInWithEmailAndPassword(auth, email, password);
    console.log(`Signed in as ${email}`);

    const quotes = await getQuotes();
    const acceptedQuote = quotes.find((quote) => quote.status === 'Accepted');

    if (!acceptedQuote) {
      console.log('No accepted quote found. In ERP, set a quote status to Accepted first.');
      await signOut(auth);
      return;
    }

    const result = await convertQuoteToOrder(acceptedQuote, 'seed-script');
    console.log(`Converted quote ${acceptedQuote.quoteNumber} to order ${result.orderNumber}`);
    console.log(`Order ID: ${result.orderId}`);
    console.log(`Production task ID: ${result.productionTaskId}`);
    console.log('Sample order seeded successfully.');
    await signOut(auth);
  } catch (error) {
    console.error('Failed to seed sample order from quote:', error);
    process.exit(1);
  }
};

seedSampleOrderFromQuote();
