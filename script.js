/**
 * Central Mock Database with relational schemas
 * Standardizing data for Quotes, Access, and Task Management
 * This structure mirrors a Firebase NoSQL collection setup.
 */

export const mockDatabase = {
  // A. Products (Master Catalog)
  products: [
    { id: 'P0', sku: 'CAB-UP-WHT', name: 'Upper Cabinet White', base_price: 150, unit: 'Piece', dimensions: { w: '24', h: '30', d: '12' }, modifications: ["Glass Ready", "Finished Ends"], category: 'Cabinet Style', stockLevel: 45, minStock: 10 },
    { id: 'P1', sku: 'CAB-BS-WHT', name: 'Base Cabinet White', base_price: 210, unit: 'Piece', dimensions: { w: '24', h: '34.5', d: '24' }, modifications: ["Soft Close"], category: 'Cabinet Style', stockLevel: 32, minStock: 10 },
    { id: 'P2', sku: 'CAB-DRW-3', name: '3-Drawer Base Unit', base_price: 285, unit: 'Piece', dimensions: { w: '18', h: '34.5', d: '24' }, modifications: ["Metal Slides"], category: 'Cabinet Style', stockLevel: 15, minStock: 5 },
    { id: 'P3', sku: 'ACC-HNG-SC', name: 'Soft-Close Hinge', base_price: 8.50, unit: 'Piece', dimensions: { w: '2', h: '4', d: '1' }, modifications: [], category: 'Hardware', stockLevel: 450, minStock: 100 },
    { id: 'P4', sku: 'ACC-HDL-BLK', name: 'Matte Black Handle', base_price: 12.00, unit: 'Piece', dimensions: { w: '6', h: '0.5', d: '1' }, modifications: [], category: 'Hardware', stockLevel: 280, minStock: 50 },
    { id: 'P5', sku: 'MAT-PLY-34', name: '3/4" Birch Plywood', base_price: 95, unit: 'Sheet', dimensions: { w: '48', h: '96', d: '0.75' }, modifications: ["UV Coated"], category: 'Material', stockLevel: 85, minStock: 20 },
    { id: 'P6', sku: 'CAB-PNR-B', name: 'Pantry Tall Unit', base_price: 450, unit: 'Piece', dimensions: { w: '24', h: '84', d: '24' }, modifications: ["Roll-out Trays"], category: 'Cabinet Style', stockLevel: 8, minStock: 2 },
    { id: 'P7', sku: 'ACC-LFT-AV', name: 'Blum Aventos Lift', base_price: 185, unit: 'Set', dimensions: { w: '4', h: '6', d: '4' }, modifications: [], category: 'Hardware', stockLevel: 12, minStock: 5 },
    { id: 'P8', sku: 'MAT-EDG-WHT', name: 'PVC Edgebanding White', base_price: 0.45, unit: 'Feet', dimensions: { w: '0.8', h: '0.1', d: '0.1' }, modifications: [], category: 'Material', stockLevel: 5000, minStock: 1000 },
    { id: 'P9', sku: 'SUP-GLU-WP', name: 'Wood Glue - Waterproof', base_price: 15.99, unit: 'Gallon', dimensions: { w: '8', h: '12', d: '8' }, modifications: [], category: 'Material', stockLevel: 24, minStock: 6 },
  ],

  // B. Stores
  stores: [
    { id: 'S1', store_name: 'Toronto Flagship', manager_name: 'Leo Admin', address: '115 Ironside Crescent, ON', commissionRate: 15 },
    { id: 'S2', store_name: 'Vancouver Hub', manager_name: 'Sarah West', address: '450 Terminal Ave, BC', commissionRate: 12 },
    { id: 'S3', store_name: 'Montreal Depot', manager_name: 'Jean Leduc', address: '88 Rue Saint-Paul, QC', commissionRate: 10 },
    { id: 'S4', store_name: 'Online Store', manager_name: 'Digital Team', address: 'Cloud Distribution', commissionRate: 5 },
  ],

  // C. Orders (Transactions)
  orders: [
    {
      id: 'O1',
      order_no: '401',
      store_id: 'S1',
      manager_name: 'Leo Admin',
      client_info: { name: 'John Smith', address: '100 Main St', phone: '555-0101', email: 'j.smith@example.com' },
      line_items: [{ product: { id: 'P1', name: 'Base Cabinet White', base_price: 210 }, quantity: 4 }],
      status: 'Pending',
      date: '2025-05-10',
      due_date: '2025-06-15'
    },
    {
      id: 'O2',
      order_no: '402',
      store_id: 'S2',
      manager_name: 'Sarah West',
      client_info: { name: 'Maria Garcia', address: '200 Oak Ave', phone: '555-0102', email: 'm.garcia@example.com' },
      line_items: [{ product: { id: 'P0', name: 'Upper Cabinet White', base_price: 150 }, quantity: 2 }],
      status: 'In Process',
      date: '2025-05-12',
      due_date: '2025-05-20' // Late Delivery Example
    },
    {
      id: 'O3',
      order_no: '403',
      store_id: 'S1',
      manager_name: 'Leo Admin',
      client_info: { name: 'Robert Brown', address: '300 Pine Dr', phone: '555-0103', email: 'r.brown@example.com' },
      line_items: [{ product: { id: 'P6', name: 'Pantry Tall Unit', base_price: 450 }, quantity: 1 }],
      status: 'Quality Check',
      date: '2025-05-14',
      due_date: '2025-06-01'
    }
  ],

  // D. Production Tasks (Workflow Tracking)
  productionTasks: [
    {
      order_id: 'O1',
      tasks: [
        { id: 'T1-1', task_name: 'Board Cutting', is_complete: false, signed_by: '', notes: '' },
        { id: 'T1-2', task_name: 'Edgebanding', is_complete: false, signed_by: '', notes: '' },
        { id: 'T1-3', task_name: 'Assembly', is_complete: false, signed_by: '', notes: '' },
        { id: 'T1-4', task_name: 'Quality Assurance', is_complete: false, signed_by: '', notes: '' }
      ]
    },
    {
      order_id: 'O2',
      started_at: '2025-05-13T09:00:00Z',
      tasks: [
        { id: 'T2-1', task_name: 'Board Cutting', is_complete: true, signed_by: 'KW', notes: 'Standard cut' },
        { id: 'T2-2', task_name: 'Edgebanding', is_complete: false, signed_by: '', notes: '' },
        { id: 'T2-3', task_name: 'Assembly', is_complete: false, signed_by: '', notes: '' },
        { id: 'T2-4', task_name: 'Quality Assurance', is_complete: false, signed_by: '', notes: '' }
      ]
    },
    {
      order_id: 'O3',
      started_at: '2025-05-13T14:30:00Z',
      tasks: [
        { id: 'T3-1', task_name: 'Board Cutting', is_complete: true, signed_by: 'KW', notes: '' },
        { id: 'T3-2', task_name: 'Edgebanding', is_complete: true, signed_by: 'KW', notes: '' },
        { id: 'T3-3', task_name: 'Assembly', is_complete: true, signed_by: 'AS', notes: '' },
        { id: 'T3-4', task_name: 'Quality Assurance', is_complete: false, signed_by: '', notes: '' }
      ]
    }
  ],

  // E. Roles (Access Control Extended Matrix)
  roles: [
    { 
      id: 'SuperAdmin', 
      name: 'SuperAdmin', 
      permissions: {}
    },
    { 
      id: 'Manager', 
      name: 'Manager', 
      permissions: {
        view_dashboard: true,
        view_customers: true,
        create_customers: true,
        edit_customers: true,
        view_customer_phone: true,
        view_customer_email: true,
        view_customer_address: true,
        view_leads: true,
        create_leads: true,
        edit_leads: true,
        view_quotes: true,
        create_quotes: true,
        edit_quotes: true,
        view_quote_price: true,
        approve_quotes: true,
        convert_quotes: true,
        view_orders: true,
        create_orders: true,
        edit_orders: true,
        view_store_orders: true,
        view_order_payment: true,
        view_production_tasks: true,
        assign_tasks: true,
        complete_tasks: true,
        view_design_files: true,
        view_drawings: true,
        upload_files: true,
        view_production_specs: true,
        view_inventory: true,
        edit_inventory: true,
        view_catalog: true,
        edit_catalog: true,
        view_stores: true,
        view_hr_labor: true,
        create_team_members: true,
        edit_team_members: true,
        view_labor_rate: true,
        view_reports: true,
        run_ai_diagnostics: true
      }
    },
    { 
      id: 'Sales', 
      name: 'Sales', 
      permissions: {
        view_dashboard: true,
        view_customers: true,
        create_customers: true,
        edit_customers: true,
        view_customer_phone: true,
        view_customer_email: true,
        view_customer_address: true,
        view_leads: true,
        create_leads: true,
        edit_leads: true,
        view_quotes: true,
        create_quotes: true,
        edit_quotes: true,
        view_quote_price: true,
        view_orders: true,
        view_store_orders: true,
        view_catalog: true
      }
    },
    { 
      id: 'Accounting', 
      name: 'Accounting', 
      permissions: {
        view_dashboard: true,
        view_customers: true,
        view_customer_email: true,
        view_quotes: true,
        view_quote_price: true,
        view_orders: true,
        view_all_orders: true,
        view_order_payment: true,
        view_hr_labor: true,
        view_labor_rate: true,
        view_payroll: true,
        view_accounting: true,
        view_payment: true,
        edit_payment: true,
        view_credit: true,
        edit_credit: true,
        view_reports: true
      }
    },
    {
      id: 'Designer',
      name: 'Designer',
      permissions: {
        view_dashboard: true,
        view_customers: true,
        view_customer_phone: true,
        view_customer_email: true,
        view_customer_address: true,
        view_leads: true,
        view_quotes: true,
        view_orders: true,
        view_store_orders: true,
        view_production_tasks: true,
        complete_tasks: true,
        view_design_files: true,
        view_drawings: true,
        upload_files: true,
        view_production_specs: true
      }
    },
    {
      id: 'Cabinet Maker',
      name: 'Cabinet Maker',
      permissions: {
        view_dashboard: true,
        view_orders: true,
        view_store_orders: true,
        view_production_tasks: true,
        complete_tasks: true,
        view_drawings: true,
        view_production_specs: true,
        view_inventory: true,
        view_catalog: true
      }
    },
    {
      id: 'Installer',
      name: 'Installer',
      permissions: {
        view_dashboard: true,
        view_orders: true,
        view_store_orders: true,
        view_production_tasks: true,
        complete_tasks: true,
        view_customer_phone: true,
        view_customer_address: true,
        view_drawings: true,
        upload_files: true
      }
    }
  ]
};

