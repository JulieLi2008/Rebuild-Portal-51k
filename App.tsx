
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  FilePlus, 
  Store, 
  ClipboardList, 
  Settings, 
  Factory as FactoryIcon, 
  Users, 
  Package, 
  LogOut, 
  Search, 
  ChevronRight, 
  ChevronDown,
  Trash2,
  Sparkles,
  Info,
  DollarSign,
  Plus,
  ArrowRight,
  Calculator,
  X,
  Upload,
  Database,
  ShieldCheck,
  Layers,
  User,
  Tag,
  ShoppingCart,
  ChevronUp,
  History,
  ShoppingBag,
  Grid,
  Lock,
  UserPlus,
  BarChart3,
  Warehouse,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Truck,
  PlusCircle,
  Filter,
  ShieldAlert,
  UserCheck,
  BadgeCheck,
  Hammer,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Layers3,
  Layout,
  Palette,
  DoorOpen,
  Maximize2,
  Puzzle,
  Construction,
  Wrench,
  Boxes,
  ArrowDown,
  ChevronRightCircle,
  Ruler,
  Printer,
  CalendarDays,
  MoreVertical,
  Edit3,
  Check,
  Factory,
  TrendingUp,
  ArrowUpRight,
  Eye
} from 'lucide-react';
import { 
  Order, 
  OrderStatus, 
  StoreInfo, 
  Product, 
  QuoteLineItem, 
  UserProfile, 
  UserRole 
} from './types';
import { analyzeOrderHistory, suggestQuoteOptimization } from './services/geminiService';

// --- INITIAL MOCK DATA ---
const INITIAL_STORES: StoreInfo[] = [
  { id: 'S1', name: 'Toronto Flagship', address: '115 Ironside Crescent', email: 'main@51wood.ca', phone: '416-292-9788', managerId: 'U2', isActive: true, commissionRate: 15 },
  { id: 'S2', name: 'North York Studio', address: '250 Manufacturing Way', email: 'ny@51wood.ca', phone: '416-555-0999', isActive: true, commissionRate: 12 },
];

const INITIAL_USERS: UserProfile[] = [
  { id: 'U1', name: 'Leo SuperAdmin', email: 'admin@51wood.ca', role: 'SuperAdmin', approved: true, joinDate: '2023-01-01' },
  { id: 'U2', name: 'Sarah Manager', email: 'sarah@51wood.ca', role: 'Manager', storeId: 'S1', approved: true, joinDate: '2023-05-12' },
  { id: 'U3', name: 'Mike Sales', email: 'mike@51wood.ca', role: 'Sales', storeId: 'S1', approved: true, joinDate: '2023-06-10' },
  { id: 'U4', name: 'Kevin Worker', email: 'kevin@factory.ca', role: 'FactoryWorker', approved: true, joinDate: '2023-02-15' },
  { id: 'U5', name: 'James Supplier', email: 'james@lumber.ca', role: 'Supplier', approved: true, joinDate: '2023-08-01' },
  { id: 'U6', name: 'Waitlist User', email: 'pending@gmail.com', role: 'Sales', approved: false, joinDate: '2024-02-28' },
];

const MOCK_PRODUCTS: Product[] = Array.from({ length: 45 }).map((_, i) => ({
  id: `P${i}`,
  name: i < 5 ? ['Upper Cabinet', 'Base Cabinet', 'Corner Unit', 'Pantry Board', 'Drawer'][i] : `Product SKU-${1000 + i}`,
  category: i < 15 ? 'Cabinet Style' : i < 30 ? 'Hardware' : 'Accessory',
  price: Math.floor(Math.random() * 200) + 20,
  unit: i < 5 ? 'Feet' : 'Piece',
  image: '',
  stockLevel: Math.floor(Math.random() * 500),
  minStock: 50
}));

const MOCK_FACTORIES = [
  { name: 'JulieFactory', address: '2300 Kennedy Rd.', email: 'juliefactory@gmail.com', phone: '6666666666', contact: 'Julie', services: '', volume: '$45,200', margin: '20%' },
  { name: 'Viceroy', address: '414croft street east', email: 'tony.ku@viceroybuilding.com', phone: '6476797803', contact: 'tony', services: 'Cabinet, Door, Factory', volume: '$32,800', margin: '18%' },
  { name: 'Unihopper', address: '110 Denison St #10, Markham, ON L3R 1B6', email: 'service@uniteckhardware.com', phone: '6477186688', contact: '未知', services: '' },
  { name: 'Winnec hardware', address: '65 Bowes Road, Unit 8 Vaughan, Ontario L3R 1E4 Canada', email: 'info@winnecinc.com', phone: '9056045515', contact: '未知', services: '' },
  { name: 'K.M.S Hardware', address: '825 Middlefield Rd, Scarborough, ON M1V 4Z7', email: '待补充', phone: '6418800716', contact: 'Kenny', services: '' },
  { name: 'JC,Eurofit', address: '7055 Fir Tree Dr. Mississauga, Ontario L5S 1J7 Canada', email: 'service@eurofitca.com', phone: '4168389520', contact: 'Merphy', services: '' },
  { name: 'MIF', address: '待补充', email: '待补充', phone: '9058505888', contact: '未知', services: '' },
  { name: 'Decotec', address: '975 Alness Street North York Ontario, M3J', email: 'Ltal@decotecinc.com', phone: '6473020889', contact: 'Mike', services: '' },
];

const MOCK_STORE_ORDERS = [
  { date: '2025-12-16 17:29:48', orderNo: '374', sales: 'Shirley', client: 'William', address: '1828 Dencourt Dr', phone: '416-555-0101', total: '1746.00', cabinet: 'WPS White Particle Door', status: 'Assigned to Hourly Designer', storeId: 'S1' },
  { date: '2025-11-05 20:55:55', orderNo: '372', sales: 'JulieAdmin', client: 'JulieCustomer LiCustomer', address: '2300 Kennedy Rd.', phone: '8888888888', total: '3709.83', cabinet: 'WPS Highgloss Door', status: 'Assigned to Hourly Maker Pool', storeId: 'S2' },
  { date: '2025-11-03 16:00:39', orderNo: '368', sales: 'Julie', client: 'Tom Customers', address: '2300 Kennedy rd.', phone: '416-555-0102', total: '7552.70', cabinet: 'WPS White Particle Door', status: 'Contract Maker Pool', storeId: 'S1' },
  { date: '2024-12-21 20:12:02', orderNo: '367', sales: 'Mike', client: 'curt w?', address: '28 Carolbreen SQ', phone: '4617777777', total: '0.00', cabinet: 'High Gloss MDF', status: 'Assigned to Hourly Maker Pool', storeId: 'S1' },
  { date: '2024-12-20 20:15:10', orderNo: '366', sales: 'Sarah', client: 'curt w?', address: '28 Carolbreen SQ', phone: '4617777777', total: '0.00', cabinet: 'Maple Solid', status: 'pending', storeId: 'S2' },
];

