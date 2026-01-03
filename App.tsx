import React, { useState, useMemo, useRef, Component, ErrorInfo, ReactNode } from 'react';
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
  Key,
  AlertTriangle
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

/**
 * ERROR BOUNDARY COMPONENT
 * Catches JavaScript errors anywhere in their child component tree.
 */
interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Fix: Explicitly use React.Component and declare state property to resolve TypeScript errors where state/props were not recognized on ErrorBoundary
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-12">
          <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-12 border-2 border-red-100 text-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6">
              <AlertTriangle size={40} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">System Critical Failure</h1>
            <p className="text-slate-500 text-sm font-medium mb-8">
              A JavaScript runtime error occurred. This is likely due to an undefined state variable.
            </p>
            <div className="bg-red-50 rounded-2xl p-4 text-left mb-8 overflow-x-auto">
              <code className="text-[10px] font-black text-red-600 block leading-relaxed">
                {this.state.error?.message || "Unknown error"}
              </code>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all"
            >
              Force System Restart
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * LOGIN SCREEN COMPONENT
 */
const LoginScreen: React.FC<{ onLogin: (user: UserProfile) => void }> = ({ onLogin }) => {
  const safeUsers = Array.isArray(INITIAL_USERS) ? INITIAL_USERS : [];

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        <div className="p-12">
          <div className="flex flex-col items-center gap-4 mb-12">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200">
              <Layers size={32} />
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-slate-900">51K PORTAL</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Enterprise Resource Control</p>
          </div>

          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
              <input 
                type="email" 
                defaultValue="admin@51wood.ca"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-100 transition-all" 
                placeholder="name@51wood.ca"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Security Key</label>
              <input 
                type="password" 
                defaultValue="password123"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-100 transition-all" 
                placeholder="••••••••"
              />
            </div>
            <button 
              onClick={() => safeUsers[0] && onLogin(safeUsers[0] as UserProfile)}
              className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
            >
              Authorize System Entry <LogIn size={16} />
            </button>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-100">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] text-center mb-6">Prototyping Sandbox Access</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'CEO', icon: ShieldCheck, user: safeUsers[0], color: 'text-blue-600 bg-blue-50' },
                { label: 'Manager', icon: Building2, user: safeUsers[1] ? { ...safeUsers[1], storeId: 'S1' } : null, color: 'text-amber-600 bg-amber-50' },
                { label: 'Worker', icon: Hammer, user: safeUsers[2] ? { ...safeUsers[2], role: 'Worker' } : null, color: 'text-slate-600 bg-slate-50' }
              ].map((role) => (
                <button 
                  key={role.label}
                  disabled={!role.user}
                  onClick={() => role.user && onLogin(role.user as UserProfile)}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-transparent hover:border-slate-200 hover:bg-white transition-all group disabled:opacity-20"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${role.color} transition-all group-hover:scale-110`}>
                    <role.icon size={18} />
                  </div>
                  <span className="text-[9px] font-black uppercase text-slate-400">{role.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MainApp: React.FC = () => {
  // Fix: Added missing setDbStores setter to properly manage shop list state
  const [dbStores, setDbStores] = useState<StoreInfo[]>(mockDatabase?.stores || []);
  const [dbProducts, setDbProducts] = useState<Product[]>(mockDatabase?.products || []);
  const [dbOrders, setDbOrders] = useState<Order[]>(mockDatabase?.orders as Order[] || []);
  const [dbProductionTasks, setDbProductionTasks] = useState<ProductionTasks[]>(mockDatabase?.productionTasks || []);
  const [dbRoles, setDbRoles] = useState<any[]>(mockDatabase?.roles || []);

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activeView, setActiveView] = useState('Dashboard');

  const [dashFilterStore, setDashFilterStore] = useState('All');
  const [activeTooltipID, setActiveTooltipID] = useState<string | null>(null);

  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryCategory, setInventoryCategory] = useState('All');
  const [tmFilter, setTmFilter] = useState<string>('All');

  const [quoteStep, setQuoteStep] = useState<1 | 2>(1);
  const [lineItems, setLineItems] = useState<QuoteLineItem[]>([]);
  const [clientInfo, setClientInfo] = useState({ 
    store_id: dbStores[0]?.id || '', 
    managerName: dbStores[0]?.manager_name || '', 
    firstName: '', 
    lastName: '', 
    cellPhone: '', 
    email: '', 
    address: '' 
  });

  const [globalDimensions, setGlobalDimensions] = useState({
    upperH: '30', lowerH: '35 1/4', upperD: '11 3/4', lowerD: '24',
    pantryH: '84', pantryD: '24', islandH: '35 1/4', islandD: '24'
  });
  const [expandedCategory, setExpandedCategory] = useState<string | null>("Select Cabinets");

  const selectionCategories = [
    "Select Combo", "Select Cabinet Style", "Select Cabinets", "Select Door Style", 
    "Select Door Color", "Select Countertop", "Select Accessory", "Select Hardware", 
    "Select Service", "Other Products"
  ];

  const [dcActiveTab, setDcActiveTab] = useState<'Orders' | 'Products' | 'Stores' | 'Tasks'>('Orders');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  
  const [newRoleName, setNewRoleName] = useState('');
  const [newStoreData, setNewStoreData] = useState({ name: '', manager: '', address: '', commission: '10' });
  const [newProductData, setNewProductData] = useState({ name: '', sku: '', category: 'Hardware', price: '0', stock: '10', supplier: 'Standard' });

  const [showImportModal, setShowImportModal] = useState(false);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvRows, setCsvRows] = useState<string[][]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({
    name: '', sku: '', supplier: '', price: '', stock: '', category: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentUserRolePermissions = useMemo(() => {
    if (!currentUser) return null;
    return dbRoles.find(r => r.name === currentUser.role)?.permissions || {};
  }, [currentUser, dbRoles]);

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    setActiveView(user.role === 'Worker' ? 'TaskManager' : 'Dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveView('Dashboard');
  };

  const togglePermission = (roleId: string, permissionName: string) => {
    setDbRoles(prev => prev.map(role => {
      if (role.id !== roleId) return role;
      const currentVal = role.permissions[permissionName] || false;
      return { ...role, permissions: { ...role.permissions, [permissionName]: !currentVal } };
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
        permissions: (PERMISSION_COLUMNS || []).reduce((acc, col) => ({ ...acc, [col]: false }), {})
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
    if (window.confirm("Are you sure you want to delete this role?")) {
      setDbRoles(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleAddStore = () => {
    if (!newStoreData.name || !newStoreData.manager) return alert("Fill required fields.");
    const newStore: StoreInfo = {
      id: `S${Date.now()}`,
      store_name: newStoreData.name,
      manager_name: newStoreData.manager,
      address: newStoreData.address || 'TBD',
      commissionRate: parseInt(newStoreData.commission) || 10
    };
    // Fix: Use the state setter instead of direct mutation to ensure UI updates and prevent stale closures
    setDbStores(prev => [...prev, newStore]);
    setNewStoreData({ name: '', manager: '', address: '', commission: '10' });
    setShowStoreModal(false);
  };

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

  const handleCsvFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;
      const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
      if (lines.length < 2) return alert("CSV file empty.");
      const headers = lines[0].split(',').map(h => h.replace(/^["'](.+(?=["']$))["']$/, '$1').trim());
      const rows = lines.slice(1).map(line => line.split(',').map(cell => cell.replace(/^["'](.+(?=["']$))["']$/, '$1').trim()));
      setCsvHeaders(headers);
      setCsvRows(rows);
      const newMapping = { ...columnMapping };
      headers.forEach(h => {
        const lowerH = h.toLowerCase();
        if (lowerH.includes('name')) newMapping.name = h;
        if (lowerH.includes('sku')) newMapping.sku = h;
        if (lowerH.includes('price')) newMapping.price = h;
        if (lowerH.includes('stock')) newMapping.stock = h;
        if (lowerH.includes('category')) newMapping.category = h;
      });
      setColumnMapping(newMapping);
      setShowImportModal(true);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const processImport = () => {
    if (!columnMapping.name || !columnMapping.sku) return alert("Map Name and SKU.");
    const nameIdx = csvHeaders.indexOf(columnMapping.name);
    const skuIdx = csvHeaders.indexOf(columnMapping.sku);
    const priceIdx = csvHeaders.indexOf(columnMapping.price);
    const stockIdx = csvHeaders.indexOf(columnMapping.stock);
    const imported: Product[] = csvRows.map((row, idx) => ({
      id: `P-IMP-${Date.now()}-${idx}`,
      name: row[nameIdx] || 'Unnamed',
      sku: row[skuIdx] || `SKU-${idx}`,
      base_price: priceIdx !== -1 ? parseFloat(row[priceIdx]) || 0 : 0,
      stockLevel: stockIdx !== -1 ? parseInt(row[stockIdx]) || 0 : 0,
      category: 'Other', unit: 'Piece', dimensions: { w: '0', h: '0', d: '0' },
      modifications: [], minStock: 5
    } as any));
    setDbProducts(prev => [...prev, ...imported]);
    setShowImportModal(false);
  };

  const handleStoreChange = (storeId: string) => {
    const store = dbStores.find(s => s.id === storeId);
    if (store) setClientInfo(prev => ({ ...prev, store_id: storeId, managerName: store.manager_name }));
  };

  const addLineItem = (product: Product) => {
    setLineItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleSubmitQuote = () => {
    if (lineItems.length === 0) return alert("No items.");
    const newOrderId = `O${Date.now()}`;
    const newOrder: Order = {
      id: newOrderId, order_no: (400 + dbOrders.length).toString(),
      store_id: clientInfo.store_id, manager_name: clientInfo.managerName,
      client_info: { name: `${clientInfo.firstName} ${clientInfo.lastName}`, address: clientInfo.address, phone: clientInfo.cellPhone, email: clientInfo.email },
      line_items: [...lineItems], status: OrderStatus.Pending, date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
    };
    const newTasks: ProductionTasks = {
      order_id: newOrderId,
      tasks: (ASSEMBLY_TASKS || []).slice(0, 4).map((name, i) => ({ id: `TA-${newOrderId}-${i}`, task_name: name, is_complete: false, signed_by: '', notes: '' }))
    };
    setDbOrders([newOrder, ...dbOrders]);
    setDbProductionTasks([newTasks, ...dbProductionTasks]);
    setLineItems([]);
    setQuoteStep(1);
    setActiveView('TaskManager');
  };

  const dashboardStats = useMemo(() => {
    const storeToFilter = currentUser?.storeId || dashFilterStore;
    const orders = (dbOrders || []).filter(o => storeToFilter === 'All' || o.store_id === storeToFilter);
    const revenue = orders.reduce((sum, o) => sum + (o.line_items || []).reduce((a, b) => a + (b.product.base_price * b.quantity), 0), 0);
    const count = orders.length;
    const invVal = (dbProducts || []).reduce((sum, p) => sum + (p.base_price * p.stockLevel), 0);
    const ops = (dbStores || []).map(s => ({ name: s.store_name, count: (dbOrders || []).filter(o => o.store_id === s.id).length }));
    return { revenue, count, inventoryVal: invVal, ordersPerStore: ops };
  }, [dbOrders, dbStores, dbProducts, currentUser, dashFilterStore]);

  const filteredTasks = useMemo(() => {
    return (dbOrders || []).filter(o => {
      const matchesStatus = tmFilter === 'All' || o.status === tmFilter;
      const matchesStore = !currentUser?.storeId || o.store_id === currentUser.storeId;
      return matchesStatus && matchesStore;
    });
  }, [dbOrders, tmFilter, currentUser]);

  const filteredInventory = useMemo(() => {
    return (dbProducts || []).filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(inventorySearch.toLowerCase()) || p.sku.toLowerCase().includes(inventorySearch.toLowerCase());
      const matchesCategory = inventoryCategory === 'All' || p.category === inventoryCategory;
      return matchesSearch && matchesCategory;
    });
  }, [dbProducts, inventorySearch, inventoryCategory]);

  const canViewDataCenter = useMemo(() => {
    if (!currentUser) return false;
    const isSuper = ['SuperAdmin', 'Executive'].includes(currentUser.role) || currentUser.role.toLowerCase().includes('admin');
    return isSuper || (currentUserRolePermissions && currentUserRolePermissions['view_data_center']);
  }, [currentUser, currentUserRolePermissions]);

  const userStoreName = (dbStores || []).find(s => s.id === currentUser?.storeId)?.store_name;
  const dashboardTitle = userStoreName ? `Store Performance: ${userStoreName}` : "Global Overview";

  const statsList = useMemo(() => [
    { id: 'rev', label: 'Total Revenue', val: `$${dashboardStats.revenue.toLocaleString()}`, trend: '↑ 14%', icon: DollarSign, exp: "Calculation: Sum of 'Total Amount' from all 'Delivered' and 'In Process' orders." },
    { id: 'prf', label: 'Net Profit', val: `$${(dashboardStats.revenue * 0.28).toLocaleString()}`, trend: '↑ 5%', icon: TrendingUp, exp: "Calculation: Total Revenue - (Cost of Goods Sold + Labor Costs)." },
    { id: 'ord', label: 'Active Orders', val: dashboardStats.count, trend: '↑ 8%', icon: ClipboardList, exp: "Count of all active orders excluding 'Drafts'." },
    { id: 'inv', label: 'Inventory Value', val: `$${(dashboardStats.inventoryVal / 1000).toFixed(1)}k`, trend: '↓ 5%', icon: Warehouse, exp: "Calculation: Sum of current stock levels multiplied by base manufacturing costs." }
  ], [dashboardStats]);

  if (!currentUser) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-900 font-sans overflow-hidden">
      <aside className="w-72 bg-white border-r border-slate-200 p-6 flex flex-col z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100 shrink-0"><Layers size={22} /></div>
          <h1 className="font-black text-lg tracking-tighter">51K PORTAL</h1>
        </div>
        <nav className="flex-1 space-y-6 overflow-y-auto scrollbar-hide">
          {currentUser.role !== 'Worker' && (
            <div>
              <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">OVERVIEW</p>
              <button onClick={() => setActiveView('Dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'Dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'}`}>
                <BarChart3 size={18} /><span className="font-bold text-xs">Dashboard</span>
              </button>
            </div>
          )}
          {['SuperAdmin', 'Executive'].includes(currentUser.role) && (
            <div>
              <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">EXECUTIVE</p>
              <div className="space-y-1">
                {[{id:'Users',l:'Access Control',i:ShieldCheck},{id:'Stores',l:'Hub Network',i:Building2},{id:'DataCenter',l:'Data Center',i:Database}].map(item => (
                  <button key={item.id} onClick={() => setActiveView(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'}`}>
                    <item.i size={18} /><span className="font-bold text-xs">{item.l}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {['SuperAdmin', 'Manager'].includes(currentUser.role) && (
            <div>
              <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">SALES</p>
              <div className="space-y-1">
                {[{id:'Quote',l:'Quote Builder',i:FilePlus},{id:'Orders',l:'Orders',i:ClipboardList}].map(item => (
                  <button key={item.id} onClick={() => setActiveView(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'}`}>
                    <item.i size={18} /><span className="font-bold text-xs">{item.l}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          <div>
            <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">PRODUCTION</p>
            <div className="space-y-1">
              {[{id:'TaskManager',l:'Task Board',i:ListTodo},{id:'Inventory',l:'Stock',i:Warehouse},{id:'Catalog',l:'Catalog',i:Package}].map(item => (
                <button key={item.id} onClick={() => setActiveView(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'}`}>
                  <item.i size={18} /><span className="font-bold text-xs">{item.l}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>
        <div className="pt-6 border-t border-slate-200">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-black text-xs uppercase"><LogOut size={18} /> Logout</button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-10 flex items-center justify-between shrink-0 z-40">
          <h2 className="text-xl font-black tracking-tight capitalize">{activeView.replace(/([A-Z])/g, ' $1').trim()}</h2>
          <div className="flex items-center gap-4">
            <div className="text-right"><p className="text-sm font-black">{currentUser.name}</p><span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[8px] font-black uppercase">{userStoreName || currentUser.role}</span></div>
            <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-black text-sm">{currentUser.name?.[0]}</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10 scrollbar-hide">
          {activeView === 'Dashboard' && (
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black tracking-tight">{dashboardTitle}</h3>
                {!currentUser.storeId && (
                  <div className="flex gap-4 items-center bg-white p-2 rounded-2xl border border-slate-200">
                    <Filter size={14} className="text-slate-400 ml-2" />
                    <select value={dashFilterStore} onChange={e => setDashFilterStore(e.target.value)} className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-[10px] font-black outline-none">
                      <option value="All">All Hubs</option>{dbStores.map(s => <option key={s.id} value={s.id}>{s.store_name}</option>)}
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {statsList.map((s) => (
                  <div key={s.id} className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm group hover:border-blue-300 transition-all relative">
                    <div className="flex justify-between items-start mb-1 relative z-30">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                      <div className="relative">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setActiveTooltipID(activeTooltipID === s.id ? null : s.id); }} 
                          className={`p-1.5 rounded-full transition-all ${activeTooltipID === s.id ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-100 hover:text-slate-600'}`}
                        >
                          <Info size={14} />
                        </button>
                        
                        {activeTooltipID === s.id && (
                          <div className="absolute top-12 -right-4 w-64 bg-white border border-slate-200 p-5 rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 cursor-default">
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Logic Breakdown</span>
                              <button onClick={() => setActiveTooltipID(null)} className="text-slate-300 hover:text-slate-500 transition-colors"><X size={12}/></button>
                            </div>
                            <p className="text-[12px] font-medium text-slate-600 leading-relaxed italic">
                              {s.exp}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2 relative z-10">
                      <p className="text-3xl font-black tracking-tighter">{s.val}</p>
                      <span className={`text-[10px] font-bold ${s.trend.startsWith('↑') ? 'text-emerald-500' : 'text-red-400'}`}>{s.trend}</span>
                    </div>
                    <div className="absolute inset-0 rounded-[32px] overflow-hidden pointer-events-none">
                       <s.icon className="absolute -bottom-4 -right-4 text-slate-50/80 w-24 h-24" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-[40px] p-10 border border-slate-200 shadow-sm space-y-8">
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Regional Performance Map</h4>
                   <div className="space-y-6">
                      {dashboardStats.ordersPerStore.filter(s => !currentUser.storeId || s.name === userStoreName).map(s => {
                        const maxCount = Math.max(...dashboardStats.ordersPerStore.map(v => v.count)) || 1;
                        return (
                          <div key={s.name} className="space-y-2">
                            <div className="flex justify-between text-xs font-bold text-slate-600"><span>{s.name}</span><span>{s.count} Orders</span></div>
                            <div className="h-3 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{width:`${(s.count/maxCount)*100}%`}}></div></div>
                          </div>
                        )
                      })}
                   </div>
                </div>
                <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden flex flex-col justify-center">
                   <div className="relative z-10">
                     <h3 className="text-3xl font-black tracking-tight">AI Optimization</h3>
                     <p className="text-slate-400 mt-4 text-sm max-w-xs font-medium">Use Gemini AI to detect production bottlenecks and analyze material waste trends.</p>
                     <button className="mt-8 bg-blue-600 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-2"><Sparkles size={14}/> Run Analytics</button>
                   </div>
                   <Activity size={200} className="absolute -bottom-10 -right-10 text-white/5" />
                </div>
              </div>
            </div>
          )}
          
          {activeView === 'TaskManager' && (
            <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500">
               <div className="flex flex-wrap items-center justify-between gap-6">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900">Production Board</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Manufacturing Pipeline Control</p>
                  </div>
                  <div className="flex bg-white p-1 rounded-2xl border shadow-sm gap-1">
                    {['All', 'Pending', 'In Process', 'Quality Check', 'Ready'].map(s => (
                      <button key={s} onClick={() => setTmFilter(s)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${tmFilter === s ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'text-slate-500 hover:bg-slate-50'}`}>{s}</button>
                    ))}
                  </div>
               </div>
               <div className="space-y-8 pb-20">
                 {filteredTasks.length === 0 ? (
                   <div className="py-32 text-center bg-white rounded-[40px] border-2 border-dashed border-slate-100"><Clock size={40} className="mx-auto text-slate-100 mb-4" /><p className="text-[10px] font-black text-slate-300 uppercase">Queue Empty</p></div>
                 ) : (
                   filteredTasks.map(order => (
                     <div key={order.id} className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden hover:border-blue-200 transition-all p-1">
                        <div className="p-8 pb-6 flex items-center justify-between">
                           <div className="flex items-center gap-6">
                              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 font-black text-xl">#{order.order_no}</div>
                              <div>
                                 <h4 className="text-lg font-black text-slate-900 leading-tight">{order.client_info.name}</h4>
                                 <p className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1.5 mt-1"><Calendar size={12}/> Due: {order.due_date || 'TBD'}</p>
                              </div>
                           </div>
                           <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${order.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>{order.status}</div>
                        </div>
                        <div className="px-8 mb-8 flex flex-wrap gap-2">
                          {(order.line_items || []).map((item, idx) => (
                            <span key={idx} className="bg-slate-50 text-slate-500 px-3 py-1 rounded-lg text-[10px] font-black border border-slate-100">{item.product.name} x{item.quantity}</span>
                          ))}
                        </div>
                        <div className="p-8 bg-slate-50/50 border-t border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-6">
                          {((dbProductionTasks.find(pt => pt.order_id === order.id)?.tasks) || []).map(task => (
                            <div key={task.id} className="p-5 rounded-3xl border border-slate-100 bg-white shadow-sm flex items-center gap-3">
                              <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center ${task.is_complete ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-100 text-transparent'}`}><Check size={12} strokeWidth={4}/></div>
                              <span className={`text-[11px] font-black ${task.is_complete ? 'text-emerald-600 line-through opacity-50' : 'text-slate-700'}`}>{task.task_name}</span>
                            </div>
                          ))}
                        </div>
                     </div>
                   ))
                 )}
               </div>
            </div>
          )}

          {activeView === 'Inventory' && (
            <div className="space-y-6 animate-in fade-in duration-500">
               <div className="flex flex-wrap gap-4 items-center bg-white p-6 rounded-[32px] border shadow-sm">
                  <div className="flex-1 relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Search SKU or Title..." value={inventorySearch} onChange={e => setInventorySearch(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold outline-none" />
                  </div>
                  <select value={inventoryCategory} onChange={e => setInventoryCategory(e.target.value)} className="bg-slate-50 border border-slate-100 rounded-2xl px-6 py-3 text-sm font-bold outline-none cursor-pointer">
                    <option value="All">All Stocks</option>
                    <option value="Cabinet Style">Cabinets</option>
                    <option value="Hardware">Hardware</option>
                  </select>
               </div>
               <div className="bg-white rounded-[40px] border shadow-sm overflow-hidden">
                  <table className="w-full text-left">
                     <thead className="bg-slate-50 border-b"><tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest"><th className="px-8 py-5">Product Ref</th><th className="px-8 py-5">Category</th><th className="px-8 py-5 text-center">Available</th><th className="px-8 py-5 text-right">Unit Value</th></tr></thead>
                     <tbody className="divide-y">
                        {filteredInventory.map(p => (
                          <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                             <td className="px-8 py-6 font-black text-sm text-slate-900">{p.name} <span className="block text-[9px] text-slate-400 tracking-widest">{p.sku}</span></td>
                             <td className="px-8 py-6 text-xs font-black text-slate-500 uppercase">{p.category}</td>
                             <td className="px-8 py-6 text-center"><span className={`px-4 py-1.5 rounded-xl text-xs font-black ${p.stockLevel < p.minStock ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-slate-50 text-slate-900'}`}>{p.stockLevel}</span></td>
                             <td className="px-8 py-6 text-right font-black text-blue-600 text-sm">${p.base_price.toFixed(2)}</td>
                          </tr>
                        ))}
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

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
};

export default App;