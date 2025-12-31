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
  Eye,
  FileText,
  ListTodo
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
import { 
  INITIAL_STORES, 
  INITIAL_USERS, 
  MOCK_PRODUCTS, 
  MOCK_FACTORIES, 
  MOCK_STORE_ORDERS, 
  WORKFLOW_STEPS, 
  ASSEMBLY_TASKS, 
  PERMISSION_COLUMNS, 
  INITIAL_ROLE_PERMISSIONS 
} from './script.js';

interface TaskStatus {
  checked: boolean;
  initials: string;
}

const App: React.FC = () => {
  // Global State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activeView, setActiveView] = useState('Welcome');
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS as UserProfile[]);
  const [stores, setStores] = useState<StoreInfo[]>(INITIAL_STORES);
  const [catalog] = useState<Product[]>(MOCK_PRODUCTS);
  
  // Admin: Access States
  const [rolePermissions, setRolePermissions] = useState<any[]>(INITIAL_ROLE_PERMISSIONS as any[]);
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [roleFormName, setRoleFormName] = useState('');
  const [roleFormPermissions, setRoleFormPermissions] = useState<Record<string, boolean>>(
    PERMISSION_COLUMNS.reduce((acc, col) => ({ ...acc, [col]: false }), {})
  );

  // Task Manager State
  const [itemTasks, setItemTasks] = useState<Record<string, TaskStatus>>({});
  const [assemblyTasksState, setAssemblyTasksState] = useState<Record<string, TaskStatus>>({});
  const initialsRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // UI States
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState('combo');
  const [activeComboSubTab, setActiveComboSubTab] = useState('Color Partical');
  const [lineItems, setLineItems] = useState<QuoteLineItem[]>([]);
  const [expandedStoreId, setExpandedStoreId] = useState<string | null>('S1'); 
  const [isAddingStore, setIsAddingStore] = useState(false);
  const [isAddingSupplier, setIsAddingSupplier] = useState(false);
  const [selectedOrderReview, setSelectedOrderReview] = useState<any>(null);
  const [lastSubmittedQuote, setLastSubmittedQuote] = useState<any>(null);

  const [newStoreForm, setNewStoreForm] = useState({ name: '', address: '', email: '', phone: '', managerName: '', storeType: '', contact: '', margin: '', gst: '' });
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
    const newStore: StoreInfo = { 
      id: `S${stores.length + 1}`, 
      name: newStoreForm.name, 
      address: newStoreForm.address, 
      email: newStoreForm.email, 
      phone: newStoreForm.phone, 
      managerName: newStoreForm.managerName,
      storeType: newStoreForm.storeType,
      isActive: true, 
      commissionRate: parseInt(newStoreForm.margin) || 0 
    };
    setStores([...stores, newStore]);
    setIsAddingStore(false);
    setNewStoreForm({ name: '', address: '', email: '', phone: '', managerName: '', storeType: '', contact: '', margin: '', gst: '' });
  };

  const handleSaveNewSupplier = () => { 
    setIsAddingSupplier(false); 
    setNewSupplierForm({ name: '', address: '', email: '', phone: '', contact: '', services: '' }); 
  };

  const handleSubmitQuote = () => {
    if (lineItems.length === 0) {
      alert("Quote is empty.");
      return;
    }
    const orderNo = Math.floor(Math.random() * 900) + 100;
    const now = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    const quote = {
      orderNo: orderNo.toString(),
      date: now,
      client: `${clientInfo.firstName} ${clientInfo.lastName}`,
      phone: clientInfo.cellPhone || clientInfo.homePhone,
      address: clientInfo.address,
      items: [...lineItems],
      total: lineItems.reduce((a, b) => a + (b.product.price * b.quantity), 0).toFixed(2),
      deliveryA: '2026-01-10',
      deliveryB: '2026-02-03',
      secondaryDate: 'October 7, 2025'
    };
    setLastSubmittedQuote(quote);
    setActiveView('QuoteDetail');
    setLineItems([]);
  };

  // Role Management Logic
  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleFormName.trim()) return;

    if (editingRoleId) {
      setRolePermissions(rolePermissions.map(rp => rp.id === editingRoleId ? {
        ...rp,
        name: roleFormName,
        permissions: roleFormPermissions
      } : rp));
      setEditingRoleId(null);
    } else {
      const newRole = {
        id: Date.now().toString(),
        name: roleFormName,
        permissions: roleFormPermissions
      };
      setRolePermissions([...rolePermissions, newRole]);
    }

    // Reset Form
    setIsAddingRole(false);
    setRoleFormName('');
    setRoleFormPermissions(PERMISSION_COLUMNS.reduce((acc, col) => ({ ...acc, [col]: false }), {}));
  };

  const startEditRole = (role: any) => {
    setEditingRoleId(role.id);
    setRoleFormName(role.name);
    setRoleFormPermissions(role.permissions);
    setIsAddingRole(true);
  };

  const deleteRole = (roleId: string) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      setRolePermissions(rolePermissions.filter(rp => rp.id !== roleId));
    }
  };

  const togglePermissionInMatrix = (roleId: string, perm: string) => {
    setRolePermissions(rolePermissions.map(rp => 
      rp.id === roleId ? { ...rp, permissions: { ...rp.permissions, [perm]: !rp.permissions[perm] } } : rp
    ));
  };

  const togglePermissionInForm = (perm: string) => {
    setRoleFormPermissions(prev => ({ ...prev, [perm]: !prev[perm] }));
  };

  // Task Manager Handlers
  const toggleItemTask = (id: string) => {
    setItemTasks(prev => {
      const newState = { ...prev, [id]: { checked: !prev[id]?.checked, initials: prev[id]?.initials || '' } };
      if (newState[id].checked) {
        setTimeout(() => initialsRefs.current[`item-${id}`]?.focus(), 0);
      }
      return newState;
    });
  };

  const updateItemInitials = (id: string, initials: string) => {
    setItemTasks(prev => ({ ...prev, [id]: { ...prev[id], initials: initials.toUpperCase() } }));
  };

  const toggleAssemblyTask = (id: string) => {
    setAssemblyTasksState(prev => {
      const newState = { ...prev, [id]: { checked: !prev[id]?.checked, initials: prev[id]?.initials || '' } };
      if (newState[id].checked) {
        setTimeout(() => initialsRefs.current[`assembly-${id}`]?.focus(), 0);
      }
      return newState;
    });
  };

  const updateAssemblyInitials = (id: string, initials: string) => {
    setAssemblyTasksState(prev => ({ ...prev, [id]: { ...prev[id], initials: initials.toUpperCase() } }));
  };

  // Progress Calculation
  const progressData = useMemo(() => {
    const totalItemTasks = (lastSubmittedQuote?.items?.length || 5); // 5 is fallback mock
    const totalAssemblyTasks = ASSEMBLY_TASKS.length;
    const total = totalItemTasks + totalAssemblyTasks;
    
    let completed = 0;
    // Fix: Cast Object.values to TaskStatus array to resolve unknown property errors on lines 295 and 296
    (Object.values(itemTasks) as TaskStatus[]).forEach(t => { if (t.checked && t.initials.length > 0) completed++; });
    (Object.values(assemblyTasksState) as TaskStatus[]).forEach(t => { if (t.checked && t.initials.length > 0) completed++; });

    return { percentage: Math.round((completed / total) * 100), completed, total };
  }, [itemTasks, assemblyTasksState, lastSubmittedQuote]);

  const navItems = [
    { id: 'Welcome', label: 'Dashboard', icon: Sparkles, roles: ['SuperAdmin', 'Manager', 'Sales', 'FactoryWorker', 'Supplier'] },
    { id: 'Quote', label: 'Marketing: Quotes', icon: FilePlus, roles: ['SuperAdmin', 'Manager', 'Sales'] },
    { id: 'Stores', label: 'Marketing: Stores', icon: Building2, roles: ['SuperAdmin', 'Manager'] },
    { id: 'Inventory', label: 'Factory: Inventory', icon: Warehouse, roles: ['SuperAdmin', 'FactoryWorker', 'Supplier'] },
    { id: 'TaskManager', label: 'Task Manager', icon: ListTodo, roles: ['SuperAdmin', 'FactoryWorker'] },
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
            <div className="text-right"><p className="text-sm font-black text-slate-900">{currentUser?.name}</p><span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest">{currentUser?.role}</span></div>
            <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-black text-sm">{currentUser?.name?.[0]}</div>
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
            </div>
          )}

          {activeView === 'Users' && (
            <div className="animate-in fade-in duration-500 space-y-8 max-w-[100%]">
               <div className="flex items-center justify-between">
                  <div>
                     <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest">Access Governance</h3>
                     <p className="text-xs text-slate-400 mt-1">Configure platform roles and verify personnel access.</p>
                  </div>
                  <button onClick={() => { setIsAddingRole(true); setEditingRoleId(null); }} className="bg-blue-600 text-white px-8 py-3 rounded-full font-black text-[11px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blue-200 hover:scale-105 transition-all">
                     <PlusCircle size={18} /> Add New Role
                  </button>
               </div>

               {/* Role Configuration Form (Expandable) */}
               {isAddingRole && (
                 <div className="bg-white rounded-[32px] border border-slate-200 p-10 shadow-xl animate-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center justify-between mb-8">
                       <h4 className="text-xl font-black text-slate-900 tracking-tight">{editingRoleId ? 'Edit Role Configuration' : 'Create New Platform Role'}</h4>
                       <button onClick={() => setIsAddingRole(false)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all"><X size={20} /></button>
                    </div>
                    <form onSubmit={handleSaveRole} className="space-y-8">
                       <div className="space-y-1.5 max-w-md">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Role Identifier</label>
                          <input 
                             type="text" 
                             value={roleFormName} 
                             onChange={e => setRoleFormName(e.target.value)} 
                             required 
                             placeholder="e.g. Regional Manager" 
                             className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                          />
                       </div>
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Granular Permissions Matrix</label>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                             {PERMISSION_COLUMNS.map(perm => (
                               <div 
                                 key={perm} 
                                 onClick={() => togglePermissionInForm(perm)}
                                 className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${roleFormPermissions[perm] ? 'bg-blue-50 border-blue-200' : 'bg-slate-50/50 border-slate-100 grayscale opacity-60'}`}
                               >
                                  <span className={`text-[11px] font-black ${roleFormPermissions[perm] ? 'text-blue-600' : 'text-slate-400'}`}>{perm}</span>
                                  <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${roleFormPermissions[perm] ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-transparent'}`}>
                                     <Check size={14} />
                                  </div>
                               </div>
                             ))}
                          </div>
                       </div>
                       <div className="flex justify-end gap-3 pt-4">
                          <button type="button" onClick={() => setIsAddingRole(false)} className="px-8 py-3 rounded-xl text-slate-500 font-black text-[11px] uppercase tracking-widest">Discard Changes</button>
                          <button type="submit" className="bg-slate-900 text-white px-10 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg hover:scale-105 transition-all">Save Role Configuration</button>
                       </div>
                    </form>
                 </div>
               )}

               {/* Roles Matrix Table */}
               <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                  <div className="p-8 border-b border-slate-100">
                     <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Permissions Matrix Table (Grid View)</h3>
                  </div>
                  <div className="overflow-x-auto scrollbar-hide">
                     <table className="w-full text-left border-collapse min-w-[1600px]">
                        <thead>
                           <tr className="bg-slate-50/50 border-b border-slate-100">
                              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100 text-center w-12 sticky left-0 bg-slate-50 z-20">Del</th>
                              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100 sticky left-12 bg-slate-50 z-20 w-48">Role Name</th>
                              {PERMISSION_COLUMNS.map(col => (
                                <th key={col} className="px-4 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center border-r border-slate-100">
                                   {col}
                                </th>
                              ))}
                              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Edit</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                           {rolePermissions.map(role => (
                             <tr key={role.id} className="hover:bg-slate-50/30 transition-colors group">
                                <td className="px-4 py-6 text-center border-r border-slate-100 sticky left-0 bg-white group-hover:bg-slate-50 transition-colors z-10">
                                   <button onClick={() => deleteRole(role.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                                      <Trash2 size={16} />
                                   </button>
                                </td>
                                <td className="px-8 py-6 border-r border-slate-100 sticky left-12 bg-white group-hover:bg-slate-50 transition-colors z-10">
                                   <p className="text-sm font-black text-slate-900">{role.name}</p>
                                </td>
                                {PERMISSION_COLUMNS.map(col => (
                                  <td key={col} className="px-4 py-6 text-center border-r border-slate-100">
                                     <div className="flex justify-center">
                                        <input 
                                           type="checkbox" 
                                           checked={role.permissions[col] || false}
                                           onChange={() => togglePermissionInMatrix(role.id, col)}
                                           className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        />
                                     </div>
                                  </td>
                                ))}
                                <td className="px-8 py-6 text-right">
                                   <button onClick={() => startEditRole(role)} className="p-2.5 bg-slate-100 text-slate-500 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Edit3 size={14} /></button>
                                </td>
                             </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
          )}

          {activeView === 'TaskManager' && (
            <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
               <div className="flex items-center justify-between border-b border-slate-200 pb-6">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase tracking-widest">Active Order Task Manager</h3>
                    <p className="text-xs text-slate-400 font-medium">Cabinet Manufacturing Workflow Tracking</p>
                  </div>
                  <div className="flex items-center gap-6 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="w-48 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                       <div className="bg-blue-600 h-full transition-all duration-700" style={{ width: `${progressData.percentage}%` }}></div>
                    </div>
                    <p className="text-sm font-black text-slate-900">{progressData.percentage}% Completed</p>
                  </div>
               </div>

               <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                           <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-200">Order Information</th>
                           <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-200">Production Items</th>
                           <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Assembly & Logistics</th>
                        </tr>
                     </thead>
                     <tbody className="align-top divide-x divide-slate-100">
                        <tr>
                           <td className="px-10 py-10 border-r border-slate-100 w-[25%]">
                              <div className="space-y-6">
                                 <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Active Batch</p>
                                    <p className="text-lg font-black text-slate-900">#ORD-{lastSubmittedQuote?.orderNo || '552'}</p>
                                 </div>
                                 <div className="space-y-4 text-[13px] text-slate-700">
                                    <p><span className="text-slate-400 font-medium block text-[10px] uppercase mb-1">Client</span> {lastSubmittedQuote?.client || 'William Henderson'}</p>
                                    <p><span className="text-slate-400 font-medium block text-[10px] uppercase mb-1">Store</span> {lastSubmittedQuote?.storeName || 'Flagship Studio'}</p>
                                    <p><span className="text-slate-400 font-medium block text-[10px] uppercase mb-1">Location</span> {lastSubmittedQuote?.address || '1828 Dencourt Dr, ON'}</p>
                                    <p><span className="text-slate-400 font-medium block text-[10px] uppercase mb-1">Deadline</span> Jan 10, 2026</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-10 py-10 border-r border-slate-100 w-[40%]">
                              <div className="space-y-3">
                                 {(lastSubmittedQuote?.items || [
                                   { product: { id: 'P1', name: 'Upper Cabinet Box (Cutting)' } },
                                   { product: { id: 'P2', name: 'Base Cabinet Frame (Cutting)' } },
                                   { product: { id: 'P3', name: 'Drawer Slides Installation' } },
                                   { product: { id: 'P4', name: 'Door Panel Prep' } },
                                   { product: { id: 'P5', name: 'Hardware Fitting' } }
                                 ]).map((item: any, i: number) => {
                                   const id = item.product.id;
                                   const status = itemTasks[id] || { checked: false, initials: '' };
                                   return (
                                     <div key={id} className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${status.checked && status.initials ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-100 hover:border-blue-100'}`}>
                                        <input 
                                          type="checkbox" 
                                          checked={status.checked}
                                          onChange={() => toggleItemTask(id)}
                                          className="w-5 h-5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        />
                                        <span className={`text-[12px] font-bold flex-1 ${status.checked ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{item.product.name}</span>
                                        {/* Fixed: Use curly braces in ref callback to return void and avoid TypeScript error */}
                                        <input 
                                          ref={el => { initialsRefs.current[`item-${id}`] = el; }}
                                          type="text"
                                          maxLength={3}
                                          value={status.initials}
                                          onChange={(e) => updateItemInitials(id, e.target.value)}
                                          placeholder="Sign"
                                          className="w-12 bg-white border border-slate-200 rounded px-1.5 py-1 text-[10px] font-black uppercase text-center focus:ring-2 focus:ring-blue-100 outline-none"
                                        />
                                     </div>
                                   );
                                 })}
                              </div>
                           </td>
                           <td className="px-10 py-10 w-[35%]">
                              <div className="space-y-3">
                                 {ASSEMBLY_TASKS.map((task, i) => {
                                   const id = `assembly-${i}`;
                                   const status = assemblyTasksState[id] || { checked: false, initials: '' };
                                   return (
                                     <div key={id} className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${status.checked && status.initials ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-100 hover:border-blue-100'}`}>
                                        <input 
                                          type="checkbox" 
                                          checked={status.checked}
                                          onChange={() => toggleAssemblyTask(id)}
                                          className="w-5 h-5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        />
                                        <span className={`text-[12px] font-bold flex-1 ${status.checked ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{task}</span>
                                        {/* Fixed: Use curly braces in ref callback to return void and avoid TypeScript error */}
                                        <input 
                                          ref={el => { initialsRefs.current[`assembly-${id}`] = el; }}
                                          type="text"
                                          maxLength={3}
                                          value={status.initials}
                                          onChange={(e) => updateAssemblyInitials(id, e.target.value)}
                                          placeholder="Sign"
                                          className="w-12 bg-white border border-slate-200 rounded px-1.5 py-1 text-[10px] font-black uppercase text-center focus:ring-2 focus:ring-blue-100 outline-none"
                                        />
                                     </div>
                                   );
                                 })}
                              </div>
                           </td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>
          )}

          {activeView === 'Stores' && (
            <div className="space-y-12 animate-in fade-in duration-500 pb-20">
               <div className="flex items-center justify-between">
                  <div>
                     <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest">Store Network</h3>
                     <p className="text-sm text-slate-400">Marketing reach and physical studio management.</p>
                  </div>
                  <button onClick={() => setIsAddingStore(!isAddingStore)} className="bg-blue-600 text-white px-8 py-3 rounded-full font-black text-[11px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blue-200 hover:scale-105 transition-all">
                     <PlusCircle size={18} /> OPEN NEW STORE
                  </button>
               </div>

               {isAddingStore && (
                 <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm animate-in slide-in-from-top-2 duration-300">
                    <h3 className="text-lg font-serif text-slate-800 mb-6">Store Registration</h3>
                    <div className="grid grid-cols-2 gap-6">
                       <input type="text" value={newStoreForm.name} onChange={e => setNewStoreForm({...newStoreForm, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all" placeholder="Store Name" />
                       <input type="text" value={newStoreForm.address} onChange={e => setNewStoreForm({...newStoreForm, address: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all" placeholder="Address" />
                       <input type="email" value={newStoreForm.email} onChange={e => setNewStoreForm({...newStoreForm, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all" placeholder="Email" />
                       <input type="text" value={newStoreForm.phone} onChange={e => setNewStoreForm({...newStoreForm, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all" placeholder="Phone" />
                       <input type="text" value={newStoreForm.managerName} onChange={e => setNewStoreForm({...newStoreForm, managerName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all" placeholder="Store Manager Name" />
                       <input type="text" value={newStoreForm.storeType} onChange={e => setNewStoreForm({...newStoreForm, storeType: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all" placeholder="Store Type" />
                    </div>
                    <div className="flex justify-end gap-3 mt-8">
                       <button onClick={() => setIsAddingStore(false)} className="px-6 py-2.5 rounded-xl text-slate-500 font-black text-[10px] uppercase">Cancel</button>
                       <button onClick={handleSaveNewStore} className="bg-blue-600 text-white px-8 py-2.5 rounded-xl font-black text-[10px] uppercase shadow-lg shadow-blue-200">Register Store</button>
                    </div>
                 </div>
               )}

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {stores.map(store => (
                    <div key={store.id} onClick={() => setExpandedStoreId(expandedStoreId === store.id ? null : store.id)} className={`bg-white rounded-[40px] border p-10 shadow-sm group hover:shadow-xl transition-all cursor-pointer ${expandedStoreId === store.id ? 'border-blue-600 ring-2 ring-blue-50' : 'border-slate-200'}`}>
                       <div className="flex items-start justify-between mb-10">
                          <div className="flex items-center gap-4">
                             <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center transition-all duration-500 ${expandedStoreId === store.id ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'}`}>
                                <Building2 size={32} />
                             </div>
                             <div>
                                <h4 className="text-xl font-black text-slate-900">{store.name}</h4>
                                <p className="text-xs text-slate-400 font-medium">{store.address}</p>
                             </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                             <div className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{store.commissionRate}% Margin</div>
                             <p className="text-[10px] font-black text-blue-600 flex items-center gap-1">
                                {expandedStoreId === store.id ? 'Hide Orders' : 'View Orders'}{expandedStoreId === store.id ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
                             </p>
                          </div>
                       </div>
                       <div className="grid grid-cols-2 gap-6 pt-10 border-t border-slate-100">
                          <div>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Authorized Sales</p>
                             <div className="flex -space-x-2">
                                {users.filter(u => u.storeId === store.id).map(u => (<div key={u.id} className="w-9 h-9 rounded-xl bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold" title={u.name}>{u.name[0]}</div>))}
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Monthly Volume</p>
                             <p className="text-2xl font-black text-slate-900">$24,800.00</p>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>

               {expandedStoreId && (
                 <div className="animate-in slide-in-from-top-4 duration-500 space-y-6">
                    <div className="flex items-center gap-3"><div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-100"><ClipboardList size={20}/></div><h3 className="text-lg font-black text-slate-900 uppercase tracking-widest">Store Orders Summary</h3></div>
                    <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
                       <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                             <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                   <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100 text-center">Date</th>
                                   <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100 text-center">Order#</th>
                                   <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100 text-center">Client Name</th>
                                   <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100 text-center">Status</th>
                                   <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-slate-100">
                                {MOCK_STORE_ORDERS.filter(o => o.storeId === expandedStoreId).map(order => (
                                  <tr key={order.orderNo} className="hover:bg-slate-50/50 transition-colors">
                                     <td className="px-4 py-6 text-[11px] text-slate-600 border-r border-slate-100 text-center">{order.date.split(' ')[0]}</td>
                                     <td className="px-4 py-6 text-[11px] font-black text-slate-900 border-r border-slate-100 text-center">#{order.orderNo}</td>
                                     <td className="px-4 py-6 text-[11px] font-black text-slate-900 border-r border-slate-100 text-center">{order.client}</td>
                                     <td className="px-4 py-6 border-r border-slate-100 text-center">
                                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${order.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                                           {order.status}
                                        </span>
                                     </td>
                                     <td className="px-4 py-6 text-right">
                                        <button className="text-[10px] font-black text-blue-600 hover:underline uppercase">Details</button>
                                     </td>
                                  </tr>
                                ))}
                             </tbody>
                          </table>
                       </div>
                    </div>
                 </div>
               )}
            </div>
          )}

          {activeView === 'Inventory' && (
            <div className="space-y-12 animate-in fade-in duration-500 pb-20">
               <div className="space-y-6">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100"><Factory size={20}/></div>
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest">My Suppliers</h3>
                     </div>
                     <button onClick={() => setIsAddingSupplier(!isAddingSupplier)} className="bg-blue-600 text-white px-8 py-3 rounded-full font-black text-[11px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blue-200 hover:scale-105 transition-all">
                        <PlusCircle size={18} /> ADD A NEW SUPPLIER
                     </button>
                  </div>

                  {isAddingSupplier && (
                    <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm animate-in slide-in-from-top-2 duration-300">
                       <h3 className="text-lg font-serif text-slate-800 mb-6">Supplier Registration</h3>
                       <div className="grid grid-cols-2 gap-6">
                          <input type="text" value={newSupplierForm.name} onChange={e => setNewSupplierForm({...newSupplierForm, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none" placeholder="Supplier/Factory Name" />
                          <input type="text" value={newSupplierForm.contact} onChange={e => setNewSupplierForm({...newSupplierForm, contact: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none" placeholder="Primary Contact" />
                          <input type="text" value={newSupplierForm.services} onChange={e => setNewSupplierForm({...newSupplierForm, services: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none" placeholder="Services (e.g., Cabinet, Door)" />
                          <input type="text" value={newSupplierForm.phone} onChange={e => setNewSupplierForm({...newSupplierForm, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none" placeholder="Phone" />
                       </div>
                       <div className="flex justify-end gap-3 mt-8">
                          <button onClick={() => setIsAddingSupplier(false)} className="px-6 py-2.5 rounded-xl text-slate-500 font-black text-[10px] uppercase tracking-widest">Cancel</button>
                          <button onClick={handleSaveNewSupplier} className="bg-blue-600 text-white px-8 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-200">Save Supplier</button>
                       </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     {MOCK_FACTORIES.slice(0, 2).map((factory) => (
                       <div key={factory.name} className="bg-white rounded-[40px] border border-slate-200 p-10 shadow-sm group hover:shadow-xl transition-all">
                          <div className="flex items-start justify-between mb-10">
                             <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[24px] flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                                   <Factory size={32} />
                                </div>
                                <div>
                                   <h4 className="text-xl font-black text-slate-900">{factory.name}</h4>
                                   <p className="text-xs text-slate-400 font-medium">{factory.address}</p>
                                </div>
                             </div>
                             <div className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{factory.margin} Margin</div>
                          </div>
                          <div className="grid grid-cols-2 gap-6 pt-10 border-t border-slate-100">
                             <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Primary Contact</p>
                                <div className="flex items-center gap-3">
                                   <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-[10px] font-bold">{factory.contact[0]}</div>
                                   <p className="text-xs font-black text-slate-900">{factory.contact}</p>
                                </div>
                             </div>
                             <div className="text-right">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Supply Volume</p>
                                <p className="text-2xl font-black text-slate-900">{factory.volume || '$0.00'}</p>
                             </div>
                          </div>
                       </div>
                     ))}
                  </div>

                  <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
                     <div className="p-6 border-b border-slate-100 flex items-center justify-between"><h4 className="text-xs font-black uppercase tracking-widest text-slate-900">All Factory Partners</h4></div>
                     <div className="overflow-x-auto">
                        <table className="w-full text-left">
                           <thead>
                              <tr className="border-b border-slate-100 bg-slate-50/50">
                                 <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</th>
                                 <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Services</th>
                                 <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</th>
                                 <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone</th>
                                 <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-50">
                              {MOCK_FACTORIES.map((f) => (
                                <tr key={f.name} className="hover:bg-slate-50/50 transition-colors">
                                   <td className="px-6 py-4 text-xs font-black text-slate-700">{f.name}</td>
                                   <td className="px-6 py-4 text-xs text-slate-500 italic">{f.services || 'Not Specified'}</td>
                                   <td className="px-6 py-4 text-xs text-slate-500">{f.email}</td>
                                   <td className="px-6 py-4 text-xs text-slate-500">{f.phone}</td>
                                   <td className="px-6 py-4 text-right">
                                      <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Edit3 size={16}/></button>
                                   </td>
                                </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="flex items-center justify-between">
                     <div>
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest">Real-time Factory Stock</h3>
                        <p className="text-sm text-slate-400">Tracking product units across factory floor categories.</p>
                     </div>
                     <div className="flex gap-4">
                        <button className="bg-slate-100 text-slate-600 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                           <Truck size={18} /> Supply Intake
                        </button>
                     </div>
                  </div>

                  <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
                     <div className="overflow-x-auto">
                        <table className="w-full text-left">
                           <thead>
                              <tr className="bg-slate-50/50 border-b border-slate-200">
                                 <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Name</th>
                                 <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                                 <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Current Stock</th>
                                 <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                 <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-50">
                              {catalog.slice(0, 10).map(p => (
                                <tr key={p.id} className="hover:bg-slate-50/30 transition-colors">
                                   <td className="px-10 py-5">
                                      <div className="flex items-center gap-3">
                                         <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center shrink-0"><Package size={16} className="text-slate-400" /></div>
                                         <div>
                                            <p className="text-xs font-black text-slate-900">{p.name}</p>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase">#{p.id}</p>
                                         </div>
                                      </div>
                                   </td>
                                   <td className="px-10 py-5 text-xs text-slate-500 font-medium">{p.category}</td>
                                   <td className="px-10 py-5 text-center">
                                      <span className="text-sm font-black text-slate-900">{p.stockLevel} <span className="text-[10px] font-medium text-slate-400">{p.unit}</span></span>
                                   </td>
                                   <td className="px-10 py-5 text-center">
                                      {p.stockLevel > p.minStock ? (
                                        <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[9px] font-black uppercase flex items-center gap-1.5 w-fit mx-auto"><CheckCircle2 size={12}/> Healthy</span>
                                      ) : (
                                        <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-[9px] font-black uppercase flex items-center gap-1.5 w-fit mx-auto"><AlertTriangle size={12}/> Low Stock</span>
                                      )}
                                   </td>
                                   <td className="px-10 py-5 text-right">
                                      <button className="text-blue-600 hover:underline text-[10px] font-black uppercase">Adjust</button>
                                   </td>
                                </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeView === 'Orders' && (
            <div className="space-y-10 animate-in fade-in duration-500">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[{l:'Total Revenue', v:'$112,450', i:DollarSign, c:'blue'}, {l:'Gross Orders', v:'420', i:ClipboardList, c:'indigo'}, {l:'Active Production', v:'24', i:Hammer, c:'amber'}, {l:'Growth Rate', v:'+12.5%', i:TrendingUp, c:'emerald'}].map((stat, i) => {
                    const StatIcon = stat.i;
                    return (
                      <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                         <div className={`w-12 h-12 bg-${stat.c}-50 text-${stat.c}-600 rounded-2xl flex items-center justify-center mb-4`}><StatIcon size={24} /></div>
                         <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.v}</p>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.l}</p>
                      </div>
                    );
                  })}
               </div>
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="bg-white rounded-[40px] border border-slate-200 p-8 shadow-sm">
                     <div className="flex items-center gap-3 mb-8"><div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center"><Building2 size={16}/></div><h4 className="text-xs font-black uppercase tracking-widest text-slate-900">Orders by Store</h4></div>
                     <div className="space-y-6">
                        {stores.map(s => (
                          <div key={s.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 transition-colors">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-[10px] font-black">{s.name[0]}</div>
                                <div><p className="text-xs font-black text-slate-900">{s.name}</p></div>
                             </div>
                             <p className="text-sm font-black text-blue-600">$24,800</p>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>
               <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-slate-100"><h3 className="text-lg font-black text-slate-900 uppercase tracking-widest">Master Order Ledger</h3></div>
                  <div className="overflow-x-auto">
                     <table className="w-full text-left">
                        <thead>
                           <tr className="bg-slate-50/50">
                              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID / Date</th>
                              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client Details</th>
                              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</th>
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
                                <td className="px-8 py-6"><p className="text-xs font-black text-slate-900">{order.client}</p></td>
                                <td className="px-8 py-6"><p className="text-sm font-black text-blue-600">${order.total}</p></td>
                                <td className="px-8 py-6 text-right"><button className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"><Eye size={14}/></button></td>
                             </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
          )}

          {activeView === 'Quote' && (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-10 animate-in slide-in-from-bottom-6 duration-500">
               <div className="xl:col-span-3 space-y-10">
                  <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
                     <div className="bg-slate-50/80 px-8 py-5 border-b border-slate-200"><h4 className="text-sm font-black text-slate-700 uppercase tracking-widest">Client Information</h4></div>
                     <div className="p-10 space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                           <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500">First Name</label><input type="text" value={clientInfo.firstName} onChange={e => setClientInfo({...clientInfo, firstName: e.target.value})} className="w-full bg-white border border-slate-200 rounded-md px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 outline-none" placeholder="First Name" /></div>
                           <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500">Last Name</label><input type="text" value={clientInfo.lastName} onChange={e => setClientInfo({...clientInfo, lastName: e.target.value})} className="w-full bg-white border border-slate-200 rounded-md px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 outline-none" placeholder="Last Name" /></div>
                        </div>
                        <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500">Address</label><input type="text" value={clientInfo.address} onChange={e => setClientInfo({...clientInfo, address: e.target.value})} className="w-full bg-white border border-slate-200 rounded-md px-4 py-2.5 text-sm outline-none" placeholder="Address" /></div>
                        <div className="pt-6"><button onClick={scrollToWorkspace} className="bg-slate-100 border border-slate-200 text-slate-700 px-8 py-2.5 rounded-md text-sm font-medium hover:bg-slate-200 transition-all shadow-sm active:scale-95 flex items-center gap-2">Continue <ArrowDown size={14} /></button></div>
                     </div>
                  </div>
                  <div ref={workspaceRef} className="bg-blue-600 rounded-[32px] p-10 text-white shadow-xl shadow-blue-100 scroll-mt-24 transition-all">
                     <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-4">
                           <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center"><Construction size={28}/></div>
                           <div><h3 className="text-lg font-black uppercase tracking-widest">Configuration Workspace</h3><p className="text-xs text-blue-100">Step-by-step selection for your custom order</p></div>
                        </div>
                        <div className="relative w-full md:w-96">
                           <ChevronRightCircle className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-400" size={18} />
                           <select className="w-full bg-white text-slate-900 border-none rounded-2xl pl-12 pr-10 py-4 text-xs font-black appearance-none outline-none focus:ring-4 focus:ring-blue-400 shadow-xl cursor-pointer" value={activeWorkflowStep} onChange={e => setActiveWorkflowStep(e.target.value)}>
                              {WORKFLOW_STEPS.map(step => (<option key={step.id} value={step.id}>{step.label}</option>))}
                           </select>
                           <ChevronDown size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                     </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {catalog.map(p => (<div key={p.id} className="bg-white rounded-[32px] p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all group"><div className="aspect-square bg-slate-50 rounded-[24px] mb-4 overflow-hidden relative border border-slate-100"><Package size={48} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-200" /><div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-sm"><p className="text-[10px] font-black text-blue-600">${p.price} <span className="text-slate-400">/{p.unit}</span></p></div></div><h5 className="text-xs font-black text-slate-900 mb-1">{p.name}</h5><button onClick={() => addLineItem(p)} className="w-full bg-slate-900 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-2"><Plus size={14} /> Add to Quote</button></div>))}
                  </div>
               </div>
               <div className="space-y-6">
                  <div className="sticky top-28 bg-white rounded-[40px] p-10 border border-slate-200 shadow-2xl">
                     <div className="flex items-center justify-between mb-10"><h3 className="text-xl font-black text-slate-900 tracking-tight">Current Quote</h3><ShoppingCart size={24} className="text-blue-600" /></div>
                     <div className="space-y-6 max-h-[400px] overflow-y-auto scrollbar-hide pr-2 mb-10 border-b border-slate-100 pb-10">
                        {lineItems.length > 0 ? lineItems.map((item, idx) => (<div key={idx} className="flex justify-between items-start"><div className="flex-1 pr-4"><p className="text-[11px] font-black text-slate-900 leading-tight">{item.product.name}</p></div><p className="text-xs font-black text-blue-600">${(item.product.price * item.quantity).toFixed(2)}</p></div>)) : <div className="text-center py-20 opacity-30 italic">Quote is empty</div>}
                     </div>
                     <div className="space-y-6">
                        <div className="flex justify-between items-center"><span className="text-xs font-black text-slate-400 uppercase tracking-widest">Grand Total</span><span className="text-3xl font-black text-slate-900">${lineItems.reduce((a, b) => a + (b.product.price * b.quantity), 0).toFixed(2)}</span></div>
                        <button onClick={handleSubmitQuote} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-blue-200 transition-all">Submit to Manager</button>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeView === 'QuoteDetail' && lastSubmittedQuote && (
            <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
               <div className="flex items-center justify-between border-b border-slate-200 pb-6">
                  <div>
                    <h3 className="text-2xl font-serif text-slate-800">New Order Delivery Date</h3>
                    <div className="mt-4 flex gap-8 text-sm font-medium text-slate-600"><span>A: {lastSubmittedQuote.deliveryA}</span><span>B: {lastSubmittedQuote.deliveryB}</span></div>
                  </div>
                  <button onClick={() => setActiveView('Quote')} className="bg-slate-100 text-slate-600 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-colors">Close View</button>
               </div>
               <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                     <thead><tr className="bg-slate-50 border-b border-slate-200"><th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider border-r border-slate-200">Order Info</th><th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider border-r border-slate-200">Order Items</th><th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Assembly</th></tr></thead>
                     <tbody className="align-top divide-x divide-slate-200">
                        <tr>
                           <td className="px-6 py-8 border-r border-slate-200 w-[25%]"><div className="space-y-4 text-[13px] text-slate-700"><p><span className="font-medium">Order#</span>{lastSubmittedQuote.orderNo}</p><p>{lastSubmittedQuote.date}</p><p className="font-bold">{lastSubmittedQuote.client}</p><p>{lastSubmittedQuote.phone}</p><p className="max-w-[200px]">{lastSubmittedQuote.address}</p></div></td>
                           <td className="px-6 py-8 border-r border-slate-200 w-[45%]"><div className="space-y-4">{lastSubmittedQuote.items.map((item: any, i: number) => (<div key={i} className="flex items-start gap-3 group"><div className="flex items-center gap-2 shrink-0 pt-0.5"><span className="text-[11px] text-slate-400">Ordered</span><input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300" /></div><div><p className={`text-[13px] font-medium leading-tight text-red-600`}>{item.product.name}</p></div></div>))}</div></td>
                           <td className="px-6 py-8 w-[30%]"><div className="space-y-4">{ASSEMBLY_TASKS.map((task, i) => (<div key={i} className="flex items-center justify-between text-[13px] group"><span className="text-slate-400 italic">Done</span><div className="flex items-center gap-2"><input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300" /><span className="text-red-600 font-medium">{task}</span></div></div>))}</div></td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>
          )}

          {activeView === 'Catalog' && (
            <div className="max-w-2xl mx-auto py-32 text-center animate-in fade-in duration-500">
               <div className="w-20 h-20 bg-slate-50 rounded-[24px] border border-slate-100 flex items-center justify-center mx-auto mb-6 text-slate-300"><Database size={32} /></div>
               <h4 className="text-xl font-black text-slate-900">Module Synchronizing</h4>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default App;