// Define WORKFLOW_STEPS constant to resolve "Cannot find name 'WORKFLOW_STEPS'" errors
const WORKFLOW_STEPS = [
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

const App: React.FC = () => {
  // Global State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activeView, setActiveView] = useState('Welcome');
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [stores, setStores] = useState<StoreInfo[]>(INITIAL_STORES);
  const [catalog] = useState<Product[]>(MOCK_PRODUCTS);
  
  // UI States
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState('combo');
  const [activeComboSubTab, setActiveComboSubTab] = useState('Color Partical');
  const [lineItems, setLineItems] = useState<QuoteLineItem[]>([]);
  const [expandedStoreId, setExpandedStoreId] = useState<string | null>('S1'); 
  const [isAddingStore, setIsAddingStore] = useState(false);
  const [isAddingSupplier, setIsAddingSupplier] = useState(false);
  const [selectedOrderReview, setSelectedOrderReview] = useState<any>(null);

  const [newStoreForm, setNewStoreForm] = useState({ name: '', address: '', email: '', phone: '', contact: '', margin: '', gst: '' });
  const [newSupplierForm, setNewSupplierForm] = useState({ name: '', address: '', email: '', phone: '', contact: '', services: '' });
  const [clientInfo, setClientInfo] = useState({ referral: '', firstName: '', lastName: '', homePhone: '', cellPhone: '', address: '', province: 'ON', city: '', postalCode: '', email: '', shippingAddressType: 'same', note: '', storeName: '', salesName: '' });
  const [measurements, setMeasurements] = useState({ upperHeight: '30', lowerHeight: '35 1/4', upperDepth: '11 3/4', lowerDepth: '23 1/2', pantryHeight: '96', pantryDepth: '24', islandHeight: '35 1/4', islandDepth: '24' });

  const workspaceRef = useRef<HTMLDivElement>(null);
  const canAccess = (roles: UserRole[]) => currentUser && roles.includes(currentUser.role);

  const handleLogin = (user: UserProfile) => {
    if (!user.approved) { alert("Access Denied: Your account is pending SuperAdmin approval."); return; }
    setCurrentUser(user);
    setActiveView('Welcome');
    setClientInfo(prev => ({ ...prev, storeName: user.storeId ? INITIAL_STORES.find(s => s.id === user.storeId)?.name || '' : '', salesName: user.name }));
  };

  const toggleApproval = (userId: string) => { setUsers(prev => prev.map(u => u.id === userId ? { ...u, approved: !u.approved } : u)); };

  const addLineItem = (product: Product) => {
    setLineItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { product, quantity: 1 }];
    });
  };

  const scrollToWorkspace = () => { workspaceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };

  const handleSaveNewStore = () => {
    if (!newStoreForm.name) return;
    const newStore: StoreInfo = { id: `S${stores.length + 1}`, name: newStoreForm.name, address: newStoreForm.address, email: newStoreForm.email, phone: newStoreForm.phone, isActive: true, commissionRate: parseInt(newStoreForm.margin) || 0 };
    setStores([...stores, newStore]);
    setIsAddingStore(false);
    setNewStoreForm({ name: '', address: '', email: '', phone: '', contact: '', margin: '', gst: '' });
  };

  const handleSaveNewSupplier = () => { setIsAddingSupplier(false); setNewSupplierForm({ name: '', address: '', email: '', phone: '', contact: '', services: '' }); };

  const navItems = [
    { id: 'Welcome', label: 'Dashboard', icon: Sparkles, roles: ['SuperAdmin', 'Manager', 'Sales', 'FactoryWorker', 'Supplier'] },
    { id: 'Quote', label: 'Marketing: Quotes', icon: FilePlus, roles: ['SuperAdmin', 'Manager', 'Sales'] },
    { id: 'Stores', label: 'Marketing: Stores', icon: Building2, roles: ['SuperAdmin', 'Manager'] },
    { id: 'Inventory', label: 'Factory: Inventory', icon: Warehouse, roles: ['SuperAdmin', 'FactoryWorker', 'Supplier'] },
    { id: 'Orders', label: 'Admin: Orders', icon: ClipboardList, roles: ['SuperAdmin', 'Manager'] },
    { id: 'Users', label: 'Admin: Access', icon: ShieldCheck, roles: ['SuperAdmin'] },
    { id: 'Catalog', label: 'Master Catalog', icon: Package, roles: ['SuperAdmin'] },
  ].filter(item => canAccess(item.roles as UserRole[]));

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-10 border border-slate-200">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-blue-200">
              <Layers size={40} />
            </div>
            <h1 className="text-3xl font-black text-slate-900">51WOOD Portal</h1>
            <p className="text-slate-400 font-medium text-sm mt-2">Authorized Access Only</p>
          </div>
          <div className="space-y-3">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mb-4">Select User Profile to Login</p>
            {users.map(u => (
              <button key={u.id} onClick={() => handleLogin(u)} className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border group ${u.approved ? 'bg-slate-50 border-slate-100 hover:bg-white hover:shadow-md' : 'bg-red-50 border-red-100 cursor-not-allowed opacity-60'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${u.approved ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                    {u.approved ? <User size={20} /> : <Lock size={20} />}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-black text-slate-900">{u.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{u.role} {u.storeId ? `• ${u.storeId}` : ''}</p>
                  </div>
                </div>
                {u.approved && <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />}
              </button>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t border-slate-100 text-center"><button className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">Request New Account</button></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-900 font-sans overflow-hidden">
      <aside className={`${isSidebarCollapsed ? 'w-20' : 'w-72'} bg-white border-r border-slate-200 p-6 flex flex-col transition-all duration-300 z-50`}>
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100 shrink-0"><Layers size={22} /></div>
          {!isSidebarCollapsed && <h1 className="font-black text-lg tracking-tighter shrink-0">51K PORTAL</h1>}
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-hide">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveView(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'}`}>
              <item.icon size={18} />
              {!isSidebarCollapsed && <span className="font-bold text-xs truncate">{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="pt-6 border-t border-slate-200"><button onClick={() => setCurrentUser(null)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all"><LogOut size={18} />{!isSidebarCollapsed && <span className="font-black text-xs uppercase">Logout</span>}</button></div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-10 flex items-center justify-between shrink-0 z-40">
          <div><h2 className="text-xl font-black text-slate-900 tracking-tight capitalize">{activeView.replace(/([A-Z])/g, ' $1')}</h2><p className="text-xs text-slate-400 font-medium">Manufacturing & Order ERP</p></div>
          <div className="flex items-center gap-4">
            <div className="text-right"><p className="text-sm font-black text-slate-900">{currentUser.name}</p><span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest">{currentUser.role}</span></div>
            <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-black text-sm">{currentUser.name[0]}</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10 bg-[#f8fafc]">
          
          {activeView === 'Welcome' && (
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[32px] p-8 text-white shadow-xl shadow-blue-100 md:col-span-2 relative overflow-hidden">
                   <div className="relative z-10"><h3 className="text-3xl font-black">System Ready.</h3><p className="text-blue-100 mt-2 max-w-sm">Manage multi-store quotes, factory logistics, and personnel approvals from one unified smart portal.</p><button className="mt-6 bg-white text-blue-600 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg">View Reports</button></div>
                   <Sparkles size={180} className="absolute -bottom-10 -right-10 text-white/10" />
                </div>
                <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm flex flex-col justify-center">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Connected Stores</p>
                   <p className="text-4xl font-black text-slate-900">{stores.length}</p>
                   <div className="mt-4 flex -space-x-2">{stores.map(s => <div key={s.id} className="w-8 h-8 rounded-lg bg-blue-50 border-2 border-white flex items-center justify-center text-[10px] font-bold text-blue-600">{s.name[0]}</div>)}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                 {[{ l: 'New Quotes', v: '12', i: FilePlus, c: 'blue' }, { l: 'Production', v: '8', i: Hammer, c: 'amber' }, { l: 'Inventory', v: '1,410', i: Package, c: 'emerald' }, { l: 'Approvals', v: users.filter(u => !u.approved).length.toString(), i: UserCheck, c: 'red' }].map((card, i) => (
                   <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm"><div className={`w-10 h-10 bg-${card.c}-50 text-${card.c}-600 rounded-xl flex items-center justify-center mb-4`}><card.i size={20} /></div><p className="text-2xl font-black text-slate-900">{card.v}</p><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{card.l}</p></div>
                 ))}
              </div>
            </div>
          )}

          {activeView === 'Users' && (
            <div className="space-y-6 animate-in fade-in duration-500">
               <div className="flex items-center justify-between"><div><h3 className="text-lg font-black text-slate-900 uppercase tracking-widest">Global Access Governance</h3><p className="text-sm text-slate-400">Approval queue and role assignment for all platform personnel.</p></div></div>
               <div className="grid grid-cols-1 gap-4">
                  {users.map(u => (
                    <div key={u.id} className={`bg-white rounded-3xl border ${!u.approved ? 'border-amber-200 bg-amber-50/20' : 'border-slate-200'} p-6 flex items-center justify-between shadow-sm`}>
                       <div className="flex items-center gap-4"><div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${!u.approved ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>{u.role === 'SuperAdmin' ? <ShieldCheck size={28} /> : <User size={28} />}</div><div><div className="flex items-center gap-2"><span className="font-black text-slate-900">{u.name}</span><span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[8px] font-black uppercase">{u.role}</span>{!u.approved && <span className="flex items-center gap-1 text-[8px] font-black text-amber-600 bg-amber-100 px-2 py-0.5 rounded uppercase"><ShieldAlert size={10} /> Pending Approval</span>}</div><p className="text-xs text-slate-400">{u.email} • Joined {u.joinDate}</p></div></div>
                       <div className="flex items-center gap-3">{u.id !== currentUser.id && (<button onClick={() => toggleApproval(u.id)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${u.approved ? 'bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600' : 'bg-blue-600 text-white shadow-lg shadow-blue-200 hover:scale-105'}`}>{u.approved ? 'Revoke Access' : 'Approve Account'}</button>)}<button className="p-3 text-slate-400 hover:bg-slate-50 rounded-xl transition-all"><Settings size={18} /></button></div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeView === 'Stores' && (
            <div className="space-y-12 animate-in fade-in duration-500 pb-20">
               <div className="flex items-center justify-between"><div><h3 className="text-lg font-black text-slate-900 uppercase tracking-widest">Store Network</h3><p className="text-sm text-slate-400">Marketing reach and physical studio management.</p></div><button onClick={() => setIsAddingStore(!isAddingStore)} className="bg-blue-600 text-white px-8 py-3 rounded-full font-black text-[11px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blue-200 hover:scale-105 transition-all"><PlusCircle size={18} /> OPEN NEW STORE</button></div>
               {isAddingStore && (
                 <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm animate-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center justify-between mb-8"><h3 className="text-lg font-serif text-slate-800">Store Info</h3></div>
                    <div className="overflow-x-auto">
                       <table className="w-full text-left">
                          <thead><tr><th className="px-2 py-4 text-xs font-medium text-slate-500"></th><th className="px-2 py-4 text-xs font-medium text-slate-500">Name</th><th className="px-2 py-4 text-xs font-medium text-slate-500">Address</th><th className="px-2 py-4 text-xs font-medium text-slate-500">Email</th><th className="px-2 py-4 text-xs font-medium text-slate-500">Phone</th><th className="px-2 py-4 text-xs font-medium text-slate-500">Contact</th><th className="px-2 py-4 text-xs font-medium text-slate-500">Margin</th><th className="px-2 py-4 text-xs font-medium text-slate-500">GST#</th><th className="px-2 py-4"></th></tr></thead>
                          <tbody><tr className="bg-slate-50/50"><td className="px-2 py-4"><div className="w-5 h-5 bg-indigo-50 text-indigo-400 rounded-full flex items-center justify-center border border-indigo-100"><Plus size={12}/></div></td><td className="px-2 py-4"><input type="text" value={newStoreForm.name} onChange={e => setNewStoreForm({...newStoreForm, name: e.target.value})} className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs outline-none focus:border-blue-500" placeholder="Store Name" /></td><td className="px-2 py-4"><input type="text" value={newStoreForm.address} onChange={e => setNewStoreForm({...newStoreForm, address: e.target.value})} className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs outline-none focus:border-blue-500" placeholder="Address" /></td><td className="px-2 py-4"><input type="email" value={newStoreForm.email} onChange={e => setNewStoreForm({...newStoreForm, email: e.target.value})} className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs outline-none focus:border-blue-500" placeholder="Email" /></td><td className="px-2 py-4"><input type="text" value={newStoreForm.phone} onChange={e => setNewStoreForm({...newStoreForm, phone: e.target.value})} className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs outline-none focus:border-blue-500" placeholder="Phone" /></td><td className="px-2 py-4"><input type="text" value={newStoreForm.contact} onChange={e => setNewStoreForm({...newStoreForm, contact: e.target.value})} className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs outline-none focus:border-blue-500" placeholder="Contact" /></td><td className="px-2 py-4 w-20"><input type="text" value={newStoreForm.margin} onChange={e => setNewStoreForm({...newStoreForm, margin: e.target.value})} className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs outline-none focus:border-blue-500" placeholder="25" /></td><td className="px-2 py-4"><input type="text" value={newStoreForm.gst} onChange={e => setNewStoreForm({...newStoreForm, gst: e.target.value})} className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs outline-none focus:border-blue-500" placeholder="GST#" /></td><td className="px-2 py-4 text-right"><div className="flex items-center gap-2"><button onClick={handleSaveNewStore} className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors shadow-sm"><Check size={14}/></button><button onClick={() => setIsAddingStore(false)} className="p-2 bg-slate-100 text-slate-400 rounded hover:bg-slate-200 transition-colors"><X size={14}/></button></div></td></tr></tbody>
                       </table>
                    </div>
                 </div>
               )}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {stores.map(store => (
                    <div key={store.id} onClick={() => setExpandedStoreId(expandedStoreId === store.id ? null : store.id)} className={`bg-white rounded-[40px] border p-10 shadow-sm group hover:shadow-xl transition-all cursor-pointer ${expandedStoreId === store.id ? 'border-blue-600 ring-2 ring-blue-50' : 'border-slate-200'}`}>
                       <div className="flex items-start justify-between mb-10"><div className="flex items-center gap-4"><div className={`w-16 h-16 rounded-[24px] flex items-center justify-center transition-all duration-500 ${expandedStoreId === store.id ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'}`}><Building2 size={32} /></div><div><h4 className="text-xl font-black text-slate-900">{store.name}</h4><p className="text-xs text-slate-400 font-medium">{store.address}</p></div></div><div className="flex flex-col items-end gap-2"><div className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{store.commissionRate}% Margin</div><p className="text-[10px] font-black text-blue-600 flex items-center gap-1">{expandedStoreId === store.id ? 'Hide Orders' : 'View Orders'}{expandedStoreId === store.id ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}</p></div></div>
                       <div className="grid grid-cols-2 gap-6 pt-10 border-t border-slate-100"><div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Authorized Sales</p><div className="flex -space-x-2">{users.filter(u => u.storeId === store.id).map(u => (<div key={u.id} className="w-9 h-9 rounded-xl bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold" title={u.name}>{u.name[0]}</div>))}<button className="w-9 h-9 rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 hover:text-blue-600 transition-colors"><Plus size={16} /></button></div></div><div className="text-right"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Monthly Volume</p><p className="text-2xl font-black text-slate-900">$24,800.00</p></div></div>
                    </div>
                  ))}
               </div>
               {expandedStoreId && (
                 <div className="animate-in slide-in-from-top-4 duration-500 space-y-6">
                    <div className="flex items-center gap-3"><div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-100"><ClipboardList size={20}/></div><h3 className="text-lg font-black text-slate-900 uppercase tracking-widest">My Store orders</h3></div>
                    <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm space-y-4"><div className="grid grid-cols-1 md:grid-cols-5 gap-4"><div className="relative"><input type="text" placeholder="From" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-blue-500" /><CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} /></div><div className="relative"><input type="text" placeholder="To" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-blue-500" /><CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} /></div><div><input type="text" placeholder="Name" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-blue-500" /></div><div><input type="text" placeholder="Address" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-blue-500" /></div><div><input type="text" placeholder="Phone" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs outline-none focus:ring-1 focus:ring-blue-500" /></div></div><div className="flex justify-between items-center"><div className="relative w-64"><select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs outline-none appearance-none font-medium text-slate-500 focus:ring-1 focus:ring-blue-500"><option>Select Sales</option><option>Shirley</option><option>JulieAdmin</option></select><ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} /></div><button className="bg-slate-100 text-slate-700 px-8 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-slate-300 transition-colors shadow-sm">Search</button></div></div>
                    <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-left border-collapse"><thead><tr className="bg-slate-50 border-b border-slate-200"><th className="px-4 py-4 w-10"></th><th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100">Date</th><th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100">Order#</th><th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100">Sales</th><th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100">Client Name</th><th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100">Address</th><th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100">Home Phone</th><th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100">Total</th><th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100">Cabinet</th><th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100">Status</th><th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Print <Printer size={12} className="inline ml-1 opacity-40"/></th></tr></thead><tbody className="divide-y divide-slate-100">{MOCK_STORE_ORDERS.map((order, idx) => (<tr key={order.orderNo} className="hover:bg-slate-50/50 transition-colors"><td className="px-4 py-6 text-center"><div className="w-5 h-5 bg-indigo-50 text-indigo-400 rounded-full flex items-center justify-center border border-indigo-100 cursor-pointer hover:bg-indigo-600 hover:text-white transition-all shadow-sm"><Plus size={12}/></div></td><td className="px-4 py-6 text-[11px] text-slate-600 border-r border-slate-100">{order.date}</td><td className="px-4 py-6 border-r border-slate-100"><div className="space-y-1"><p className="text-[11px] font-black text-slate-900">{order.orderNo}</p><button className="text-[9px] font-black text-blue-600 hover:underline block uppercase">Edit</button><button className="text-[9px] font-black text-red-500 hover:underline block uppercase">Delete</button></div></td><td className="px-4 py-6 text-[11px] font-medium text-slate-600 border-r border-slate-100">{order.sales}</td><td className="px-4 py-6 text-[11px] font-black text-slate-900 border-r border-slate-100">{order.client}</td><td className="px-4 py-6 text-[11px] text-slate-500 border-r border-slate-100">{order.address}</td><td className="px-4 py-6 text-[11px] text-slate-500 border-r border-slate-100">{order.phone}</td><td className="px-4 py-6 text-[11px] font-black text-slate-900 border-r border-slate-100">{order.total}</td><td className="px-4 py-6 text-[11px] text-slate-500 border-r border-slate-100">{order.cabinet}</td><td className="px-4 py-6 border-r border-slate-100"><span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${order.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>{order.status}</span></td><td className="px-4 py-6 text-right"><div className="space-y-1">{['Quote', 'contract', 'Invoice', 'Doors', 'Boards'].map(p => (<button key={p} className="text-[9px] font-black text-slate-700 hover:text-blue-600 block w-full text-right capitalize">{p}</button>))}</div></td></tr>))}</tbody></table></div></div>
                 </div>
               )}
            </div>
          )}

          {activeView === 'Inventory' && (
            <div className="space-y-12 animate-in fade-in duration-500 pb-20">
               <div className="space-y-6">
                  <div className="flex items-center justify-between"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100"><Factory size={20}/></div><h3 className="text-lg font-black text-slate-900 uppercase tracking-widest">My Suppliers</h3></div><button onClick={() => setIsAddingSupplier(!isAddingSupplier)} className="bg-blue-600 text-white px-8 py-3 rounded-full font-black text-[11px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blue-200 hover:scale-105 transition-all"><PlusCircle size={18} /> ADD A NEW SUPPLIER</button></div>
                  {isAddingSupplier && (
                    <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm animate-in slide-in-from-top-2 duration-300">
                       <div className="flex items-center justify-between mb-8"><h3 className="text-lg font-serif text-slate-800">Supplier Info</h3></div>
                       <div className="overflow-x-auto">
                          <table className="w-full text-left">
                             <thead><tr><th className="px-2 py-4 text-xs font-medium text-slate-500"></th><th className="px-2 py-4 text-xs font-medium text-slate-500">Name</th><th className="px-2 py-4 text-xs font-medium text-slate-500">Address</th><th className="px-2 py-4 text-xs font-medium text-slate-500">Email</th><th className="px-2 py-4 text-xs font-medium text-slate-500">Phone</th><th className="px-2 py-4 text-xs font-medium text-slate-500">Contact</th><th className="px-2 py-4 text-xs font-medium text-slate-500">Services</th><th className="px-2 py-4"></th></tr></thead>
                             <tbody><tr className="bg-slate-50/50"><td className="px-2 py-4"><div className="w-5 h-5 bg-indigo-50 text-indigo-400 rounded-full flex items-center justify-center border border-indigo-100"><Plus size={12}/></div></td><td className="px-2 py-4"><input type="text" value={newSupplierForm.name} onChange={e => setNewSupplierForm({...newSupplierForm, name: e.target.value})} className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs outline-none focus:border-blue-500" placeholder="Factory Name" /></td><td className="px-2 py-4"><input type="text" value={newSupplierForm.address} onChange={e => setNewSupplierForm({...newSupplierForm, address: e.target.value})} className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs outline-none focus:border-blue-500" placeholder="Address" /></td><td className="px-2 py-4"><input type="email" value={newSupplierForm.email} onChange={e => setNewSupplierForm({...newSupplierForm, email: e.target.value})} className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs outline-none focus:border-blue-500" placeholder="Email" /></td><td className="px-2 py-4"><input type="text" value={newSupplierForm.phone} onChange={e => setNewSupplierForm({...newSupplierForm, phone: e.target.value})} className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs outline-none focus:border-blue-500" placeholder="Phone" /></td><td className="px-2 py-4"><input type="text" value={newSupplierForm.contact} onChange={e => setNewSupplierForm({...newSupplierForm, contact: e.target.value})} className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs outline-none focus:border-blue-500" placeholder="Contact Person" /></td><td className="px-2 py-4"><input type="text" value={newSupplierForm.services} onChange={e => setNewSupplierForm({...newSupplierForm, services: e.target.value})} className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs outline-none focus:border-blue-500" placeholder="e.g. Cabinet, Door" /></td><td className="px-2 py-4 text-right"><div className="flex items-center gap-2"><button onClick={handleSaveNewSupplier} className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors shadow-sm"><Check size={14}/></button><button onClick={() => setIsAddingSupplier(false)} className="p-2 bg-slate-100 text-slate-400 rounded hover:bg-slate-200 transition-colors"><X size={14}/></button></div></td></tr></tbody>
                          </table>
                       </div>
                    </div>
                  )}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">{MOCK_FACTORIES.slice(0, 2).map((factory) => (<div key={factory.name} className="bg-white rounded-[40px] border border-slate-200 p-10 shadow-sm group hover:shadow-xl transition-all"><div className="flex items-start justify-between mb-10"><div className="flex items-center gap-4"><div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[24px] flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500"><Factory size={32} /></div><div><h4 className="text-xl font-black text-slate-900">{factory.name}</h4><p className="text-xs text-slate-400 font-medium">{factory.address}</p></div></div><div className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{factory.margin} Margin</div></div><div className="grid grid-cols-2 gap-6 pt-10 border-t border-slate-100"><div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Primary Contact</p><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-[10px] font-bold">{factory.contact[0]}</div><p className="text-xs font-black text-slate-900">{factory.contact}</p></div></div><div className="text-right"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Supply Volume</p><p className="text-2xl font-black text-slate-900">{factory.volume}</p></div></div></div>))}</div>
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"><div className="p-6 border-b border-slate-100 flex items-center justify-between"><h4 className="text-lg font-serif text-slate-800">Factories</h4></div><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-slate-100"><th className="px-6 py-4 w-10"></th><th className="px-6 py-4 text-xs font-medium text-slate-500">Name</th><th className="px-6 py-4 text-xs font-medium text-slate-500">Address</th><th className="px-6 py-4 text-xs font-medium text-slate-500">Email</th><th className="px-6 py-4 text-xs font-medium text-slate-500">Phone</th><th className="px-6 py-4 text-xs font-medium text-slate-500">Contact</th><th className="px-6 py-4 text-xs font-medium text-slate-500">Services</th><th className="px-6 py-4"></th></tr></thead><tbody className="divide-y divide-slate-50">{MOCK_FACTORIES.map((factory) => (<tr key={factory.name} className="hover:bg-slate-50/50 transition-colors"><td className="px-6 py-4 text-center"><div className="w-5 h-5 bg-indigo-50 text-indigo-400 rounded-full flex items-center justify-center border border-indigo-100 cursor-pointer"><Plus size={12}/></div></td><td className="px-6 py-4 text-sm font-medium text-slate-700">{factory.name}</td><td className="px-6 py-4 text-sm text-slate-500">{factory.address}</td><td className="px-6 py-4 text-sm text-slate-500">{factory.email}</td><td className="px-6 py-4 text-sm text-slate-500">{factory.phone}</td><td className="px-6 py-4 text-sm text-slate-500">{factory.contact}</td><td className="px-6 py-4 text-sm text-slate-500">{factory.services}</td><td className="px-6 py-4 text-right"><button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Edit3 size={16}/></button></td></tr>))}</tbody></table></div></div>
               </div>
               <div className="flex items-center justify-between"><div><h3 className="text-lg font-black text-slate-900 uppercase tracking-widest">Real-time Factory Stock</h3><p className="text-sm text-slate-400">Tracking 1,410 product units across 45 categories.</p></div><div className="flex gap-4"><button className="bg-slate-100 text-slate-600 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2"><Truck size={18} /> Supply Intake</button></div></div>
               <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm"><div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50"><div className="relative w-96"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input type="text" placeholder="Search by SKU or Name..." className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none" /></div><select value={activeWorkflowStep} onChange={(e) => setActiveWorkflowStep(e.target.value)} className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none"><option value="combo">Combos</option><option value="cabinet-style">Cabinet Styles</option><option value="hardware">Hardware</option></select></div><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="bg-slate-50/50"><th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product SKU</th><th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sub-Category</th><th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Stock</th><th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th><th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Update</th></tr></thead><tbody className="divide-y divide-slate-50">{catalog.map(p => (<tr key={p.id} className="hover:bg-slate-50/30 transition-colors"><td className="px-10 py-5"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center shrink-0"><Package size={16} className="text-slate-400" /></div><div><p className="text-xs font-black text-slate-900">{p.name}</p><p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{p.id}</p></div></div></td><td className="px-10 py-5 text-xs text-slate-500 font-medium">{p.category}</td><td className="px-10 py-5"><span className="text-sm font-black text-slate-900">{p.stockLevel} <span className="text-[10px] font-medium text-slate-400">{p.unit}</span></span></td><td className="px-10 py-5">{p.stockLevel > p.minStock ? (<span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[9px] font-black uppercase flex items-center gap-1.5 w-fit"><CheckCircle2 size={12}/> Healthy</span>) : (<span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-[9px] font-black uppercase flex items-center gap-1.5 w-fit"><AlertTriangle size={12}/> Low Stock</span>)}</td><td className="px-10 py-5 text-right"><button className="text-blue-600 hover:underline text-[10px] font-black uppercase">Edit</button></td></tr>))}</tbody></table></div></div>
            </div>
          )}

          {/* ADMIN: ORDERS VIEW (NEW) */}
          {activeView === 'Orders' && (
            <div className="space-y-10 animate-in fade-in duration-500">
               {/* 1. Global Metrics */}
               <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[{l:'Total Revenue', v:'$112,450', i:DollarSign, c:'blue'}, {l:'Gross Orders', v:'420', i:ClipboardList, c:'indigo'}, {l:'Active Production', v:'24', i:Hammer, c:'amber'}, {l:'Growth Rate', v:'+12.5%', i:TrendingUp, c:'emerald'}].map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                       <div className={`w-12 h-12 bg-${stat.c}-50 text-${stat.c}-600 rounded-2xl flex items-center justify-center mb-4`}><stat.i size={24} /></div>
                       <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.v}</p>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.l}</p>
                    </div>
                  ))}
               </div>

               {/* 2. Summary Blocks by Category */}
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* By Store Summary */}
                  <div className="bg-white rounded-[40px] border border-slate-200 p-8 shadow-sm">
                     <div className="flex items-center gap-3 mb-8">
                        <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center"><Building2 size={16}/></div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">Orders by Store</h4>
                     </div>
                     <div className="space-y-6">
                        {stores.map(s => (
                          <div key={s.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-[10px] font-black">{s.name[0]}</div>
                                <div>
                                   <p className="text-xs font-black text-slate-900">{s.name}</p>
                                   <p className="text-[9px] text-slate-400 font-bold uppercase">12 Orders this month</p>
                                </div>
                             </div>
                             <div className="text-right">
                                <p className="text-sm font-black text-blue-600">$24,800</p>
                                <ArrowUpRight size={14} className="text-emerald-500 inline ml-1" />
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>

                  {/* By Sales Rep Summary */}
                  <div className="bg-white rounded-[40px] border border-slate-200 p-8 shadow-sm">
                     <div className="flex items-center gap-3 mb-8">
                        <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center"><UserCheck size={16}/></div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">Top Sales Performance</h4>
                     </div>
                     <div className="space-y-6">
                        {users.filter(u => u.role === 'Sales' || u.role === 'Manager').slice(0, 3).map(u => (
                          <div key={u.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-[10px] font-black">{u.name[0]}</div>
                                <div>
                                   <p className="text-xs font-black text-slate-900">{u.name}</p>
                                   <p className="text-[9px] text-slate-400 font-bold uppercase">Store: Toronto</p>
                                </div>
                             </div>
                             <p className="text-sm font-black text-indigo-600">$18,420</p>
                          </div>
                        ))}
                     </div>
                  </div>

                  {/* By Time Period Summary */}
                  <div className="bg-white rounded-[40px] border border-slate-200 p-8 shadow-sm">
                     <div className="flex items-center gap-3 mb-8">
                        <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center"><Calendar size={16}/></div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">Revenue by Period</h4>
                     </div>
                     <div className="space-y-4">
                        {[
                          { p: 'This Week', v: '$14,200', pct: '85%' },
                          { p: 'Last Week', v: '$28,450', pct: '100%' },
                          { p: 'This Month', v: '$112,450', pct: '60%' }
                        ].map((period, i) => (
                          <div key={i} className="space-y-2">
                             <div className="flex justify-between text-[10px] font-black uppercase">
                                <span className="text-slate-400">{period.p}</span>
                                <span className="text-slate-900">{period.v}</span>
                             </div>
                             <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500 rounded-full" style={{ width: period.pct }}></div>
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>

               {/* 3. Detailed Interactive Table */}
               <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest">Master Order Ledger</h3>
                        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">All Channels</span>
                     </div>
                     <div className="relative w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input type="text" placeholder="Filter by Order#, Client..." className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-100 transition-all" />
                     </div>
                  </div>
                  <div className="overflow-x-auto">
                     <table className="w-full text-left">
                        <thead>
                           <tr className="bg-slate-50/50">
                              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID / Date</th>
                              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Channel / Sales</th>
                              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer Details</th>
                              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Value / Config</th>
                              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Logistics Status</th>
                              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                           {MOCK_STORE_ORDERS.map(order => (
                             <tr key={order.orderNo} className="hover:bg-slate-50/30 transition-colors group">
                                <td className="px-8 py-6">
                                   <p className="text-xs font-black text-slate-900">#{order.orderNo}</p>
                                   <p className="text-[10px] text-slate-400 font-medium">{order.date.split(' ')[0]}</p>
                                </td>
                                <td className="px-8 py-6">
                                   <p className="text-xs font-black text-slate-900">{order.storeId === 'S1' ? 'Toronto' : 'North York'}</p>
                                   <p className="text-[10px] text-slate-400 font-medium">{order.sales || 'Unassigned'}</p>
                                </td>
                                <td className="px-8 py-6">
                                   <p className="text-xs font-black text-slate-900">{order.client}</p>
                                   <p className="text-[10px] text-slate-400 font-medium truncate max-w-[150px]">{order.address}</p>
                                </td>
                                <td className="px-8 py-6">
                                   <p className="text-sm font-black text-blue-600">${order.total}</p>
                                   <p className="text-[9px] text-slate-400 font-black uppercase tracking-tighter">{order.cabinet}</p>
                                </td>
                                <td className="px-8 py-6">
                                   <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tight ${order.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                                      {order.status}
                                   </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                   <button 
                                      onClick={() => setSelectedOrderReview(order)}
                                      className="bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all inline-flex items-center gap-2"
                                   >
                                      <Eye size={14}/> Review Details
                                   </button>
                                </td>
                             </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>

               {/* 4. Order Detail Review Modal */}
               {selectedOrderReview && (
                 <div className="fixed inset-0 z-[100] flex items-center justify-center p-10 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-5xl rounded-[48px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                       <div className="px-10 py-8 bg-blue-600 text-white flex items-center justify-between shrink-0">
                          <div className="flex items-center gap-4">
                             <div className="w-14 h-14 bg-white/20 rounded-3xl flex items-center justify-center"><ClipboardList size={28}/></div>
                             <div>
                                <h3 className="text-2xl font-black tracking-tight">Order #{selectedOrderReview.orderNo} Review</h3>
                                <p className="text-blue-100 text-sm font-medium">Submitted on {selectedOrderReview.date}</p>
                             </div>
                          </div>
                          <button onClick={() => setSelectedOrderReview(null)} className="p-3 hover:bg-white/10 rounded-2xl transition-colors"><X size={24}/></button>
                       </div>
                       <div className="flex-1 overflow-y-auto p-12">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                             <div className="space-y-8">
                                <div><h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Customer Info</h4><p className="text-xl font-black text-slate-900">{selectedOrderReview.client}</p><p className="text-sm text-slate-500 mt-2">{selectedOrderReview.address}</p><p className="text-sm text-slate-500">{selectedOrderReview.phone}</p></div>
                                <div><h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Sales Context</h4><p className="text-sm font-bold text-slate-700">Managed by: {selectedOrderReview.sales}</p><p className="text-sm font-bold text-slate-700">Store: {selectedOrderReview.storeId === 'S1' ? 'Toronto Flagship' : 'North York Studio'}</p></div>
                             </div>
                             <div className="md:col-span-2 space-y-8">
                                <div className="bg-slate-50 rounded-[32px] p-8 border border-slate-100">
                                   <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Order Configuration</h4>
                                   <div className="grid grid-cols-2 gap-8">
                                      <div><p className="text-[10px] font-black text-slate-400 uppercase">Primary Material</p><p className="text-lg font-black text-slate-900">{selectedOrderReview.cabinet}</p></div>
                                      <div><p className="text-[10px] font-black text-slate-400 uppercase">Total Quote Value</p><p className="text-2xl font-black text-blue-600">${selectedOrderReview.total}</p></div>
                                   </div>
                                </div>
                                <div className="flex items-center gap-4">
                                   <button className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200">Approve to Production</button>
                                   <button className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest">Return to Sales</button>
                                   <button className="bg-red-50 text-red-600 p-4 rounded-2xl"><Trash2 size={20}/></button>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
               )}
            </div>
          )}

          {activeView === 'Quote' && (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-10 animate-in slide-in-from-bottom-6 duration-500">
               <div className="xl:col-span-3 space-y-10">
                  <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
                     <div className="bg-slate-50/80 px-8 py-5 border-b border-slate-200"><h4 className="text-sm font-black text-slate-700 uppercase tracking-widest">Client Information</h4></div>
                     <div className="p-10 space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                           <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500">Store Name</label><input type="text" value={clientInfo.storeName} onChange={e => setClientInfo({...clientInfo, storeName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all" placeholder="Store Name" /></div>
                           <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500">Sales Name</label><input type="text" value={clientInfo.salesName} onChange={e => setClientInfo({...clientInfo, salesName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all" placeholder="Sales Name" /></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                           <div className="space-y-6">
                              <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500">Referral</label><input type="text" value={clientInfo.referral} onChange={e => setClientInfo({...clientInfo, referral: e.target.value})} className="w-full bg-white border border-slate-200 rounded-md px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 outline-none" placeholder="Referral" /></div>
                              <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500">First Name</label><input type="text" value={clientInfo.firstName} onChange={e => setClientInfo({...clientInfo, firstName: e.target.value})} className="w-full bg-white border border-slate-200 rounded-md px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 outline-none" placeholder="First Name" /></div>
                              <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500">Last Name</label><input type="text" value={clientInfo.lastName} onChange={e => setClientInfo({...clientInfo, lastName: e.target.value})} className="w-full bg-white border border-slate-200 rounded-md px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 outline-none" placeholder="Last Name" /></div>
                              <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500">Home Phone</label><input type="text" value={clientInfo.homePhone} onChange={e => setClientInfo({...clientInfo, homePhone: e.target.value})} className="w-full bg-white border border-slate-200 rounded-md px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 outline-none" placeholder="Home Phone" /></div>
                              <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500">Cell Phone</label><input type="text" value={clientInfo.cellPhone} onChange={e => setClientInfo({...clientInfo, cellPhone: e.target.value})} className="w-full bg-white border border-slate-200 rounded-md px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 outline-none" placeholder="Cell Phone" /></div>
                           </div>
                           <div className="space-y-6">
                              <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500">Address</label><input type="text" value={clientInfo.address} onChange={e => setClientInfo({...clientInfo, address: e.target.value})} className="w-full bg-white border border-slate-200 rounded-md px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 outline-none" placeholder="Address" /></div>
                              <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500">Province</label><input type="text" value={clientInfo.province} onChange={e => setClientInfo({...clientInfo, province: e.target.value})} className="w-full bg-white border border-slate-200 rounded-md px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 outline-none font-bold text-slate-600" placeholder="ON" /></div>
                              <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500">City</label><input type="text" value={clientInfo.city} onChange={e => setClientInfo({...clientInfo, city: e.target.value})} className="w-full bg-white border border-slate-200 rounded-md px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 outline-none" placeholder="City" /></div>
                              <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500">Postal Code</label><input type="text" value={clientInfo.postalCode} onChange={e => setClientInfo({...clientInfo, postalCode: e.target.value})} className="w-full bg-white border border-slate-200 rounded-md px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 outline-none" placeholder="Postal Code" /></div>
                              <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500">Email</label><input type="email" value={clientInfo.email} onChange={e => setClientInfo({...clientInfo, email: e.target.value})} className="w-full bg-white border border-slate-200 rounded-md px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 outline-none" placeholder="Email" /></div>
                           </div>
                        </div>
                        <div className="flex items-center gap-6 pt-4"><span className="text-sm font-bold text-slate-700">Shipping Address</span><label className="flex items-center gap-2 cursor-pointer group"><input type="radio" name="shippingAddressType" className="w-4 h-4 text-blue-600" checked={clientInfo.shippingAddressType === 'same'} onChange={() => setClientInfo({...clientInfo, shippingAddressType: 'same'})} /><span className="text-sm text-slate-600 group-hover:text-blue-600 transition-colors">Same as Client</span></label><label className="flex items-center gap-2 cursor-pointer group"><input type="radio" name="shippingAddressType" className="w-4 h-4 text-blue-600" checked={clientInfo.shippingAddressType === 'different'} onChange={() => setClientInfo({...clientInfo, shippingAddressType: 'different'})} /><span className="text-sm text-slate-600 group-hover:text-blue-600 transition-colors">Different from Client</span></label></div>
                        <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500">Note/Preferred installation Date</label><input type="text" value={clientInfo.note} onChange={e => setClientInfo({...clientInfo, note: e.target.value})} className="w-full bg-white border border-slate-200 rounded-md px-4 py-3 text-sm outline-none" placeholder="Note/Preferred installation Date" /></div>
                        <div className="pt-6"><button onClick={scrollToWorkspace} className="bg-slate-100 border border-slate-200 text-slate-700 px-8 py-2.5 rounded-md text-sm font-medium hover:bg-slate-200 transition-all shadow-sm active:scale-95 flex items-center gap-2">Continue <ArrowDown size={14} /></button></div>
                     </div>
                  </div>
                  <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm overflow-x-auto">
                     <div className="flex items-center gap-4 mb-10"><div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><Boxes size={20}/></div><div><h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Quote Workflow Guide</h4><p className="text-[10px] text-slate-400 font-bold">Follow your selected path to complete the order configuration</p></div></div>
                     <div className="min-w-[800px] relative pb-10 px-4">
                        <div className="grid grid-cols-10 gap-2 items-start relative z-10">
                           {WORKFLOW_STEPS.map((step, idx) => (
                             <button key={step.id} onClick={() => setActiveWorkflowStep(step.id)} className={`flex flex-col items-center group transition-all ${activeWorkflowStep === step.id ? 'scale-110 opacity-100' : 'opacity-60 hover:opacity-100'}`}>
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all ${activeWorkflowStep === step.id ? 'bg-blue-600 text-white ring-4 ring-blue-50' : 'bg-slate-100 text-slate-400'}`}>{idx === 0 ? <Layers3 size={20}/> : idx === 1 ? <Layout size={20}/> : idx === 2 ? <Grid size={20}/> : idx === 3 ? <DoorOpen size={20}/> : idx === 4 ? <Palette size={20}/> : idx === 5 ? <Maximize2 size={20}/> : idx === 6 ? <Puzzle size={20}/> : idx === 7 ? <Wrench size={20}/> : idx === 8 ? <Construction size={20}/> : <Boxes size={20}/>}</div>
                                <p className={`text-[8px] font-black mt-2 uppercase text-center leading-tight ${activeWorkflowStep === step.id ? 'text-blue-600' : 'text-slate-400'}`}>{step.label.split(' ').join('\n')}</p>
                             </button>
                           ))}
                        </div>
                        <div className="absolute top-10 left-10 right-10 h-0.5 bg-slate-100 -z-0"></div>
                     </div>
                  </div>
                  <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm space-y-8 animate-in slide-in-from-top-4 duration-500">
                     <div className="flex items-center gap-4"><div className="bg-[#2a5a8a] text-white px-5 py-2 rounded-lg flex items-center gap-2 shadow-md"><Ruler size={18} /><span className="text-sm font-bold">Height & Depth</span></div></div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6 max-w-4xl">
                        {[{ label: 'Upper Cabinet height', key: 'upperHeight' }, { label: 'Lower Cabinet height', key: 'lowerHeight' }, { label: 'Upper Cabinet depth', key: 'upperDepth' }, { label: 'Lower Cabinet depth', key: 'lowerDepth' }, { label: 'Pantry Cabinet height', key: 'pantryHeight' }, { label: 'Pantry Cabinet depth', key: 'pantryDepth' }, { label: 'Island Cabinet height', key: 'islandHeight' }, { label: 'Island Cabinet depth', key: 'islandDepth' }].map((m) => (
                           <div key={m.key} className="flex items-center gap-4"><span className="text-sm font-medium text-slate-500 min-w-[160px]">{m.label}:</span><div className="flex items-center gap-2"><input type="text" value={measurements[m.key as keyof typeof measurements]} onChange={(e) => setMeasurements({...measurements, [m.key]: e.target.value})} className="w-32 border border-slate-200 rounded px-3 py-1.5 text-sm text-slate-600 bg-white focus:border-[#2a5a8a] outline-none transition-colors" /><span className="text-slate-400 font-bold">"</span></div></div>
                        ))}
                     </div>
                  </div>
                  <div ref={workspaceRef} className="bg-blue-600 rounded-[32px] p-10 text-white shadow-xl shadow-blue-100 scroll-mt-24 transition-all"><div className="flex flex-col md:flex-row items-center justify-between gap-8"><div className="flex items-center gap-4"><div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center"><Construction size={28}/></div><div><h3 className="text-lg font-black uppercase tracking-widest">Configuration Workspace</h3><p className="text-xs text-blue-100">Step-by-step selection for your custom order</p></div></div><div className="relative w-full md:w-96"><ChevronRightCircle className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-400" size={18} /><select className="w-full bg-white text-slate-900 border-none rounded-2xl pl-12 pr-10 py-4 text-xs font-black appearance-none outline-none focus:ring-4 focus:ring-blue-400 shadow-xl cursor-pointer" value={activeWorkflowStep} onChange={e => setActiveWorkflowStep(e.target.value)}>{WORKFLOW_STEPS.map(step => (<option key={step.id} value={step.id}>{step.label}</option>))}</select><ChevronDown size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" /></div></div></div>
                  <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                     {activeWorkflowStep === 'combo' ? (
                        <div className="space-y-8 bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
                           <div className="flex flex-wrap gap-px bg-slate-100 border border-slate-100 rounded-xl overflow-hidden mb-8">{['Color Partical', 'Grace MDF', 'Grace Solid', 'High Gloss', 'Painting-MDF', 'Painting-Solid', 'Solid Stain', 'Thermofoil', 'Vanity'].map(tab => (<button key={tab} onClick={() => setActiveComboSubTab(tab)} className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${activeComboSubTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'bg-transparent text-slate-500 hover:bg-slate-50'}`}>{tab}</button>))}</div>
                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{MOCK_STORE_ORDERS.slice(0,3).map((combo, i) => (<div key={i} className="bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-2xl transition-all group flex flex-col h-full"><div className="flex h-56 border-b border-slate-100"><div className="w-[60%] bg-slate-50 relative flex items-center justify-center overflow-hidden border-r border-slate-100"><ShoppingBag className="text-slate-200 group-hover:scale-110 transition-transform duration-500" size={64}/><div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[8px] font-black text-slate-400 uppercase tracking-widest">Main View</div></div><div className="w-[40%] flex flex-col divide-y divide-slate-100 bg-white"><div className="flex-1 flex flex-col items-center justify-center p-2 text-center"><p className="text-[6px] font-black text-slate-300 uppercase mb-1">Door Color</p><div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-200"></div></div><div className="flex-1 flex flex-col items-center justify-center p-2 text-center"><p className="text-[6px] font-black text-slate-300 uppercase mb-1">Countertop</p><div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-200"></div></div><div className="flex-1 flex flex-col items-center justify-center p-2 text-center"><p className="text-[6px] font-black text-slate-300 uppercase mb-1">Handle/Sink</p><Wrench size={10} className="text-slate-300"/></div></div></div><div className="p-6 text-center bg-white flex-1 flex flex-col justify-between"><h5 className="text-lg font-bold text-slate-700 font-serif mb-4">MOCK COMBO {i+1}</h5><button className="w-full bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"><Plus size={14} /> Select Selection</button></div></div>))}</div>
                        </div>
                     ) : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{catalog.map(p => (<div key={p.id} className="bg-white rounded-[32px] p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all group"><div className="aspect-square bg-slate-50 rounded-[24px] mb-4 overflow-hidden relative border border-slate-100"><Package size={48} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-200" /><div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-sm"><p className="text-[10px] font-black text-blue-600">${p.price} <span className="text-slate-400">/{p.unit}</span></p></div></div><h5 className="text-xs font-black text-slate-900 mb-1">{p.name}</h5><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">{p.category}</p><button onClick={() => addLineItem(p)} className="w-full bg-slate-900 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-2"><Plus size={14} /> Add to Quote</button></div>))}</div>)}
                  </div>
               </div>
               <div className="space-y-6"><div className="sticky top-28 bg-white rounded-[40px] p-10 border border-slate-200 shadow-2xl shadow-blue-900/5"><div className="flex items-center justify-between mb-10"><h3 className="text-xl font-black text-slate-900 tracking-tight">Current Quote</h3><ShoppingCart size={24} className="text-blue-600" /></div><div className="space-y-6 max-h-[400px] overflow-y-auto scrollbar-hide pr-2 mb-10 border-b border-slate-100 pb-10">{lineItems.length > 0 ? lineItems.map((item, idx) => (<div key={idx} className="flex justify-between items-start"><div className="flex-1 pr-4"><p className="text-[11px] font-black text-slate-900 leading-tight">{item.product.name}</p><p className="text-[10px] text-slate-400 mt-1">{item.quantity} x {item.product.unit}</p></div><p className="text-xs font-black text-blue-600">${(item.product.price * item.quantity).toFixed(2)}</p></div>)) : <div className="text-center py-20 opacity-30 italic">Quote is empty</div>}</div><div className="space-y-6"><div className="flex justify-between items-center"><span className="text-xs font-black text-slate-400 uppercase tracking-widest">Grand Total</span><span className="text-3xl font-black text-slate-900">${lineItems.reduce((a, b) => a + (b.product.price * b.quantity), 0).toFixed(2)}</span></div><button onClick={() => setActiveView('Stores')} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-blue-200 hover:scale-105 active:scale-95 transition-all">Submit to Manager</button><div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 flex gap-3"><Sparkles size={16} className="text-indigo-600 shrink-0 mt-0.5" /><p className="text-[10px] text-indigo-900 font-medium leading-relaxed italic">"Adding soft-close hardware to this quote will increase durability for the client."</p></div></div></div></div>
            </div>
          )}

          {activeView === 'Catalog' && (
            <div className="max-w-2xl mx-auto py-32 text-center animate-in fade-in duration-500">
               <div className="w-20 h-20 bg-slate-50 rounded-[24px] border border-slate-100 flex items-center justify-center mx-auto mb-6 text-slate-300"><Database size={32} /></div>
               <h4 className="text-xl font-black text-slate-900">Module Synchronizing</h4>
               <p className="text-slate-400 text-sm mt-2">The legacy WooCommerce/ERP database is being mapped to the new architecture. 1,410 products loaded.</p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default App;
