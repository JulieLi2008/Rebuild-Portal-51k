import { setDoc, doc } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { PERMISSION_COLUMNS } from '../script.js';

const buildPermissions = (allowed: string[]) =>
  PERMISSION_COLUMNS.reduce((acc, permission) => {
    acc[permission] = allowed.includes(permission);
    return acc;
  }, {} as Record<string, boolean>);

const allPermissions = PERMISSION_COLUMNS.reduce((acc, permission) => {
  acc[permission] = true;
  return acc;
}, {} as Record<string, boolean>);

const roles = [
  {
    id: 'SuperAdmin',
    name: 'SuperAdmin',
    permissions: allPermissions,
  },
  {
    id: 'Manager',
    name: 'Manager',
    permissions: buildPermissions([
      'view_dashboard',
      'view_customers',
      'create_customers',
      'edit_customers',
      'view_customer_phone',
      'view_customer_email',
      'view_customer_address',
      'view_leads',
      'create_leads',
      'edit_leads',
      'view_quotes',
      'create_quotes',
      'edit_quotes',
      'view_quote_price',
      'approve_quotes',
      'convert_quotes',
      'view_orders',
      'create_orders',
      'edit_orders',
      'view_store_orders',
      'view_order_payment',
      'view_production_tasks',
      'assign_tasks',
      'complete_tasks',
      'view_design_files',
      'view_drawings',
      'upload_files',
      'view_production_specs',
      'view_inventory',
      'edit_inventory',
      'view_catalog',
      'edit_catalog',
      'view_stores',
      'view_hr_labor',
      'create_team_members',
      'edit_team_members',
      'view_labor_rate',
      'view_reports',
      'run_ai_diagnostics',
    ]),
  },
  {
    id: 'Sales',
    name: 'Sales',
    permissions: buildPermissions([
      'view_dashboard',
      'view_customers',
      'create_customers',
      'edit_customers',
      'view_customer_phone',
      'view_customer_email',
      'view_customer_address',
      'view_leads',
      'create_leads',
      'edit_leads',
      'view_quotes',
      'create_quotes',
      'edit_quotes',
      'view_quote_price',
      'view_orders',
      'view_store_orders',
      'view_catalog',
    ]),
  },
  {
    id: 'Accounting',
    name: 'Accounting',
    permissions: buildPermissions([
      'view_dashboard',
      'view_customers',
      'view_customer_email',
      'view_quotes',
      'view_quote_price',
      'view_orders',
      'view_all_orders',
      'view_order_payment',
      'view_hr_labor',
      'view_labor_rate',
      'view_payroll',
      'view_accounting',
      'view_payment',
      'edit_payment',
      'view_credit',
      'edit_credit',
      'view_reports',
    ]),
  },
  {
    id: 'Designer',
    name: 'Designer',
    permissions: buildPermissions([
      'view_dashboard',
      'view_customers',
      'view_customer_phone',
      'view_customer_email',
      'view_customer_address',
      'view_leads',
      'view_quotes',
      'view_orders',
      'view_store_orders',
      'view_production_tasks',
      'complete_tasks',
      'view_design_files',
      'view_drawings',
      'upload_files',
      'view_production_specs',
    ]),
  },
  {
    id: 'Cabinet Maker',
    name: 'Cabinet Maker',
    permissions: buildPermissions([
      'view_dashboard',
      'view_orders',
      'view_store_orders',
      'view_production_tasks',
      'complete_tasks',
      'view_drawings',
      'view_production_specs',
      'view_inventory',
      'view_catalog',
    ]),
  },
  {
    id: 'Installer',
    name: 'Installer',
    permissions: buildPermissions([
      'view_dashboard',
      'view_orders',
      'view_store_orders',
      'view_production_tasks',
      'complete_tasks',
      'view_customer_phone',
      'view_customer_address',
      'view_drawings',
      'upload_files',
    ]),
  },
  {
    id: 'Installer Helper',
    name: 'Installer Helper',
    permissions: buildPermissions([
      'view_dashboard',
      'view_production_tasks',
      'complete_tasks',
      'view_customer_address',
      'view_drawings',
    ]),
  },
  {
    id: 'Subcontractor',
    name: 'Subcontractor',
    permissions: buildPermissions([
      'view_dashboard',
      'view_orders',
      'view_store_orders',
      'view_production_tasks',
      'complete_tasks',
      'view_customer_address',
      'view_design_files',
      'view_drawings',
      'view_production_specs',
    ]),
  },
  {
    id: 'Countertop Subcontractor',
    name: 'Countertop Subcontractor',
    permissions: buildPermissions([
      'view_dashboard',
      'view_orders',
      'view_store_orders',
      'view_production_tasks',
      'complete_tasks',
      'view_customer_address',
      'view_design_files',
      'view_drawings',
      'view_production_specs',
    ]),
  },
  {
    id: 'Worker',
    name: 'Worker',
    permissions: buildPermissions([
      'view_dashboard',
      'view_orders',
      'view_store_orders',
      'view_production_tasks',
      'complete_tasks',
      'view_drawings',
      'view_production_specs',
      'view_inventory',
      'view_catalog',
    ]),
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