export const INITIAL_USERS = [
  { id: 'U1', name: 'Leo CEO', email: 'admin@51wood.ca', role: 'SuperAdmin', approved: true, joinDate: '2023-01-01' },
  { id: 'U2', name: 'Sarah Manager', email: 'sarah@51wood.ca', role: 'Manager', storeId: 'S1', approved: true, joinDate: '2023-05-12' },
  { id: 'U3', name: 'Mike Sales', email: 'mike@51wood.ca', role: 'Sales', storeId: 'S2', approved: true, joinDate: '2024-02-15' },
  { id: 'U4', name: 'Janet Finance', email: 'finance@51wood.ca', role: 'Accounting', approved: true, joinDate: '2024-03-01' },
];

export const ASSEMBLY_TASKS = ['Board Cutting', 'Edgebanding', 'Drilling', 'Assembly', 'Packing', 'Logistics Out'];

export const PERMISSION_COLUMNS = [
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
  'view_all_orders',
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
  'edit_stores',
  'view_data_center',

  'view_hr_labor',
  'create_team_members',
  'edit_team_members',
  'delete_team_members',
  'view_labor_rate',
  'edit_labor_rate',
  'view_payroll',
  'approve_payroll',

  'view_accounting',
  'view_payment',
  'edit_payment',
  'view_credit',
  'edit_credit',

  'view_reports',
  'run_ai_diagnostics',

  'manage_roles',
  'manage_users',
];

mockDatabase.roles.find((role) => role.name === 'SuperAdmin').permissions =
  Object.fromEntries(PERMISSION_COLUMNS.map((permission) => [permission, true]));

export const WORKFLOW_STEPS = [
  { id: 'combo', label: 'Combo Selection' },
  { id: 'cabinet-style', label: 'Cabinet Styles' },
  { id: 'hardware', label: 'Hardware' }
];
