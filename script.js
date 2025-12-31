
/**
 * Global Constants and Mock Data for the 51K Portal
 */

export const INITIAL_STORES = [
  { id: 'S1', name: 'Toronto Flagship', address: '115 Ironside Crescent', email: 'main@51wood.ca', phone: '416-292-9788', managerId: 'U2', isActive: true, commissionRate: 15 },
  { id: 'S2', name: 'North York Studio', address: '250 Manufacturing Way', email: 'ny@51wood.ca', phone: '416-555-0999', isActive: true, commissionRate: 12 },
];

export const INITIAL_USERS = [
  { id: 'U1', name: 'Leo SuperAdmin', email: 'admin@51wood.ca', role: 'SuperAdmin', approved: true, joinDate: '2023-01-01' },
  { id: 'U2', name: 'Sarah Manager', email: 'sarah@51wood.ca', role: 'Manager', storeId: 'S1', approved: true, joinDate: '2023-05-12' },
  { id: 'U3', name: 'Mike Sales', email: 'mike@51wood.ca', role: 'Sales', storeId: 'S1', approved: true, joinDate: '2023-06-10' },
  { id: 'U4', name: 'Kevin Worker', email: 'kevin@factory.ca', role: 'FactoryWorker', approved: true, joinDate: '2023-02-15' },
  { id: 'U5', name: 'James Supplier', email: 'james@lumber.ca', role: 'Supplier', approved: true, joinDate: '2023-08-01' },
  { id: 'U6', name: 'Waitlist User', email: 'pending@gmail.com', role: 'Sales', approved: false, joinDate: '2024-02-28' },
];

export const MOCK_PRODUCTS = Array.from({ length: 45 }).map((_, i) => ({
  id: `P${i}`,
  name: i < 5 ? ['Upper Cabinet', 'Base Cabinet', 'Corner Unit', 'Pantry Board', 'Drawer'][i] : `Product SKU-${1000 + i}`,
  category: i < 15 ? 'Cabinet Style' : i < 30 ? 'Hardware' : 'Accessory',
  price: Math.floor(Math.random() * 200) + 20,
  unit: i < 5 ? 'Feet' : 'Piece',
  image: '',
  stockLevel: Math.floor(Math.random() * 500),
  minStock: 50
}));

export const MOCK_FACTORIES = [
  { name: 'JulieFactory', address: '2300 Kennedy Rd.', email: 'juliefactory@gmail.com', phone: '6666666666', contact: 'Julie', services: '', volume: '$45,200', margin: '20%' },
  { name: 'Viceroy', address: '414croft street east', email: 'tony.ku@viceroybuilding.com', phone: '6476797803', contact: 'tony', services: 'Cabinet, Door, Factory', volume: '$32,800', margin: '18%' },
  { name: 'Unihopper', address: '110 Denison St #10, Markham, ON L3R 1B6', email: 'service@uniteckhardware.com', phone: '6477186688', contact: '未知', services: '' },
  { name: 'Winnec hardware', address: '65 Bowes Road, Unit 8 Vaughan, Ontario L3R 1E4 Canada', email: 'info@winnecinc.com', phone: '9056045515', contact: '未知', services: '' },
  { name: 'K.M.S Hardware', address: '825 Middlefield Rd, Scarborough, ON M1V 4Z7', email: '待补充', phone: '6418800716', contact: 'Kenny', services: '' },
  { name: 'JC,Eurofit', address: '7055 Fir Tree Dr. Mississauga, Ontario L5S 1J7 Canada', email: 'service@eurofitca.com', phone: '4168389520', contact: 'Merphy', services: '' },
  { name: 'MIF', address: '待补充', email: '待补充', phone: '9058505888', contact: '未知', services: '' },
  { name: 'Decotec', address: '975 Alness Street North York Ontario, M3J', email: 'Ltal@decotecinc.com', phone: '6473020889', contact: 'Mike', services: '' },
];

