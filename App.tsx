import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  FilePlus, 
  ClipboardList, 
  Package, 
  LogOut, 
  Trash2,
  Sparkles,
  DollarSign,
  Plus,
  Edit3,
  Check,
  ListTodo,
  Layers,
  User,
  ShieldCheck,
  ShoppingCart,
  Building2,
  Construction,
  Warehouse,
  PlusCircle,
  Database,
  BarChart3,
  Activity,
  Hammer,
  Eye,
  Info,
  TrendingUp,
  X,
  PlusSquare,
  ChevronRight,
  Filter,
  Calendar,
  Save,
  ChevronDown,
  Lock,
  FileUp,
  UploadCloud,
  Search,
  Play,
  Clock,
  LogIn,
  Key
} from 'lucide-react';
import { 
  Order, 
  OrderStatus, 
  StoreInfo, 
  Product, 
  QuoteLineItem, 
  UserProfile, 
  UserRole,
  ProductionTasks,
  TaskItem
} from './types';
import { 
  INITIAL_USERS, 
  ASSEMBLY_TASKS, 
  PERMISSION_COLUMNS,
  mockDatabase
} from './script.js';
import { loginWithEmail, logoutUser, listenToAuthState, getUserProfile } from './services/authService';

/**
 * LOGIN SCREEN COMPONENT
 * Centered professional login card for authentication.
 */
