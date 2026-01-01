/**
 * Central Mock Database with relational schemas
 * Standardizing data for Quotes, Access, and Task Management
 * This structure mirrors a Firebase NoSQL collection setup.
 */

export const mockDatabase = {
  // A. Products (Master Catalog)
  products: Array.from({ length: 15 }).map((_, i) => ({
    id: `P${i}`,
    sku: `SKU-${1000 + i}`,
    name: i < 5 ? ['Upper Cabinet', 'Base Cabinet', 'Corner Unit', 'Pantry Board', 'Drawer'][i] : `Cabinet Component-${1000 + i}`,
    base_price: Math.floor(Math.random() * 200) + 20,
    unit: i < 5 ? 'Feet' : 'Piece',
    dimensions: { w: '24"', h: '30"', d: '12"' },
    modifications: ["Finished Ends", "Glass Ready", "Custom Color", "Soft Close"],
    category: i < 5 ? 'Cabinet Style' : i < 10 ? 'Hardware' : 'Accessory',
    stockLevel: Math.floor(Math.random() * 100) + 10,
    minStock: 5
  })),

  // B. Stores
  stores: [
    { id: 'S1', store_name: 'Toronto Flagship', manager_name: 'Leo Admin', address: '115 Ironside Crescent, ON', commissionRate: 15 },
    { id: 'S2', store_name: 'North York Studio', manager_name: 'Sarah Manager', address: '250 Manufacturing Way, ON', commissionRate: 12 },
    { id: 'S3', store_name: 'Etobicoke Design', manager_name: 'James Wilson', address: '88 Design Court, ON', commissionRate: 10 },
  ],

  // C. Orders (Transactions)
  orders: [
    {
      id: 'O1',
      order_no: '374',
      store_id: 'S1',
      manager_name: 'Leo Admin',
      client_info: {
        name: 'William Henderson',
        address: '1828 Dencourt Dr, Toronto, ON',
        phone: '416-555-0101',
        email: 'will@example.com'
      },
      line_items: [
        { product: { id: 'P0', name: 'Upper Cabinet', base_price: 150 }, quantity: 4 },
        { product: { id: 'P1', name: 'Base Cabinet', base_price: 200 }, quantity: 2 }
      ],
      status: 'Production',
      date: '2025-05-10'
    }
  ],

  // D. Production Tasks (Workflow Tracking)
  productionTasks: [
    {
      order_id: 'O1',
      tasks: [
        { id: 'T1', task_name: 'Board Cutting', is_complete: true, signed_by: 'KW' },
        { id: 'T2', task_name: 'Edgebanding', is_complete: false, signed_by: '' },
        { id: 'T3', task_name: 'Assembly', is_complete: false, signed_by: '' },
        { id: 'T4', task_name: 'Quality Check', is_complete: false, signed_by: '' }
      ]
    }
  ],

  // E. Roles (Access Control)
  roles: [
    { 
      id: 'R1', 
      name: 'SuperAdmin', 
      permissions: { 
        Name: true, Cell: true, Phone: true, Address: true, Email: true, 
        Drawing: true, 'Store Orders': true, 'All Orders': true, 'Order Tasks': true 
      } 
    },
    { 
      id: 'R2', 
      name: 'Manager', 
      permissions: { 
        Name: true, Cell: true, Phone: true, Address: true, Email: true, 
        Drawing: true, 'Store Orders': true, 'All Orders': false, 'Order Tasks': true 
      } 
    },
    { 
      id: 'R3', 
      name: 'Sales', 
      permissions: { 
        Name: true, Cell: true, Phone: true, Address: true, Email: true, 
        Drawing: true, 'Store Orders': true, 'All Orders': false, 'Order Tasks': false 
      } 
    }
  ]
};

export const INITIAL_USERS = [
  { id: 'U1', name: 'Leo CEO', email: 'admin@51wood.ca', role: 'SuperAdmin', approved: true, joinDate: '2023-01-01' },
  { id: 'U2', name: 'Sarah Manager', email: 'sarah@51wood.ca', role: 'Manager', storeId: 'S1', approved: true, joinDate: '2023-05-12' },
  { id: 'U3', name: 'Mike Sales', email: 'mike@51wood.ca', role: 'Sales', storeId: 'S2', approved: true, joinDate: '2024-02-15' },
];

export const ASSEMBLY_TASKS = ['Board Cutting', 'Edgebanding', 'Drilling', 'Assembly', 'Packing', 'Logistics Out'];
export const PERMISSION_COLUMNS = ['Name', 'Cell', 'Phone', 'Address', 'Email', 'Drawing', 'Store Orders', 'All Orders', 'Order Tasks'];
export const WORKFLOW_STEPS = [
  { id: 'combo', label: 'Combo Selection' },
  { id: 'cabinet-style', label: 'Cabinet Styles' },
  { id: 'hardware', label: 'Hardware' }
];