export const MOCK_STORE_ORDERS = [
  { date: '2025-12-16 17:29:48', orderNo: '374', sales: 'Shirley', client: 'William', address: '1828 Dencourt Dr', phone: '416-555-0101', total: '1746.00', cabinet: 'WPS White Particle Door', status: 'Assigned to Hourly Designer', storeId: 'S1' },
  { date: '2025-11-05 20:55:55', orderNo: '372', sales: 'JulieAdmin', client: 'JulieCustomer LiCustomer', address: '2300 Kennedy Rd.', phone: '8888888888', total: '3709.83', cabinet: 'WPS Highgloss Door', status: 'Assigned to Hourly Maker Pool', storeId: 'S2' },
  { date: '2025-11-03 16:00:39', orderNo: '368', sales: 'Julie', client: 'Tom Customers', address: '2300 Kennedy rd.', phone: '416-555-0102', total: '7552.70', cabinet: 'WPS White Particle Door', status: 'Contract Maker Pool', storeId: 'S1' },
  { date: '2024-12-21 20:12:02', orderNo: '367', sales: 'Mike', client: 'curt w?', address: '28 Carolbreen SQ', phone: '4617777777', total: '0.00', cabinet: 'High Gloss MDF', status: 'Assigned to Hourly Maker Pool', storeId: 'S1' },
  { date: '2024-12-20 20:15:10', orderNo: '366', sales: 'Sarah', client: 'curt w?', address: '28 Carolbreen SQ', phone: '4617777777', total: '0.00', cabinet: 'Maple Solid', status: 'pending', storeId: 'S2' },
];

export const WORKFLOW_STEPS = [
  { id: 'combo', label: 'Combo Selection' },
  { id: 'cabinet-style', label: 'Cabinet Styles' },
  { id: 'cabinet-color', label: 'Cabinet Color' },
  { id: 'door-style', label: 'Door Styles' },
  { id: 'door-color', label: 'Door Color' },
  { id: 'countertop', label: 'Countertop' },
  { id: 'handles', label: 'Hardware' },
  { id: 'sink', label: 'Sink/Faucet' },
  { id: 'molding', label: 'Molding' },
  { id: 'accessories', label: 'Accessories' }
];

export const ASSEMBLY_TASKS = [
  'Board Cutting',
  'Assembly',
  'Door Installation',
  'Edgebanding',
  'Cabinet Delivery',
  'Cabinet Installation',
  'Payment'
];

export const PERMISSION_COLUMNS = [
  'Name', 'Cell', 'Phone', 'Address', 'Email', // Contact Info
  'Drawing', 'Upload', 'Payment', 'Order', 'Credit', // Operations
  'Comment', 'Review', 'Reviews', // Feedback
  'Store Orders', 'All Orders', 'Order Tasks' // Management
];

export const INITIAL_ROLE_PERMISSIONS = [
  { 
    id: '1', 
    name: 'Store Admin', 
    permissions: { 
      Name: true, Cell: true, Phone: true, Address: true, Email: true, 
      Drawing: true, Upload: true, Payment: true, Order: true, Credit: true, 
      Comment: true, Review: false, Reviews: false, 
      'Store Orders': true, 'All Orders': false, 'Order Tasks': true 
    } 
  },
  { 
    id: '2', 
    name: 'Store Sales', 
    permissions: { 
      Name: true, Cell: true, Phone: true, Address: true, Email: true, 
      Drawing: true, Upload: true, Payment: true, Order: true, Credit: true, 
      Comment: true, Review: false, Reviews: false, 
      'Store Orders': false, 'All Orders': false, 'Order Tasks': false 
    } 
  },
  { 
    id: '3', 
    name: 'Super Admin', 
    permissions: { 
      Name: true, Cell: true, Phone: true, Address: true, Email: true, 
      Drawing: true, Upload: true, Payment: true, Order: true, Credit: true, 
      Comment: true, Review: true, Reviews: true, 
      'Store Orders': true, 'All Orders': true, 'Order Tasks': true 
    } 
  },
  { 
    id: '4', 
    name: 'Designer', 
    permissions: { 
      Name: true, Cell: true, Phone: true, Address: true, Email: false, 
      Drawing: true, Upload: true, Payment: false, Order: true, Credit: false, 
      Comment: true, Review: false, Reviews: false, 
      'Store Orders': false, 'All Orders': false, 'Order Tasks': false 
    } 
  },
];