const LoginScreen: React.FC<{ onLogin: (user: UserProfile) => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const credential = await loginWithEmail(email.trim(), password);
      const profile = await getUserProfile(credential.user.uid);

      if (!profile) {
        await logoutUser();
        setError('Your account exists but has not been approved in the ERP yet.');
        return;
      }

      if (!profile.approved) {
        await logoutUser();
        setError('Your ERP access is waiting for approval.');
        return;
      }

      onLogin(profile);
    } catch (err) {
      setError('Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        <div className="p-12">
          {/* Brand Logo */}
          <div className="flex flex-col items-center gap-4 mb-12">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200">
              <Layers size={32} />
            </div>
            <h1 className="text-2xl font-black tracking-tighter">51K PORTAL</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Enterprise Resource Control</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                placeholder="name@51wood.ca"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Security Key</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Authorizing...' : 'Authorize System Entry'} <LogIn size={16} />
            </button>
            {error && (
              <p className="text-sm font-bold text-red-500 text-center">{error}</p>
            )}
          </form>

          {/* Prototyping Quick Access — local development only */}
          {import.meta.env.DEV && (
            <div className="mt-12 pt-8 border-t border-slate-100">
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] text-center mb-6">Prototyping Sandbox Access</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'CEO', icon: ShieldCheck, user: INITIAL_USERS[0], color: 'text-blue-600 bg-blue-50' },
                  { label: 'Manager', icon: Building2, user: { ...INITIAL_USERS[1], storeId: 'S1' }, color: 'text-amber-600 bg-amber-50' },
                  { label: 'Worker', icon: Hammer, user: { ...INITIAL_USERS[2], role: 'Worker' }, color: 'text-slate-600 bg-slate-50' }
                ].map((role) => (
                  <button 
                    key={role.label}
                    type="button"
                    onClick={() => onLogin(role.user as UserProfile)}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-transparent hover:border-slate-200 hover:bg-white transition-all group"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${role.color} transition-all group-hover:scale-110`}>
                      <role.icon size={18} />
                    </div>
                    <span className="text-[9px] font-black uppercase text-slate-400">{role.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  // --- Central Data Store ---
  const [dbStores, setDbStores] = useState<StoreInfo[]>(mockDatabase.stores);
  const [dbProducts, setDbProducts] = useState<Product[]>(mockDatabase.products);
  const [dbOrders, setDbOrders] = useState<Order[]>(mockDatabase.orders as Order[]);
  const [dbProductionTasks, setDbProductionTasks] = useState<ProductionTasks[]>(mockDatabase.productionTasks);
  const [dbRoles, setDbRoles] = useState<any[]>(mockDatabase.roles);

  // --- Auth & Navigation ---
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeView, setActiveView] = useState('Dashboard');
  const [users] = useState<UserProfile[]>(INITIAL_USERS as UserProfile[]);

  useEffect(() => {
    const unsubscribe = listenToAuthState(async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          setCurrentUser(null);
          setAuthLoading(false);
          return;
        }

        const profile = await getUserProfile(firebaseUser.uid);

        if (!profile || !profile.approved) {
          await logoutUser();
          setCurrentUser(null);
          setAuthLoading(false);
          return;
        }

        setCurrentUser(profile);

        if (profile.role === 'Worker') {
          setActiveView('TaskManager');
        } else {
          setActiveView('Dashboard');
        }

        setAuthLoading(false);
      } catch (err) {
        console.error('Failed to load user profile:', err);
        await logoutUser();
        setCurrentUser(null);
        setAuthLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // --- Dashboard Filters ---
  const [dashFilterStore, setDashFilterStore] = useState('All');
  const [dashFilterPeriod, setDashFilterPeriod] = useState('All Time');

  // --- UI State ---
  const [activeTooltipID, setActiveTooltipID] = useState<string | null>(null);

  // --- Inventory Search & Filters ---
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryCategory, setInventoryCategory] = useState('All');

  // --- Task Manager Filter ---
  const [tmFilter, setTmFilter] = useState<string>('All');

  // --- Quote Workflow State ---
  const [quoteStep, setQuoteStep] = useState<1 | 2>(1);
  const [lineItems, setLineItems] = useState<QuoteLineItem[]>([]);
  const [clientInfo, setClientInfo] = useState({ 
    store_id: dbStores[0].id, 
    managerName: dbStores[0].manager_name, 
    firstName: '', 
    lastName: '', 
    cellPhone: '', 
    email: '', 
    address: '' 
  });

  // --- Quote Builder Step 2 New States ---
  const [globalDimensions, setGlobalDimensions] = useState({
    upperH: '30',
    lowerH: '35 1/4',
    upperD: '11 3/4',
    lowerD: '24',
    pantryH: '84',
    pantryD: '24',
    islandH: '35 1/4',
    islandD: '24'
  });
  const [expandedCategory, setExpandedCategory] = useState<string | null>("Select Cabinets");

  const selectionCategories = [
    "Select Combo",
    "Select Cabinet Style",
    "Select Cabinets",
    "Select Door Style",
    "Select Door Color",
    "Select Countertop",
    "Select Accessory",
    "Select Hardware",
    "Select Service",
    "Other Products"
  ];

  // --- Selection & Drill-down ---
  const [dcActiveTab, setDcActiveTab] = useState<'Orders' | 'Products' | 'Stores' | 'Tasks'>('Orders');

  // --- Modal States ---
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  
  // Forms States
  const [newRoleName, setNewRoleName] = useState('');
  const [newStoreData, setNewStoreData] = useState({ name: '', manager: '', address: '', commission: '10' });
  const [newProductData, setNewProductData] = useState({ name: '', sku: '', category: 'Hardware', price: '0', stock: '10', supplier: 'Standard' });

  // --- CSV Import State ---
  const [showImportModal, setShowImportModal] = useState(false);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvRows, setCsvRows] = useState<string[][]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({
    name: '',
    sku: '',
    supplier: '',
    price: '',
    stock: '',
    category: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get current user's role permissions
  const currentUserRolePermissions = useMemo(() => {
    if (!currentUser) return null;
    return dbRoles.find(r => r.name === currentUser.role)?.permissions || {};
  }, [currentUser, dbRoles]);

  const canAccess = (roles: UserRole[]) => currentUser && roles.includes(currentUser.role);

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    if (user.role === 'Worker') {
      setActiveView('TaskManager');
    } else {
      setActiveView('Dashboard');
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
    setActiveView('Dashboard');
  };

  // --- EXECUTIVE > ACCESS CONTROL Logic ---
  const togglePermission = (roleId: string, permissionName: string) => {
    setDbRoles(prev => prev.map(role => {
      if (role.id !== roleId) return role;
      const currentVal = role.permissions[permissionName] || false;
      return {
        ...role,
        permissions: {
          ...role.permissions,
          [permissionName]: !currentVal
        }
      };
    }));
  };

  const handleAddRole = () => {
    if (!newRoleName.trim()) return alert("Role name is required.");
    if (editingRoleId) {
      setDbRoles(prev => prev.map(r => r.id === editingRoleId ? { ...r, name: newRoleName } : r));
      setEditingRoleId(null);
    } else {
      const newRole = {
        id: `R${Date.now()}`,
        name: newRoleName,
        permissions: PERMISSION_COLUMNS.reduce((acc, col) => ({ ...acc, [col]: false }), {})
      };
      setDbRoles([...dbRoles, newRole]);
    }
    setNewRoleName('');
    setShowRoleModal(false);
  };

  const handleEditRole = (role: any) => {
    setNewRoleName(role.name);
    setEditingRoleId(role.id);
    setShowRoleModal(true);
  };

  const handleDeleteRole = (id: string) => {
    if (window.confirm("Are you sure you want to delete this role? This might affect existing users.")) {
      setDbRoles(prev => prev.filter(r => r.id !== id));
    }
  };

  // --- EXECUTIVE > STORES Logic ---
  const handleAddStore = () => {
    if (!newStoreData.name || !newStoreData.manager) return alert("Fill required fields.");
    const newStore: StoreInfo = {
      id: `S${Date.now()}`,
      store_name: newStoreData.name,
      manager_name: newStoreData.manager,
      address: newStoreData.address || 'TBD',
      commissionRate: parseInt(newStoreData.commission) || 10
    };
    setDbStores([...dbStores, newStore]);
    setNewStoreData({ name: '', manager: '', address: '', commission: '10' });
    setShowStoreModal(false);
  };

  // --- PRODUCTION > CATALOG Logic ---
  const handleAddProduct = () => {
    if (!newProductData.name || !newProductData.sku) return alert("Fill SKU and Name.");
    const newProd: Product = {
      id: `P${Date.now()}`,
      sku: newProductData.sku,
      name: newProductData.name,
      base_price: parseFloat(newProductData.price) || 0,
      unit: 'Piece',
      dimensions: { w: '0', h: '0', d: '0' },
      modifications: [],
      category: newProductData.category,
      stockLevel: parseInt(newProductData.stock) || 0,
      minStock: 5
    };
    setDbProducts([...dbProducts, newProd]);
    setNewProductData({ name: '', sku: '', category: 'Hardware', price: '0', stock: '10', supplier: 'Standard' });
    setShowProductModal(false);
  };

  // --- CSV Import Logic ---
  const handleCsvFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
      if (lines.length < 2) {
        alert("CSV file seems empty or invalid.");
        return;
      }

      const headers = lines[0].split(',').map(h => h.replace(/^["'](.+(?=["']$))["']$/, '$1').trim());
      const rows = lines.slice(1).map(line => {
        return line.split(',').map(cell => cell.replace(/^["'](.+(?=["']$))["']$/, '$1').trim());
      });

      setCsvHeaders(headers);
      setCsvRows(rows);
      
      const newMapping = { ...columnMapping };
      headers.forEach(h => {
        const lowerH = h.toLowerCase();
        if (lowerH.includes('name') || lowerH.includes('title')) newMapping.name = h;
        if (lowerH.includes('sku')) newMapping.sku = h;
        if (lowerH.includes('price') || lowerH.includes('cost')) newMapping.price = h;
        if (lowerH.includes('stock') || lowerH.includes('qty')) newMapping.stock = h;
        if (lowerH.includes('category')) newMapping.category = h;
        if (lowerH.includes('supplier')) newMapping.supplier = h;
      });
      setColumnMapping(newMapping);
      setShowImportModal(true);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const processImport = () => {
    if (!columnMapping.name || !columnMapping.sku) {
      alert("Please map at least Name and SKU fields.");
      return;
    }

    const nameIdx = csvHeaders.indexOf(columnMapping.name);
    const skuIdx = csvHeaders.indexOf(columnMapping.sku);
    const priceIdx = csvHeaders.indexOf(columnMapping.price);
    const stockIdx = csvHeaders.indexOf(columnMapping.stock);
    const categoryIdx = csvHeaders.indexOf(columnMapping.category);
    const supplierIdx = csvHeaders.indexOf(columnMapping.supplier);

    const importedProducts: Product[] = csvRows.map((row, idx) => {
      const priceVal = priceIdx !== -1 ? parseFloat(row[priceIdx]) : 0;
      const stockVal = stockIdx !== -1 ? parseInt(row[stockIdx]) : 0;
      
      return {
        id: `P-IMP-${Date.now()}-${idx}`,
        name: row[nameIdx] || 'Unnamed Product',
        sku: row[skuIdx] || `SKU-${idx}`,
        base_price: isNaN(priceVal) ? 0 : priceVal,
        stockLevel: isNaN(stockVal) ? 0 : stockVal,
        category: categoryIdx !== -1 ? row[categoryIdx] : 'Other',
        supplier: supplierIdx !== -1 ? row[supplierIdx] : 'Standard',
        unit: 'Piece',
        dimensions: { w: '0', h: '0', d: '0' },
        modifications: [],
        minStock: 5
      } as any;
    });

    setDbProducts(prev => [...prev, ...importedProducts]);
    setShowImportModal(false);
    alert(`Successfully imported ${importedProducts.length} items to catalog.`);
  };

  // --- SALES > QUOTE BUILDER Logic ---
  const handleStoreChange = (storeId: string) => {
    const store = dbStores.find(s => s.id === storeId);
    if (store) {
      setClientInfo(prev => ({
        ...prev,
        store_id: storeId,
        managerName: store.manager_name
      }));
    }
  };

  const addLineItem = (product: Product) => {
    setLineItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeLineItem = (productId: string) => {
    setLineItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const validateQuoteStep1 = () => {
    if (!clientInfo.firstName || !clientInfo.lastName || !clientInfo.cellPhone) {
      alert("Required: First Name, Last Name, and Cell Phone.");
      return;
    }
    setQuoteStep(2);
  };

  const handleSubmitQuote = () => {
    if (lineItems.length === 0) return alert("No items selected.");
    const newOrderId = `O${Date.now()}`;
    const newOrderNo = (400 + dbOrders.length).toString();

    const newOrder: Order = {
      id: newOrderId,
      order_no: newOrderNo,
      store_id: clientInfo.store_id,
      manager_name: clientInfo.managerName,
      client_info: {
        name: `${clientInfo.firstName} ${clientInfo.lastName}`,
        address: clientInfo.address,
        phone: clientInfo.cellPhone,
        email: clientInfo.email
      },
      line_items: [...lineItems],
      status: OrderStatus.Pending,
      date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0] // Default 2 weeks
    };

    const newTasks: ProductionTasks = {
      order_id: newOrderId,
      tasks: [
        ...ASSEMBLY_TASKS.slice(0, 4).map((name, i) => ({
          id: `TA-${newOrderId}-${i}`,
          task_name: name,
          is_complete: false,
          signed_by: '',
          notes: ''
        }))
      ]
    };

    setDbOrders([newOrder, ...dbOrders]);
    setDbProductionTasks([newTasks, ...dbProductionTasks]);
    setLineItems([]);
    setQuoteStep(1);
    setActiveView('TaskManager');
    alert(`Order #${newOrderNo} added to Production Task Board.`);
  };

  // --- PRODUCTION > TASK MANAGER Logic ---
  const toggleDbTask = (orderId: string, taskId: string) => {
    setDbProductionTasks(prev => prev.map(pt => pt.order_id === orderId ? {
      ...pt,
      tasks: pt.tasks.map(t => t.id === taskId ? { ...t, is_complete: !t.is_complete } : t)
    } : pt));

    // Simple Auto-update status logic
    const orderTasks = dbProductionTasks.find(pt => pt.order_id === orderId)?.tasks || [];
    const completedCount = orderTasks.filter(t => t.id === taskId ? !t.is_complete : t.is_complete).length;
    
    let newStatus = OrderStatus.InProcess;
    if (completedCount === orderTasks.length) newStatus = OrderStatus.Ready;
    else if (completedCount >= orderTasks.length - 1) newStatus = OrderStatus.QualityCheck;

    setDbOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const startOrderProduction = (orderId: string) => {
    setDbOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: OrderStatus.InProcess } : o));
    setDbProductionTasks(prev => prev.map(pt => pt.order_id === orderId ? { ...pt, started_at: new Date().toISOString() } : pt));
  };

  const updateDbTaskSignature = (orderId: string, taskId: string, initials: string) => {
    setDbProductionTasks(prev => prev.map(pt => pt.order_id === orderId ? {
      ...pt,
      tasks: pt.tasks.map(t => t.id === taskId ? { ...t, signed_by: initials.toUpperCase() } : t)
    } : pt));
  };

  const updateDbTaskNotes = (orderId: string, taskId: string, notes: string) => {
    setDbProductionTasks(prev => prev.map(pt => pt.order_id === orderId ? {
      ...pt,
      tasks: pt.tasks.map(t => t.id === taskId ? { ...t, notes } : t)
    } : pt));
  };

  // --- Scoped Data Calculation ---
  const dashboardStats = useMemo(() => {
    // If manager, force filter to their store
    const storeToFilter = currentUser?.storeId || dashFilterStore;
    
    const ordersForStats = dbOrders.filter(o => 
      (storeToFilter === 'All' || o.store_id === storeToFilter)
    );

    const revenue = ordersForStats.reduce((sum, o) => sum + o.line_items.reduce((a, b) => a + (b.product.base_price * b.quantity), 0), 0);
    const count = ordersForStats.length;
    const inventoryVal = dbProducts.reduce((sum, p) => sum + (p.base_price * p.stockLevel), 0);
    
    const ordersPerStore = dbStores.map(s => ({
      name: s.store_name,
      count: dbOrders.filter(o => o.store_id === s.id).length
    }));
    
    return { revenue, count, inventoryVal, ordersPerStore, ordersForStats };
  }, [dbOrders, dbStores, dbProducts, currentUser, dashFilterStore]);

  const filteredInventory = useMemo(() => {
    return dbProducts.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(inventorySearch.toLowerCase()) || 
                           p.sku.toLowerCase().includes(inventorySearch.toLowerCase());
      const matchesCategory = inventoryCategory === 'All' || p.category === inventoryCategory;
      return matchesSearch && matchesCategory;
    });
  }, [dbProducts, inventorySearch, inventoryCategory]);

  const filteredTasks = useMemo(() => {
    // Filter tasks based on store scope if manager
    return dbOrders.filter(o => {
      const matchesStatus = tmFilter === 'All' || o.status === tmFilter;
      const matchesStore = !currentUser?.storeId || o.store_id === currentUser.storeId;
      return matchesStatus && matchesStore;
    });
  }, [dbOrders, tmFilter, currentUser]);

  // View Handlers
  const openOrderDrilldown = (id: string) => {
    setActiveView('TaskManager');
  };

  // Check if due date is in the past
  const isLate = (dateStr?: string) => {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date();
  };

  // Permission Restriction Message
  const RestrictedView = () => (
    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] border border-slate-100 shadow-sm animate-in fade-in duration-500">
      <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mb-6"><Lock size={40} /></div>
      <h3 className="text-xl font-black text-slate-900 mb-2">Restricted Access</h3>
      <p className="text-sm text-slate-400 font-medium max-w-xs text-center">Your user profile does not have the necessary permissions to view this data node.</p>
    </div>
  );

  // --- Master Key Logic for Data Center ---
  const canViewDataCenter = useMemo(() => {
    if (!currentUser) return false;
    const isSuperUser = currentUser.role === 'SuperAdmin' || currentUser.role === 'Executive' || currentUser.role.toLowerCase().includes('admin');
    const hasExplicitPermission = currentUserRolePermissions && currentUserRolePermissions['view_data_center'];
    return isSuperUser || hasExplicitPermission;
  }, [currentUser, currentUserRolePermissions]);

  // Sidebar Group Visibility
  const showExecutive = currentUser?.role === 'SuperAdmin';
  const showSales = currentUser?.role === 'SuperAdmin' || currentUser?.role === 'Manager';
  const showDashboard = currentUser?.role !== 'Worker';

  // Dashboard Title
  const userStoreName = dbStores.find(s => s.id === currentUser?.storeId)?.store_name;
  const dashboardTitle = userStoreName ? `Store Performance: ${userStoreName}` : "Global Overview";

  // KPI Calculations with Explanations
  const statsList = useMemo(() => [
    {
      id: 'revenue',
      label: 'Total Revenue',
      val: `$${dashboardStats.revenue.toLocaleString()}`,
      trend: '↑ 14%',
      icon: DollarSign,
      explanation: "Calculation: Sum of 'Total Amount' from all 'Delivered' and 'In Process' orders."
    },
    {
      id: 'profit',
      label: 'Net Profit',
      val: `$${(dashboardStats.revenue * 0.28).toLocaleString()}`,
      trend: '↑ 5%',
      icon: TrendingUp,
      explanation: "Calculation: Total Revenue - (Cost of Goods Sold + Labor Costs)."
    },
    {
      id: 'orders',
      label: 'Active Orders',
      val: dashboardStats.count,
      trend: '↑ 8%',
      icon: ClipboardList,
      explanation: "Count of all active orders excluding 'Drafts'."
    },
    {
      id: 'inventory',
      label: 'Inventory Value',
      val: `$${(dashboardStats.inventoryVal / 1000).toFixed(1)}k`,
      trend: '↓ 5%',
      icon: Warehouse,
      explanation: "Calculation: Sum of current stock levels multiplied by base manufacturing costs."
    }
  ], [dashboardStats]);

  // Conditional Authentication Check
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            Loading 51K Portal
          </p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-900 font-sans overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-200 p-6 flex flex-col z-50">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0"><Layers size={22} /></div>
          <h1 className="font-black text-lg tracking-tighter">51K PORTAL</h1>
        </div>
        <nav className="flex-1 space-y-6 overflow-y-auto scrollbar-hide">
          {showDashboard && (
            <div>
              <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">OVERVIEW</p>
              <div className="space-y-1">
                <button onClick={() => setActiveView('Dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'Dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'}`}>
                  <BarChart3 size={18} /><span className="font-bold text-xs">Dashboard</span>
                </button>
              </div>
            </div>
          )}

          {showExecutive && (
            <div>
              <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">EXECUTIVE</p>
              <div className="space-y-1">
                {[{id:'Users',label:'Access Control',icon:ShieldCheck},{id:'Stores',label:'Store Network',icon:Building2},{id:'DataCenter',label:'Data Center',icon:Database}].map(item => (
                  <button key={item.id} onClick={() => setActiveView(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'}`}>
                    <item.icon size={18} /><span className="font-bold text-xs truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {showSales && (
            <div>
              <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">SALES</p>
              <div className="space-y-1">
                {[{id:'Quote',label:'Quote Builder',icon:FilePlus},{id:'Orders',label:'Orders',icon:ClipboardList}].map(item => (
                  <button key={item.id} onClick={() => setActiveView(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'}`}>
                    <item.icon size={18} /><span className="font-bold text-xs truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">PRODUCTION</p>
            <div className="space-y-1">
              {[{id:'TaskManager',label:'Task Manager',icon:ListTodo},{id:'Inventory',label:'Inventory',icon:Warehouse},{id:'Catalog',label:'Master Catalog',icon:Package}].map(item => (
                <button key={item.id} onClick={() => setActiveView(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'}`}>
                  <item.icon size={18} /><span className="font-bold text-xs truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>
        <div className="pt-6 border-t border-slate-200">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-black text-xs uppercase"><LogOut size={18} /> Logout</button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-10 flex items-center justify-between shrink-0 z-40">
          <h2 className="text-xl font-black tracking-tight capitalize">{activeView.replace(/([A-Z])/g, ' $1').trim()}</h2>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-black">{currentUser?.name}</p>
              <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[8px] font-black uppercase">
                {userStoreName ? `${currentUser?.role} - ${userStoreName}` : currentUser?.role}
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-black text-sm">{currentUser?.name?.[0]}</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10">
          {activeView === 'Dashboard' && (
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black tracking-tight">{dashboardTitle}</h3>
                {!currentUser?.storeId && (
                  <div className="flex gap-4 items-center bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
                    <Filter size={16} className="text-slate-400 ml-2" />
                    <select value={dashFilterStore} onChange={e => setDashFilterStore(e.target.value)} className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs font-bold outline-none">
                      <option value="All">All Hubs</option>{dbStores.map(s => <option key={s.id} value={s.id}>{s.store_name}</option>)}
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {statsList.map((s) => (
                  <div key={s.id} className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm group hover:border-blue-300 transition-all relative overflow-hidden">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                      
                      {/* Tooltip Interaction */}
                      <div className="relative">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTooltipID(activeTooltipID === s.id ? null : s.id);
                          }}
                          className={`p-1.5 rounded-full transition-all ${activeTooltipID === s.id ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-100 hover:text-slate-600'}`}
                        >
                          <Info size={14} />
                        </button>
                        
                        {activeTooltipID === s.id && (
                          <div className="absolute top-10 right-0 w-56 bg-white border border-slate-200 p-4 rounded-2xl shadow-2xl z-[100] animate-in fade-in slide-in-from-top-2 duration-200 cursor-default">
                            <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-50">
                              <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">KPI Definition</span>
                              <button onClick={() => setActiveTooltipID(null)} className="text-slate-300 hover:text-slate-500"><X size={10}/></button>
                            </div>
                            <p className="text-[11px] font-medium text-slate-500 leading-relaxed italic">
                              {s.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-baseline gap-2 relative z-10">
                      <p className="text-3xl font-black">{s.val}</p>
                      <span className={`text-[10px] font-bold ${s.trend.startsWith('↑') ? 'text-emerald-500' : 'text-red-400'}`}>{s.trend}</span>
                    </div>
                    <s.icon className="absolute -bottom-4 -right-4 text-slate-50 w-24 h-24" />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-[40px] p-10 border border-slate-200 shadow-sm space-y-8">
                   <h4 className="text-sm font-black uppercase tracking-widest">Performance Insights</h4>
                   <div className="space-y-6">
                      {dashboardStats.ordersPerStore.filter(s => !currentUser?.storeId || s.name === userStoreName).map(s => {
                        const max = Math.max(...dashboardStats.ordersPerStore.map(v => v.count)) || 1;
                        return (
                          <div key={s.name} className="space-y-2">
                            <div className="flex justify-between text-xs font-bold"><span>{s.name}</span><span>{s.count} orders</span></div>
                            <div className="h-3 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{width:`${(s.count/max)*100}%`}}></div></div>
                          </div>
                        )
                      })}
                   </div>
                </div>
                <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden flex flex-col justify-center">
                   <div className="relative z-10">
                     <h3 className="text-3xl font-black">Optimization Matrix</h3>
                     <p className="text-slate-400 mt-4 text-sm max-w-sm">Use Gemini AI to analyze production bottle-necks and material consumption trends for this hub.</p>
                     <button className="mt-8 bg-blue-600 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-2"><Sparkles size={14}/> Run AI Diagnostics</button>
                   </div>
                   <Activity size={200} className="absolute -bottom-10 -right-10 text-white/5" />
                </div>
              </div>
            </div>
          )}

          {activeView === 'Quote' && (
            <div className="max-w-6xl mx-auto grid grid-cols-1 xl:grid-cols-4 gap-10 animate-in slide-in-from-bottom-6 duration-500">
               <div className="xl:col-span-3 space-y-10">
                  {quoteStep === 1 ? (
                    <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden p-10">
                      <h3 className="text-sm font-black uppercase tracking-widest mb-10 border-b pb-4">Step 1: Client Enrollment</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                         <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500">Select Hub</label>
                           <select 
                            value={clientInfo.store_id} 
                            disabled={!!currentUser?.storeId}
                            onChange={e => handleStoreChange(e.target.value)} 
                            className="w-full bg-slate-50 border p-3 rounded-xl outline-none text-sm disabled:opacity-50"
                           >
                            {dbStores.map(s => <option key={s.id} value={s.id}>{s.store_name}</option>)}
                           </select>
                         </div>
                         <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500">Manager Assigned</label><input type="text" value={clientInfo.managerName} className="w-full bg-slate-100 border p-3 rounded-xl text-sm text-slate-400" readOnly /></div>
                         <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500">First Name *</label><input type="text" value={clientInfo.firstName} onChange={e => setClientInfo({...clientInfo, firstName: e.target.value})} className="w-full border p-3 rounded-xl text-sm outline-none focus:border-blue-400" /></div>
                         <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500">Last Name *</label><input type="text" value={clientInfo.lastName} onChange={e => setClientInfo({...clientInfo, lastName: e.target.value})} className="w-full border p-3 rounded-xl text-sm outline-none focus:border-blue-400" /></div>
                         <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500">Cell Phone *</label><input type="text" value={clientInfo.cellPhone} onChange={e => setClientInfo({...clientInfo, cellPhone: e.target.value})} className="w-full border p-3 rounded-xl text-sm outline-none focus:border-blue-400" /></div>
                         <div className="space-y-1.5 md:col-span-2"><label className="text-xs font-bold text-slate-500">Project Address</label><input type="text" value={clientInfo.address} onChange={e => setClientInfo({...clientInfo, address: e.target.value})} className="w-full border p-3 rounded-xl text-sm outline-none focus:border-blue-400" /></div>
                      </div>
                      <div className="mt-10 flex justify-end"><button onClick={validateQuoteStep1} className="bg-slate-900 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-600 transition-all">Proceed to Configurator <ChevronRight size={14}/></button></div>
                    </div>
                  ) : (
                    <div className="space-y-8 animate-in fade-in">
                       <div className="flex items-center justify-between"><h3 className="text-sm font-black uppercase tracking-widest">Step 2: Selection Workflow</h3><button onClick={() => setQuoteStep(1)} className="text-xs font-bold text-blue-600 underline hover:text-blue-800 transition-all">Edit Client Profile</button></div>
                       
                       <div className="space-y-4">
                         <div className="bg-[#1e293b] text-white rounded-2xl p-4 flex items-center justify-between shadow-md">
                           <span className="font-black text-xs uppercase tracking-[0.2em]">Height & Depth Configuration</span>
                           <Hammer size={18} className="text-blue-400" />
                         </div>
                         
                         <div className="bg-white rounded-[32px] border border-slate-200 p-8 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6">
                            {[
                              { id: 'upperH', label: 'Upper Cabinet height', suffix: '"' },
                              { id: 'lowerH', label: 'Lower Cabinet height', suffix: '"' },
                              { id: 'upperD', label: 'Upper Cabinet depth', suffix: '"' },
                              { id: 'lowerD', label: 'Lower Cabinet depth', suffix: '"' },
                              { id: 'pantryH', label: 'Pantry Cabinet height', suffix: '"' },
                              { id: 'pantryD', label: 'Pantry Cabinet depth', suffix: '"' },
                              { id: 'islandH', label: 'Island Cabinet height', suffix: '"' },
                              { id: 'islandD', label: 'Island Cabinet depth', suffix: '"' }
                            ].map(field => (
                              <div key={field.id} className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{field.label}</label>
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="text" 
                                    value={globalDimensions[field.id as keyof typeof globalDimensions]} 
                                    onChange={e => setGlobalDimensions({ ...globalDimensions, [field.id]: e.target.value })} 
                                    className="w-full bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                                  />
                                  <span className="text-xs font-black text-slate-300">{field.suffix}</span>
                                </div>
                              </div>
                            ))}
                         </div>
                       </div>

                       <div className="space-y-3">
                         {selectionCategories.map(cat => (
                            <div key={cat} className="space-y-2">
                              <button 
                                onClick={() => setExpandedCategory(expandedCategory === cat ? null : cat)}
                                className={`w-full flex items-center justify-between p-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${expandedCategory === cat ? 'bg-slate-200 text-slate-900 border-slate-300' : 'bg-[#f1f5f9] text-slate-600 hover:bg-slate-200 border-transparent'} border`}
                              >
                                <div className="flex items-center gap-4">
                                  <div className="w-8 h-8 rounded-lg bg-white/50 flex items-center justify-center">
                                    {cat === "Select Cabinets" && lineItems.length > 0 ? (
                                      <Check size={16} className="text-emerald-500" />
                                    ) : (
                                      <span className="text-[10px] text-slate-400">{selectionCategories.indexOf(cat) + 1}</span>
                                    )}
                                  </div>
                                  <span>{cat}</span>
                                </div>
                                <div className={`transition-transform duration-300 ${expandedCategory === cat ? 'rotate-180' : ''}`}>
                                  <ChevronDown size={18} />
                                </div>
                              </button>

                              {expandedCategory === cat && (
                                <div className="p-8 bg-white border border-slate-100 rounded-[32px] shadow-inner animate-in fade-in slide-in-from-top-2 duration-300">
                                  {cat === "Select Cabinets" ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                      {dbProducts.map(p => (
                                        <div key={p.id} className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all group">
                                          <div className="aspect-square bg-slate-50 rounded-[20px] mb-4 flex items-center justify-center text-slate-200 group-hover:bg-blue-50 transition-all"><Package size={40} /></div>
                                          <h5 className="text-[11px] font-black mb-1">{p.name}</h5>
                                          <p className="text-[10px] text-slate-400 mb-4 font-bold tracking-tight">${p.base_price.toFixed(2)} / {p.unit}</p>
                                          <button onClick={() => addLineItem(p)} className="w-full bg-slate-900 text-white py-3 rounded-xl text-[9px] font-black uppercase flex items-center justify-center gap-2 hover:bg-blue-600 transition-all"><Plus size={12} /> Select Product</button>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="py-20 text-center space-y-4">
                                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200"><Info size={32} /></div>
                                      <p className="text-xs text-slate-400 italic font-medium">{cat} options will be dynamically loaded based on Combo selection.</p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                         ))}
                       </div>
                    </div>
                  )}
               </div>
               
               <div className="space-y-6">
                  <div className="sticky top-28 bg-white rounded-[40px] p-10 border border-slate-200 shadow-2xl">
                     <div className="flex items-center justify-between mb-8">
                       <h3 className="text-xl font-black tracking-tight">Quote Summary</h3>
                       <div className="bg-blue-50 text-blue-600 p-2 rounded-xl"><ShoppingCart size={20} /></div>
                     </div>
                     <div className="space-y-4 max-h-80 overflow-y-auto mb-10 border-b pb-8 scrollbar-hide">
                        {lineItems.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-start text-[11px] font-bold group">
                            <span className="flex-1 pr-4 text-slate-600 group-hover:text-slate-900 transition-all">{item.product.name} x{item.quantity}</span>
                            <div className="flex gap-3 items-center">
                              <span className="text-slate-900 font-black">${(item.product.base_price * item.quantity).toFixed(2)}</span>
                              <button onClick={() => removeLineItem(item.product.id)} className="text-slate-200 hover:text-red-500 transition-all"><Trash2 size={12}/></button>
                            </div>
                          </div>
                        ))}
                        {lineItems.length === 0 && (
                          <div className="py-10 text-center">
                            <p className="text-[10px] text-slate-300 italic font-bold uppercase tracking-widest">No Items Selected</p>
                          </div>
                        )}
                     </div>
                     <div className="flex justify-between items-center mb-8">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Estimated Total</span>
                        <span className="text-2xl font-black text-slate-900 tracking-tighter">${lineItems.reduce((a,b) => a+(b.product.base_price*b.quantity), 0).toFixed(2)}</span>
                     </div>
                     <button 
                        onClick={handleSubmitQuote} 
                        disabled={lineItems.length === 0} 
                        className="w-full bg-blue-600 disabled:opacity-30 text-white py-5 rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all transform hover:-translate-y-0.5"
                     >
                       Submit Production Order
                     </button>
                  </div>
               </div>
            </div>
          )}

          {activeView === 'TaskManager' && (
            <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500">
               <div className="flex flex-wrap items-center justify-between gap-6">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black uppercase tracking-tight">Production Task Board</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Manufacturing Dispatch & Progress Control</p>
                  </div>
                  
                  {/* Status Filter Bar */}
                  <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border gap-1">
                    {['All', OrderStatus.Pending, OrderStatus.InProcess, OrderStatus.QualityCheck, OrderStatus.Ready].map(status => (
                      <button 
                        key={status} 
                        onClick={() => setTmFilter(status)}
                        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${tmFilter === status ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'text-slate-500 hover:bg-slate-50'}`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
               </div>

               <div className="space-y-8 pb-20">
                 {filteredTasks.length === 0 ? (
                   <div className="py-32 text-center space-y-4 bg-white rounded-[40px] border border-dashed border-slate-200">
                      <Clock size={48} className="mx-auto text-slate-200" />
                      <p className="text-xs text-slate-400 font-black uppercase tracking-widest">No Orders in this queue</p>
                   </div>
                 ) : (
                   filteredTasks.map(order => {
                     const tasksData = dbProductionTasks.find(pt => pt.order_id === order.id);
                     const tasks = tasksData?.tasks || [];
                     const isStarted = order.status !== OrderStatus.Pending && order.status !== OrderStatus.Draft;
                     const progress = tasks.length > 0 ? Math.round((tasks.filter(t => t.is_complete).length / tasks.length) * 100) : 0;
                     const deliveryDateLate = isLate(order.due_date);

                     return (
                       <div key={order.id} className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all group p-1">
                          {/* Card Header */}
                          <div className="p-8 pb-6 flex flex-wrap items-center justify-between gap-6">
                             <div className="flex items-center gap-6">
                                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all font-black text-xl">#{order.order_no}</div>
                                <div>
                                   <h4 className="text-lg font-black text-slate-900 leading-tight">{order.client_info.name}</h4>
                                   <div className="flex items-center gap-4 mt-1">
                                      <p className={`text-[10px] font-black uppercase flex items-center gap-1.5 ${deliveryDateLate ? 'text-red-500' : 'text-slate-400'}`}>
                                        <Calendar size={12} /> Due: {order.due_date || 'TBD'}
                                      </p>
                                      {tasksData?.started_at && <span className="text-[9px] font-bold text-slate-300 uppercase">Started: {new Date(tasksData.started_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>}
                                   </div>
                                </div>
                             </div>

                             <div className="flex items-center gap-4">
                                <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                  order.status === OrderStatus.Pending ? 'bg-amber-50 text-amber-600' : 
                                  order.status === OrderStatus.InProcess ? 'bg-emerald-50 text-emerald-600' : 
                                  'bg-blue-50 text-blue-600'
                                }`}>
                                   {order.status}
                                </div>
                                {!isStarted ? (
                                  <button 
                                    onClick={() => startOrderProduction(order.id)}
                                    className="bg-blue-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2"
                                  >
                                    <Play size={14} fill="currentColor" /> Start Production
                                  </button>
                                ) : (
                                  <div className="w-48 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                     <div className="h-full bg-emerald-500 transition-all duration-1000" style={{width: `${progress}%`}}></div>
                                  </div>
                                )}
                             </div>
                          </div>

                          {/* Middle Row: Items */}
                          <div className="px-8 mb-8 flex flex-wrap gap-2">
                             {order.line_items.map((item, idx) => (
                               <span key={idx} className="bg-slate-50 text-slate-500 px-3 py-1 rounded-lg text-[10px] font-bold border border-slate-100">{item.product.name} x{item.quantity}</span>
                             ))}
                          </div>

                          {/* Bottom Row: Assembly Stages */}
                          <div className={`p-8 bg-slate-50/50 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-opacity duration-500 ${!isStarted ? 'opacity-30 pointer-events-none grayscale' : 'opacity-100'}`}>
                             {tasks.map(task => (
                               <div key={task.id} className={`p-5 rounded-3xl border bg-white shadow-sm transition-all ${task.is_complete ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-100 hover:border-blue-200'}`}>
                                  <div className="flex items-center gap-3 mb-4">
                                     <button 
                                       onClick={() => toggleDbTask(order.id, task.id)}
                                       className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${task.is_complete ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-transparent border border-slate-200'}`}
                                     >
                                       <Check size={14} strokeWidth={4} />
                                     </button>
                                     <span className={`text-[11px] font-black ${task.is_complete ? 'text-emerald-600 line-through' : 'text-slate-700'}`}>{task.task_name}</span>
                                  </div>
                                  
                                  {/* Task Controls - Shown when in process */}
                                  <div className="space-y-3">
                                     <input 
                                       type="text" 
                                       placeholder="Notes..." 
                                       value={task.notes || ''} 
                                       onChange={e => updateDbTaskNotes(order.id, task.id, e.target.value)}
                                       className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-[9px] font-bold outline-none focus:ring-1 focus:ring-blue-100" 
                                     />
                                     <div className="flex items-center justify-between">
                                        <span className="text-[8px] font-black text-slate-300 uppercase">Worker Init</span>
                                        <input 
                                          type="text" 
                                          maxLength={3} 
                                          value={task.signed_by} 
                                          onChange={e => updateDbTaskSignature(order.id, task.id, e.target.value)}
                                          placeholder="..." 
                                          className="w-10 bg-white border border-slate-200 rounded-lg py-1.5 text-[9px] font-black text-center uppercase outline-none focus:border-blue-400" 
                                        />
                                     </div>
                                  </div>
                               </div>
                             ))}
                          </div>
                       </div>
                     )
                   })
                 )}
               </div>
            </div>
          )}

          {activeView === 'Users' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="flex items-center justify-between">
                 <h3 className="text-lg font-black uppercase tracking-widest">Platform Access Governance</h3>
                 <button onClick={() => { setNewRoleName(''); setEditingRoleId(null); setShowRoleModal(true); }} className="bg-blue-600 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase shadow-lg shadow-blue-100"><Plus size={14} className="inline mr-2" /> Define New Role</button>
               </div>
               
               {showRoleModal && (
                 <div className="bg-white p-8 rounded-[32px] border border-blue-200 shadow-xl mb-8 animate-in slide-in-from-top-4">
                   <div className="flex justify-between items-center mb-6"><h4 className="font-black uppercase text-xs">{editingRoleId ? 'Edit Role' : 'Create Access Role'}</h4><button onClick={() => setShowRoleModal(false)}><X size={18} /></button></div>
                   <div className="flex gap-4"><input type="text" value={newRoleName} onChange={e => setNewRoleName(e.target.value)} placeholder="Enter Role Title..." className="flex-1 bg-slate-50 border p-4 rounded-xl outline-none text-sm font-bold" /><button onClick={handleAddRole} className="bg-blue-600 text-white px-8 rounded-xl font-black text-[10px] uppercase">{editingRoleId ? 'Save' : 'Register'}</button></div>
                 </div>
               )}

               <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-x-auto scrollbar-hide">
                  <table className="w-full text-left min-w-[1200px] border-collapse">
                     <thead className="sticky top-0 bg-slate-50 z-10">
                       <tr className="border-b">
                         <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase sticky left-0 bg-slate-50 z-20">Role Identifier</th>
                         {PERMISSION_COLUMNS.map(c => (
                           <th key={c} className="px-4 py-5 text-[9px] text-center uppercase text-slate-400 border-l border-slate-100">{c}</th>
                         ))}
                         <th className="px-8 py-5 text-right uppercase text-slate-400 text-[10px] border-l border-slate-100">Actions</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y">
                        {dbRoles.map(role => (
                          <tr key={role.id} className="hover:bg-slate-50/50">
                             <td className="px-8 py-6 text-sm font-black sticky left-0 bg-white group-hover:bg-slate-50 z-20 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">{role.name}</td>
                             {PERMISSION_COLUMNS.map(c => (
                               <td key={c} className="text-center border-l border-slate-50">
                                 <button 
                                   onClick={() => togglePermission(role.id, c)}
                                   className={`w-4 h-4 rounded mx-auto border flex items-center justify-center transition-all ${role.permissions[c] ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-50 border-slate-200 text-transparent'}`}
                                 >
                                   <Check size={10}/>
                                 </button>
                               </td>
                             ))}
                             <td className="px-8 py-6 text-right space-x-2 border-l border-slate-50">
                               <button onClick={() => handleEditRole(role)} className="p-2 bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 transition-all"><Edit3 size={14}/></button>
                               <button onClick={() => handleDeleteRole(role.id)} className="p-2 bg-slate-100 rounded-lg text-slate-400 hover:text-red-500 transition-all"><Trash2 size={14}/></button>
                             </td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          )}

          {activeView === 'Stores' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex items-center justify-between"><h3 className="text-lg font-black uppercase tracking-widest">Store Network</h3><button onClick={() => setShowStoreModal(true)} className="bg-blue-600 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase"><Plus size={14} className="inline mr-2" /> Open New Hub</button></div>
              {showStoreModal && (
                 <div className="bg-white p-10 rounded-[40px] border border-blue-200 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                   <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase">Hub Name</label><input type="text" value={newStoreData.name} onChange={e => setNewStoreData({...newStoreData, name: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl outline-none" /></div>
                   <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase">Manager</label><input type="text" value={newStoreData.manager} onChange={e => setNewStoreData({...newStoreData, manager: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl outline-none" /></div>
                   <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase">Comm %</label><input type="number" value={newStoreData.commission} onChange={e => setNewStoreData({...newStoreData, commission: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl outline-none" /></div>
                   <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase">Address</label><input type="text" value={newStoreData.address} onChange={e => setNewStoreData({...newStoreData, address: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl outline-none" /></div>
                   <div className="md:col-span-2 flex justify-end gap-3 mt-4"><button onClick={() => setShowStoreModal(false)} className="px-6 font-bold text-xs">Cancel</button><button onClick={handleAddStore} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase">Register Hub</button></div>
                 </div>
               )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {dbStores.map(store => (
                  <div key={store.id} className="bg-white p-10 rounded-[40px] border shadow-sm group hover:shadow-xl transition-all">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all"><Building2 size={28}/></div>
                      <div><h4 className="text-xl font-black">{store.store_name}</h4><p className="text-xs text-slate-400">{store.address}</p></div>
                    </div>
                    <div className="pt-8 border-t flex justify-between items-center"><p className="text-sm font-black">{store.manager_name}</p><p className="text-sm font-black text-blue-600">{store.commissionRate}% Rate</p></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeView === 'Catalog' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black uppercase tracking-widest">Master Product DNA</h3>
                <div className="flex gap-4">
                  <button 
                    onClick={() => fileInputRef.current?.click()} 
                    className="bg-white text-slate-900 border border-slate-200 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
                  >
                    <FileUp size={16} /> Import from CSV
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleCsvFileUpload} 
                    accept=".csv" 
                    className="hidden" 
                  />
                  <button 
                    onClick={() => setShowProductModal(true)} 
                    className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all"
                  >
                    + Add Catalog Spec
                  </button>
                </div>
              </div>

              {/* CSV Mapping Modal */}
              {showImportModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-6 animate-in fade-in duration-200">
                  <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                    <div className="bg-[#1e293b] text-white p-8 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center"><UploadCloud size={24} /></div>
                        <div>
                          <h3 className="text-xl font-black uppercase tracking-tight">Map Catalog Columns</h3>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Align your CSV to System DNA</p>
                        </div>
                      </div>
                      <button onClick={() => setShowImportModal(false)} className="hover:bg-white/10 p-2 rounded-xl transition-all"><X size={24} /></button>
                    </div>
                    
                    <div className="p-10 space-y-6">
                      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                        {Object.keys(columnMapping).map((key) => (
                          <div key={key} className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{key.replace('_', ' ')} (System Field)</label>
                            <select 
                              value={columnMapping[key]} 
                              onChange={(e) => setColumnMapping({ ...columnMapping, [key]: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-100"
                            >
                              <option value="">-- Select CSV Column --</option>
                              {csvHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                            </select>
                          </div>
                        ))}
                      </div>
                      
                      <div className="pt-8 border-t flex justify-end gap-4">
                        <button onClick={() => setShowImportModal(false)} className="px-8 py-3 text-xs font-black uppercase text-slate-400">Abort</button>
                        <button onClick={processImport} className="bg-blue-600 text-white px-10 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">Import Data</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {showProductModal && (
                 <div className="bg-white p-10 rounded-[40px] border border-blue-200 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 animate-in slide-in-from-top-4">
                   <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase">Title</label><input type="text" value={newProductData.name} onChange={e => setNewProductData({...newProductData, name: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl outline-none" /></div>
                   <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase">SKU</label><input type="text" value={newProductData.sku} onChange={e => setNewProductData({...newProductData, sku: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl outline-none" /></div>
                   <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase">Supplier</label><input type="text" value={newProductData.supplier} onChange={e => setNewProductData({...newProductData, supplier: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl outline-none" /></div>
                   <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase">Price</label><input type="number" value={newProductData.price} onChange={e => setNewProductData({...newProductData, price: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl outline-none" /></div>
                   <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase">Init Stock</label><input type="number" value={newProductData.stock} onChange={e => setNewProductData({...newProductData, stock: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl outline-none" /></div>
                   <div className="flex items-end gap-3"><button onClick={() => setShowProductModal(false)} className="px-6 py-3 rounded-xl font-bold text-xs">Cancel</button><button onClick={handleAddProduct} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase flex-1">Commit Spec</button></div>
                 </div>
               )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {dbProducts.map(p => (
                  <div key={p.id} className="bg-white p-8 rounded-[40px] border group hover:border-blue-300 transition-all">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 transition-all"><Package size={24}/></div>
                      <div><h4 className="font-black text-slate-900">{p.name}</h4><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.sku}</p></div>
                    </div>
                    <div className="space-y-4 pt-6 border-t border-slate-100 text-xs font-bold">
                      <div className="flex justify-between text-slate-400 uppercase text-[9px]"><span>Category</span><span className="text-slate-900 font-black">{p.category}</span></div>
                      <div className="flex justify-between text-slate-400 uppercase text-[9px]"><span>Base Price</span><span className="text-blue-600 font-black">${p.base_price.toFixed(2)}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeView === 'Orders' && (
            <div className="bg-white rounded-[40px] border shadow-sm overflow-hidden animate-in fade-in duration-500">
               <table className="w-full text-left">
                  <thead><tr className="bg-slate-50 border-b"><th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Order Ref</th><th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Customer Profile</th><th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Operational Status</th><th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase text-right">Quote Value</th></tr></thead>
                  <tbody className="divide-y">
                     {dbOrders.filter(o => !currentUser?.storeId || o.store_id === currentUser.storeId).map(o => (
                       <tr key={o.id} onClick={() => openOrderDrilldown(o.id)} className="hover:bg-blue-50/40 cursor-pointer transition-all">
                          <td className="px-8 py-6 text-sm font-black">#{o.order_no}<span className="block text-[10px] text-slate-400 font-medium">{o.date}</span></td>
                          <td className="px-8 py-6 text-sm font-bold text-slate-700">{o.client_info.name}</td>
                          <td className="px-8 py-6"><span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${o.status === OrderStatus.Completed ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>{o.status}</span></td>
                          <td className="px-8 py-6 text-right font-black text-blue-600 text-sm">${o.line_items.reduce((a,b)=>a+(b.product.base_price*b.quantity),0).toFixed(2)}</td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          )}

          {activeView === 'DataCenter' && (
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
               <div className="flex items-center justify-between mb-8">
                  <div className="space-y-1"><h3 className="text-2xl font-black tracking-tight">System Warehouse (Data Center)</h3><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Live Relational State Exploration</p></div>
                  <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
                    {['Orders', 'Products', 'Stores', 'Tasks'].map(tab => (
                      <button key={tab} onClick={() => setDcActiveTab(tab as any)} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${dcActiveTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{tab}</button>
                    ))}
                  </div>
               </div>
               <div className="bg-white rounded-[32px] border shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    {!canViewDataCenter ? (
                      <RestrictedView />
                    ) : (
                      <div className="data-content">
                        {dcActiveTab === 'Orders' && (
                          <table className="w-full text-left">
                            <thead><tr className="bg-slate-50 border-b"><th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">order_id</th><th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">hub</th><th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">client</th><th className="px-8 py-4 text-right pr-12 text-[10px] font-black uppercase text-slate-400">drill-down</th></tr></thead>
                            <tbody className="divide-y">
                              {dbOrders.map(o => (
                                <tr key={o.id} className="text-xs">
                                  <td className="px-8 py-4 font-mono text-blue-600">{o.id}</td>
                                  <td className="px-8 py-4 font-bold">{o.store_id}</td>
                                  <td className="px-8 py-4">{o.client_info.name}</td>
                                  <td className="px-8 py-4 text-right pr-10"><button onClick={() => openOrderDrilldown(o.id)} className="p-2 hover:bg-slate-50 rounded-xl text-blue-600"><Eye size={16}/></button></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                        {dcActiveTab === 'Tasks' && (
                          <table className="w-full text-left">
                            <thead><tr className="bg-slate-50 border-b"><th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">order_id</th><th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">status</th><th className="px-8 py-4 text-right pr-12 text-[10px] font-black uppercase text-slate-400">trace</th></tr></thead>
                            <tbody className="divide-y">
                              {dbProductionTasks.map(pt => (
                                <tr key={pt.order_id} className="text-xs">
                                  <td className="px-8 py-4 font-mono text-blue-600">{pt.order_id}</td>
                                  <td className="px-8 py-4 font-black uppercase text-[10px]">{pt.tasks.filter(t => t.is_complete).length} of {pt.tasks.length} OK</td>
                                  <td className="px-8 py-4 text-right pr-10"><button onClick={() => openOrderDrilldown(pt.order_id)} className="p-2 hover:bg-slate-50 rounded-xl text-blue-600"><Activity size={16}/></button></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                        {dcActiveTab === 'Products' && (
                          <table className="w-full text-left">
                            <thead><tr className="bg-slate-50 border-b"><th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">id</th><th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">sku</th><th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">name</th><th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">stock</th></tr></thead>
                            <tbody className="divide-y">
                              {dbProducts.map(p => (
                                <tr key={p.id} className="text-xs">
                                  <td className="px-8 py-4 font-mono text-blue-600">{p.id}</td>
                                  <td className="px-8 py-4 font-bold">{p.sku}</td>
                                  <td className="px-8 py-4">{p.name}</td>
                                  <td className="px-8 py-4 font-black">{p.stockLevel}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                        {dcActiveTab === 'Stores' && (
                          <table className="w-full text-left">
                            <thead><tr className="bg-slate-50 border-b"><th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">store_id</th><th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">store_name</th><th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">manager</th><th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">address</th></tr></thead>
                            <tbody className="divide-y">
                              {dbStores.map(s => (
                                <tr key={s.id} className="text-xs">
                                  <td className="px-8 py-4 font-mono text-blue-600">{s.id}</td>
                                  <td className="px-8 py-4 font-bold">{s.store_name}</td>
                                  <td className="px-8 py-4">{s.manager_name}</td>
                                  <td className="px-8 py-4 font-medium text-slate-500">{s.address}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    )}
                  </div>
               </div>
            </div>
          )}

          {activeView === 'Inventory' && (
            <div className="space-y-6 animate-in fade-in duration-500">
               {/* Inventory Toolbar */}
               <div className="flex flex-wrap gap-4 items-center bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
                  <div className="flex-1 min-w-[300px] relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search product or SKU..." 
                      value={inventorySearch}
                      onChange={(e) => setInventorySearch(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>
                  <div className="w-64">
                    <select 
                      value={inventoryCategory}
                      onChange={(e) => setInventoryCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
                    >
                      <option value="All">All Categories</option>
                      <option value="Cabinet Style">Cabinet Style</option>
                      <option value="Hardware">Hardware</option>
                      <option value="Material">Material</option>
                    </select>
                  </div>
               </div>

               <div className="bg-white rounded-[40px] border shadow-sm overflow-hidden">
                  <table className="w-full text-left">
                     <thead><tr className="bg-slate-50 border-b"><th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Product Ref</th><th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Category</th><th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase text-center">Available Units</th><th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase text-right">Value / Unit</th></tr></thead>
                     <tbody className="divide-y">
                        {filteredInventory.map(p => (
                          <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                             <td className="px-8 py-6 font-black text-sm">{p.name} <span className="block text-[9px] text-slate-400 tracking-widest">{p.sku}</span></td>
                             <td className="px-8 py-6 text-xs font-bold text-slate-500 uppercase">{p.category}</td>
                             <td className="px-8 py-6 text-center"><span className={`px-3 py-1 rounded-lg text-xs font-black ${p.stockLevel < p.minStock ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-900'}`}>{p.stockLevel}</span></td>
                             <td className="px-8 py-6 text-right font-black text-blue-600">${p.base_price.toFixed(2)}</td>
                          </tr>
                        ))}
                        {filteredInventory.length === 0 && (
                          <tr>
                            <td colSpan={4} className="py-20 text-center text-slate-300 italic font-bold uppercase tracking-widest text-[10px]">No matching products found</td>
                          </tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default App;