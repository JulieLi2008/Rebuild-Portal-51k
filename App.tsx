import React, { useState, useMemo, useRef } from 'react';
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
  // Fix: Added TrendingUp to imports from lucide-react
  TrendingUp
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

const App: React.FC = () => {
  // --- Central Data Store (Relational State) ---
  const [dbStores] = useState<StoreInfo[]>(mockDatabase.stores);
  const [dbProducts] = useState<Product[]>(mockDatabase.products);
  const [dbOrders, setDbOrders] = useState<Order[]>(mockDatabase.orders as Order[]);
  const [dbProductionTasks, setDbProductionTasks] = useState<ProductionTasks[]>(mockDatabase.productionTasks);
  const [dbRoles] = useState<any[]>(mockDatabase.roles);

  // --- Auth & Navigation ---
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activeView, setActiveView] = useState('Dashboard');
  const [users] = useState<UserProfile[]>(INITIAL_USERS as UserProfile[]);

  // --- Quote Workflow State ---
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

  // --- Task Manager & Data Center Filters ---
  const [selectedOrderForTasks, setSelectedOrderForTasks] = useState<string>(dbOrders[0]?.id || '');
  const [dcActiveTab, setDcActiveTab] = useState<'Orders' | 'Products' | 'Stores' | 'Tasks'>('Orders');
  const initialsRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const canAccess = (roles: UserRole[]) => currentUser && roles.includes(currentUser.role);

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    setActiveView('Dashboard');
  };

  const handleStoreChange = (storeId: string) => {
    const store = dbStores.find(s => s.id === storeId);
    setClientInfo({
      ...clientInfo,
      store_id: storeId,
      managerName: store?.manager_name || ''
    });
  };

  const addLineItem = (product: Product) => {
    setLineItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeLineItem = (id: string) => {
    setLineItems(prev => prev.filter(item => item.product.id !== id));
  };

  const handleSubmitQuote = () => {
    if (lineItems.length === 0) return;
    
    const newOrderId = `O${Date.now()}`;
    const newOrderNo = (375 + dbOrders.length).toString();

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
      status: OrderStatus.Production,
      date: new Date().toISOString().split('T')[0]
    };

    const newTasks: ProductionTasks = {
      order_id: newOrderId,
      tasks: [
        ...lineItems.map((item, i) => ({
          id: `TI-` + newOrderId + `-` + i,
          task_name: `${item.product.name} (Prep)`,
          is_complete: false,
          signed_by: ''
        })),
        ...ASSEMBLY_TASKS.map((name, i) => ({
          id: `TA-` + newOrderId + `-` + i,
          task_name: name,
          is_complete: false,
          signed_by: ''
        }))
      ]
    };

    setDbOrders([newOrder, ...dbOrders]);
    setDbProductionTasks([newTasks, ...dbProductionTasks]);
    setSelectedOrderForTasks(newOrderId);
    setLineItems([]);
    setActiveView('TaskManager');
    alert(`Success: Order #${newOrderNo} and Linked Tasks Generated.`);
  };

  const toggleDbTask = (orderId: string, taskId: string) => {
    setDbProductionTasks(prev => prev.map(pt => {
      if (pt.order_id !== orderId) return pt;
      return {
        ...pt,
        tasks: pt.tasks.map(t => {
          if (t.id !== taskId) return t;
          const newChecked = !t.is_complete;
          if (newChecked) setTimeout(() => initialsRefs.current[taskId]?.focus(), 0);
          return { ...t, is_complete: newChecked };
        })
      };
    }));
  };

  const updateDbTaskSignature = (orderId: string, taskId: string, initials: string) => {
    setDbProductionTasks(prev => prev.map(pt => {
      if (pt.order_id !== orderId) return pt;
      return {
        ...pt,
        tasks: pt.tasks.map(t => t.id === taskId ? { ...t, signed_by: initials.toUpperCase() } : t)
      };
    }));
  };

  // --- Derived Calculations for CEO Dashboard ---
  const dashboardStats = useMemo(() => {
    const totalRevenue = dbOrders.reduce((sum, order) => 
      sum + order.line_items.reduce((a, b) => a + (b.product.base_price * b.quantity), 0), 0);
    const totalOrderCount = dbOrders.length;
    const taskCompletionRate = dbProductionTasks.length > 0 ? 
      Math.round((dbProductionTasks.reduce((acc, pt) => acc + pt.tasks.filter(t => t.is_complete).length, 0) / 
      dbProductionTasks.reduce((acc, pt) => acc + pt.tasks.length, 0)) * 100) : 0;
    const inventoryValue = dbProducts.reduce((sum, p) => sum + (p.base_price * p.stockLevel), 0);

    return { totalRevenue, totalOrderCount, taskCompletionRate, inventoryValue };
  }, [dbOrders, dbProductionTasks, dbProducts]);

  const progressPercentage = useMemo(() => {
    const currentTasks = dbProductionTasks.find(pt => pt.order_id === selectedOrderForTasks)?.tasks || [];
    if (!currentTasks.length) return 0;
    const completed = currentTasks.filter(t => t.is_complete && t.signed_by.length > 0).length;
    return Math.round((completed / currentTasks.length) * 100);
  }, [dbProductionTasks, selectedOrderForTasks]);

  // --- CEO-Centric Navigation ---
  const navigation = [
    {
      section: 'EXECUTIVE',
      items: [
        { id: 'Dashboard', label: 'Dashboard', icon: BarChart3, roles: ['SuperAdmin', 'Manager'] },
        { id: 'Users', label: 'Access Control', icon: ShieldCheck, roles: ['SuperAdmin'] },
        { id: 'Stores', label: 'Store Network', icon: Building2, roles: ['SuperAdmin', 'Manager'] },
        { id: 'DataCenter', label: 'Data Center', icon: Database, roles: ['SuperAdmin'] },
      ]
    },
    {
      section: 'SALES',
      items: [
        { id: 'Quote', label: 'Quote Builder', icon: FilePlus, roles: ['SuperAdmin', 'Manager', 'Sales'] },
        { id: 'Orders', label: 'Orders', icon: ClipboardList, roles: ['SuperAdmin', 'Manager', 'Sales'] },
      ]
    },
    {
      section: 'PRODUCTION',
      items: [
        { id: 'TaskManager', label: 'Task Manager', icon: ListTodo, roles: ['SuperAdmin', 'FactoryWorker'] },
        { id: 'Inventory', label: 'Inventory', icon: Warehouse, roles: ['SuperAdmin', 'FactoryWorker'] },
        { id: 'Catalog', label: 'Master Catalog', icon: Package, roles: ['SuperAdmin'] },
      ]
    }
  ];

  const currentOrder = dbOrders.find(o => o.id === selectedOrderForTasks);
  const currentTasks = dbProductionTasks.find(pt => pt.order_id === selectedOrderForTasks)?.tasks || [];

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-10 border border-slate-200">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-blue-200"><Layers size={40} /></div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">51WOOD Portal</h1>
            <p className="text-slate-400 mt-2 font-medium">Internal Business Management</p>
          </div>
          <div className="space-y-3">
            {users.map(u => (
              <button key={u.id} onClick={() => handleLogin(u)} className="w-full flex items-center gap-3 p-4 rounded-2xl border bg-slate-50 border-slate-100 hover:bg-white transition-all group">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all"><User size={20} /></div>
                <div className="text-left">
                  <p className="text-sm font-black text-slate-900">{u.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{u.role}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-900 font-sans overflow-hidden">
      <aside className="w-72 bg-white border-r border-slate-200 p-6 flex flex-col z-50">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0"><Layers size={22} /></div>
          <h1 className="font-black text-lg tracking-tighter">51K PORTAL</h1>
        </div>
        
        <nav className="flex-1 space-y-8 overflow-y-auto scrollbar-hide">
          {navigation.map((group) => (
            <div key={group.section} className="space-y-2">
              <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{group.section}</p>
              <div className="space-y-1">
                {group.items.filter(item => canAccess(item.roles as UserRole[])).map(item => (
                  <button key={item.id} onClick={() => setActiveView(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'}`}>
                    <item.icon size={18} />
                    <span className="font-bold text-xs truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="pt-6 border-t border-slate-200">
          <button onClick={() => setCurrentUser(null)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-black text-xs uppercase"><LogOut size={18} /> Logout</button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-10 flex items-center justify-between shrink-0 z-40">
          <div><h2 className="text-xl font-black text-slate-900 tracking-tight capitalize">{activeView.replace(/([A-Z])/g, ' $1').trim()}</h2></div>
          <div className="flex items-center gap-4">
            <div className="text-right"><p className="text-sm font-black text-slate-900">{currentUser?.name}</p><span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[8px] font-black uppercase">{currentUser?.role}</span></div>
            <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-black text-sm">{currentUser?.name?.[0]}</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10 bg-[#f8fafc]">
          {activeView === 'Dashboard' && (
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm relative overflow-hidden">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Revenue</p>
                   <p className="text-3xl font-black text-slate-900">${dashboardStats.totalRevenue.toLocaleString()}</p>
                   <TrendingUp className="absolute -bottom-4 -right-4 text-slate-50 w-24 h-24" />
                </div>
                <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Order Volume</p>
                   <p className="text-3xl font-black text-slate-900">{dashboardStats.totalOrderCount}</p>
                </div>
                <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Production Uptime</p>
                   <p className="text-3xl font-black text-slate-900">{dashboardStats.taskCompletionRate}%</p>
                </div>
                <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Stock Value</p>
                   <p className="text-3xl font-black text-slate-900">${(dashboardStats.inventoryValue / 1000).toFixed(1)}k</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[40px] p-10 text-white shadow-xl shadow-slate-200 relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="text-3xl font-black leading-tight">CEO Executive Control.</h3>
                    <p className="text-slate-400 mt-4 max-w-sm">Accessing the master relational database to drive strategic manufacturing decisions for 51wood.</p>
                    <div className="mt-8 flex gap-4">
                      <button onClick={() => setActiveView('DataCenter')} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest">Open Data Center</button>
                      <button onClick={() => setActiveView('Orders')} className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">View All Orders</button>
                    </div>
                  </div>
                  <Database size={200} className="absolute -bottom-10 -right-10 text-white/5" />
                </div>
                <div className="bg-white rounded-[40px] p-10 border border-slate-200 shadow-sm flex flex-col justify-center text-center">
                  <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6"><Activity size={40} /></div>
                  <h4 className="text-xl font-black">System Pulse</h4>
                  <p className="text-slate-400 text-sm mt-2">Database is synced with internal ERP nodes.</p>
                </div>
              </div>
            </div>
          )}

          {activeView === 'Quote' && (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-10 animate-in slide-in-from-bottom-6 duration-500">
               <div className="xl:col-span-3 space-y-10">
                  <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
                     <div className="bg-slate-50/80 px-8 py-5 border-b border-slate-200"><h4 className="text-sm font-black text-slate-700 uppercase tracking-widest">Client Registration Form</h4></div>
                     <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                           <div className="space-y-1.5">
                             <label className="text-xs font-bold text-slate-500">Store Outlet</label>
                             <select value={clientInfo.store_id} onChange={e => handleStoreChange(e.target.value)} className="w-full bg-white border border-slate-200 rounded-md px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 outline-none appearance-none">
                                {dbStores.map(s => <option key={s.id} value={s.id}>{s.store_name}</option>)}
                             </select>
                           </div>
                           <div className="space-y-1.5">
                             <label className="text-xs font-bold text-slate-500">Manager Account</label>
                             <input type="text" value={clientInfo.managerName} className="w-full bg-slate-50 border border-slate-200 rounded-md px-4 py-2.5 text-sm text-slate-500" readOnly />
                           </div>
                           <div className="space-y-1.5">
                             <label className="text-xs font-bold text-slate-500">First Name</label>
                             <input type="text" value={clientInfo.firstName} onChange={e => setClientInfo({...clientInfo, firstName: e.target.value})} className="w-full bg-white border border-slate-200 rounded-md px-4 py-2.5 text-sm outline-none" placeholder="First Name" />
                           </div>
                           <div className="space-y-1.5">
                             <label className="text-xs font-bold text-slate-500">Last Name</label>
                             <input type="text" value={clientInfo.lastName} onChange={e => setClientInfo({...clientInfo, lastName: e.target.value})} className="w-full bg-white border border-slate-200 rounded-md px-4 py-2.5 text-sm outline-none" placeholder="Last Name" />
                           </div>
                           <div className="space-y-1.5 md:col-span-2">
                             <label className="text-xs font-bold text-slate-500">Client Address</label>
                             <input type="text" value={clientInfo.address} onChange={e => setClientInfo({...clientInfo, address: e.target.value})} className="w-full bg-white border border-slate-200 rounded-md px-4 py-2.5 text-sm outline-none" placeholder="Full Billing Address" />
                           </div>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dbProducts.map(p => (
                      <div key={p.id} className="bg-white rounded-[32px] p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all">
                        <div className="aspect-square bg-slate-50 rounded-[24px] mb-4 relative flex items-center justify-center"><Package size={48} className="text-slate-200" /><div className="absolute top-4 right-4 bg-white px-3 py-1.5 rounded-xl shadow-sm border border-slate-100"><p className="text-[10px] font-black text-blue-600">${p.base_price}</p></div></div>
                        <h5 className="text-xs font-black text-slate-900 mb-1">{p.name}</h5>
                        <p className="text-[9px] text-slate-400 mb-4">{p.category}</p>
                        <button onClick={() => addLineItem(p)} className="w-full bg-slate-900 text-white py-3 rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"><Plus size={14} /> Add Line Item</button>
                      </div>
                    ))}
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="sticky top-28 bg-white rounded-[40px] p-10 border border-slate-200 shadow-2xl">
                     <div className="flex items-center justify-between mb-10"><h3 className="text-xl font-black text-slate-900 tracking-tight">Relational Quote</h3><ShoppingCart size={24} className="text-blue-600" /></div>
                     <div className="space-y-4 max-h-[400px] overflow-y-auto mb-10 border-b border-slate-100 pb-10 scrollbar-hide">
                        {lineItems.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-start">
                            <div className="flex-1 pr-4 text-[11px] font-black text-slate-900">{item.product.name} x{item.quantity}</div>
                            <div className="flex items-center gap-3">
                              <p className="text-xs font-black text-blue-600">${(item.product.base_price * item.quantity).toFixed(2)}</p>
                              <button onClick={() => removeLineItem(item.product.id)} className="text-slate-300 hover:text-red-500"><Trash2 size={12} /></button>
                            </div>
                          </div>
                        ))}
                        {lineItems.length === 0 && <p className="text-center py-10 text-xs text-slate-300 italic">No selection</p>}
                     </div>
                     <div className="space-y-6">
                        <div className="flex justify-between items-center"><span className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Value</span><span className="text-3xl font-black text-slate-900">${lineItems.reduce((a, b) => a + (b.product.base_price * b.quantity), 0).toFixed(2)}</span></div>
                        <button onClick={handleSubmitQuote} disabled={lineItems.length === 0} className="w-full bg-blue-600 disabled:opacity-30 text-white py-4 rounded-2xl font-black text-[11px] uppercase shadow-xl hover:bg-blue-700 transition-all">Submit to Manager</button>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeView === 'TaskManager' && (
            <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500">
               <div className="flex items-center justify-between border-b border-slate-200 pb-6">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-widest">Task Manager</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-slate-400 uppercase">Active Order:</span>
                      <select value={selectedOrderForTasks} onChange={(e) => setSelectedOrderForTasks(e.target.value)} className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold outline-none shadow-sm cursor-pointer">
                        {dbOrders.map(o => <option key={o.id} value={o.id}>#{o.order_no} - {o.client_info.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="w-48 bg-slate-100 h-2.5 rounded-full overflow-hidden"><div className="bg-blue-600 h-full transition-all duration-700" style={{ width: `${progressPercentage}%` }}></div></div>
                    <p className="text-sm font-black text-slate-900">{progressPercentage}% Complete</p>
                  </div>
               </div>

               {currentOrder && (
                 <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                       <thead><tr className="bg-slate-50 border-b border-slate-200"><th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase border-r w-[30%]">Order Details</th><th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase border-r">Line Item Prep</th><th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase">Assembly Workflow</th></tr></thead>
                       <tbody className="align-top divide-x divide-slate-100">
                          <tr>
                             <td className="px-10 py-10 border-r">
                                <div className="space-y-6">
                                   <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100"><p className="text-[10px] font-black text-blue-400 uppercase mb-1">Batch Identifier</p><p className="text-lg font-black text-slate-900">#{currentOrder.order_no}</p></div>
                                   <div className="space-y-4 text-[13px] text-slate-700">
                                      <p><span className="text-slate-400 font-medium block text-[10px] uppercase mb-1">Client Profile</span> {currentOrder.client_info.name}</p>
                                      <p><span className="text-slate-400 font-medium block text-[10px] uppercase mb-1">Assigned Manager</span> {currentOrder.manager_name}</p>
                                      <p><span className="text-slate-400 font-medium block text-[10px] uppercase mb-1">Destination</span> {currentOrder.client_info.address}</p>
                                   </div>
                                </div>
                             </td>
                             <td className="px-10 py-10 border-r">
                                <div className="space-y-3">
                                   {currentTasks.filter(t => t.id.includes('TI-')).map((task) => (
                                     <div key={task.id} className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${task.is_complete && task.signed_by ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-100'}`}>
                                        <input type="checkbox" checked={task.is_complete} onChange={() => toggleDbTask(currentOrder.id, task.id)} className="w-5 h-5 rounded-md text-blue-600 cursor-pointer" />
                                        <span className={`text-[12px] font-bold flex-1 ${task.is_complete ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{task.task_name}</span>
                                        <input ref={el => { initialsRefs.current[task.id] = el; }} type="text" maxLength={3} value={task.signed_by} onChange={(e) => updateDbTaskSignature(currentOrder.id, task.id, e.target.value)} placeholder="Sign" className="w-12 bg-white border border-slate-200 rounded px-1.5 py-1 text-[10px] font-black text-center outline-none focus:ring-2 focus:ring-blue-100 transition-all uppercase" />
                                     </div>
                                   ))}
                                </div>
                             </td>
                             <td className="px-10 py-10">
                                <div className="space-y-3">
                                   {currentTasks.filter(t => t.id.includes('TA-')).map((task) => (
                                     <div key={task.id} className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${task.is_complete && task.signed_by ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-100'}`}>
                                        <input type="checkbox" checked={task.is_complete} onChange={() => toggleDbTask(currentOrder.id, task.id)} className="w-5 h-5 rounded-md text-blue-600 cursor-pointer" />
                                        <span className={`text-[12px] font-bold flex-1 ${task.is_complete ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{task.task_name}</span>
                                        <input ref={el => { initialsRefs.current[task.id] = el; }} type="text" maxLength={3} value={task.signed_by} onChange={(e) => updateDbTaskSignature(currentOrder.id, task.id, e.target.value)} placeholder="Sign" className="w-12 bg-white border border-slate-200 rounded px-1.5 py-1 text-[10px] font-black text-center outline-none focus:ring-2 focus:ring-blue-100 transition-all uppercase" />
                                     </div>
                                   ))}
                                </div>
                             </td>
                          </tr>
                       </tbody>
                    </table>
                 </div>
               )}
            </div>
          )}

          {activeView === 'DataCenter' && (
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
               <div className="flex items-center justify-between mb-8">
                  <div><h3 className="text-2xl font-black text-slate-900 tracking-tight">System Data Center</h3><p className="text-xs text-slate-400 font-medium">Relational JSON database state inspection (Read-Only State)</p></div>
                  <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
                    {['Orders', 'Products', 'Stores', 'Tasks'].map(tab => (
                      <button key={tab} onClick={() => setDcActiveTab(tab as any)} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${dcActiveTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{tab}</button>
                    ))}
                  </div>
               </div>

               <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    {dcActiveTab === 'Orders' && (
                      <table className="w-full text-left">
                        <thead><tr className="bg-slate-50 border-b"><th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">order_id</th><th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">store_id</th><th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">client_name</th><th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">manager</th><th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">status</th></tr></thead>
                        <tbody className="divide-y">
                          {dbOrders.map(o => (
                            <tr key={o.id} className="text-xs">
                              <td className="px-8 py-4 font-mono text-blue-600">{o.id}</td>
                              <td className="px-8 py-4">{o.store_id}</td>
                              <td className="px-8 py-4 font-bold">{o.client_info.name}</td>
                              <td className="px-8 py-4">{o.manager_name}</td>
                              <td className="px-8 py-4"><span className="px-2 py-1 bg-slate-50 rounded uppercase font-black text-[9px]">{o.status}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                    {dcActiveTab === 'Products' && (
                      <table className="w-full text-left">
                        <thead><tr className="bg-slate-50 border-b"><th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">product_id</th><th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">sku</th><th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">name</th><th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">base_price</th><th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 text-center">stock</th></tr></thead>
                        <tbody className="divide-y">
                          {dbProducts.map(p => (
                            <tr key={p.id} className="text-xs">
                              <td className="px-8 py-4 font-mono text-blue-600">{p.id}</td>
                              <td className="px-8 py-4">{p.sku}</td>
                              <td className="px-8 py-4 font-bold">{p.name}</td>
                              <td className="px-8 py-4">${p.base_price}</td>
                              <td className="px-8 py-4 text-center">{p.stockLevel}</td>
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
                              <td className="px-8 py-4">{s.address}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                    {dcActiveTab === 'Tasks' && (
                      <table className="w-full text-left">
                        <thead><tr className="bg-slate-50 border-b"><th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">order_id</th><th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">task_count</th><th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">completion</th><th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 text-right">Raw Check</th></tr></thead>
                        <tbody className="divide-y">
                          {dbProductionTasks.map(pt => {
                            const done = pt.tasks.filter(t => t.is_complete).length;
                            return (
                              <tr key={pt.order_id} className="text-xs">
                                <td className="px-8 py-4 font-mono text-blue-600">{pt.order_id}</td>
                                <td className="px-8 py-4 font-bold">{pt.tasks.length} subtasks</td>
                                <td className="px-8 py-4">{done} of {pt.tasks.length} finished</td>
                                <td className="px-8 py-4 text-right"><button className="p-1 hover:bg-slate-50 rounded transition-all"><Eye size={14} /></button></td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
               </div>
            </div>
          )}

          {activeView === 'Users' && (
            <div className="animate-in fade-in duration-500 space-y-8">
               <div className="flex items-center justify-between">
                 <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest">Platform Access Governance</h3>
                 <button className="bg-blue-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest"><Plus size={14} className="inline mr-2" /> Define New Role</button>
               </div>
               <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
                  <table className="w-full text-left border-collapse">
                     <thead><tr className="bg-slate-50 border-b border-slate-100"><th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Role Identifier</th>{PERMISSION_COLUMNS.slice(0, 6).map(col => <th key={col} className="px-4 py-5 text-[9px] font-black text-slate-400 uppercase text-center border-r">{col}</th>)}<th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase text-right">Actions</th></tr></thead>
                     <tbody className="divide-y">
                        {dbRoles.map(role => (
                          <tr key={role.id} className="hover:bg-slate-50/30 transition-colors">
                             <td className="px-8 py-6"><p className="text-sm font-black text-slate-900">{role.name}</p></td>
                             {PERMISSION_COLUMNS.slice(0, 6).map(col => (
                               <td key={col} className="px-4 py-6 text-center border-r">
                                  <div className={`w-4 h-4 rounded border mx-auto flex items-center justify-center transition-all ${role.permissions[col] ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-50 border-slate-200 text-transparent'}`}><Check size={10} /></div>
                               </td>
                             ))}
                             <td className="px-8 py-6 text-right"><button className="p-2 bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600"><Edit3 size={14} /></button></td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          )}

          {activeView === 'Stores' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex items-center justify-between"><h3 className="text-lg font-black text-slate-900 uppercase tracking-widest">Store Network</h3><button className="bg-blue-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95"><PlusCircle size={16} /> REGISTER STORE</button></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {dbStores.map(store => (
                  <div key={store.id} className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm group hover:shadow-xl transition-all">
                    <div className="flex items-start justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all"><Building2 size={28} /></div>
                        <div><h4 className="text-xl font-black text-slate-900">{store.store_name}</h4><p className="text-xs text-slate-400">{store.address}</p></div>
                      </div>
                    </div>
                    <div className="pt-8 border-t border-slate-100 flex justify-between items-center text-left">
                      <div><p className="text-[10px] font-black text-slate-400 uppercase">Store Manager</p><p className="text-sm font-black text-slate-900">{store.manager_name}</p></div>
                      <div className="text-right"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rate</p><p className="text-sm font-black text-blue-600">{store.commissionRate}%</p></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeView === 'Inventory' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
                  <table className="w-full text-left border-collapse">
                     <thead><tr className="bg-slate-50 border-b border-slate-100"><th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Product Name</th><th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Category</th><th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase text-center">Available Stock</th><th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase text-right">Catalog Price</th></tr></thead>
                     <tbody className="divide-y">
                        {dbProducts.map(p => (
                          <tr key={p.id} className="hover:bg-slate-50/50">
                             <td className="px-8 py-6 font-black text-slate-900 text-sm">{p.name} <span className="text-[9px] text-slate-400 ml-2">#{p.sku}</span></td>
                             <td className="px-8 py-6 text-xs text-slate-400 uppercase font-black">{p.category}</td>
                             <td className="px-8 py-6 text-center"><span className={`text-xs font-bold ${p.stockLevel < p.minStock ? 'text-red-600' : 'text-slate-900'}`}>{p.stockLevel} {p.unit}</span></td>
                             <td className="px-8 py-6 text-right font-black text-blue-600">${p.base_price.toFixed(2)}</td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          )}

          {activeView === 'Catalog' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest">Master Product DNA</h3>
                <button className="bg-slate-900 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest">Update Specs</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {dbProducts.map(p => (
                  <div key={p.id} className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400"><Package size={24} /></div>
                      <div><h4 className="font-black text-slate-900">{p.name}</h4><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.sku}</p></div>
                    </div>
                    <div className="space-y-4 pt-6 border-t border-slate-100">
                      <div className="flex justify-between text-xs"><span className="text-slate-400 font-bold uppercase">Dimensions</span><span className="font-black">{p.dimensions.w}x{p.dimensions.h}x{p.dimensions.d}</span></div>
                      <div className="flex justify-between text-xs"><span className="text-slate-400 font-bold uppercase">Unit</span><span className="font-black">{p.unit}</span></div>
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Available Modifications</span>
                        <div className="flex flex-wrap gap-2">
                          {p.modifications.map(m => <span key={m} className="px-2 py-0.5 bg-slate-50 text-slate-600 text-[9px] font-bold rounded-lg border border-slate-100">{m}</span>)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeView === 'Orders' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
                  <table className="w-full text-left">
                     <thead><tr className="bg-slate-50 border-b border-slate-100"><th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Order#</th><th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Client Profile</th><th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Production Status</th><th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Store Node</th><th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase text-right">Total Value</th></tr></thead>
                     <tbody className="divide-y">
                        {dbOrders.map(order => (
                          <tr key={order.id} className="hover:bg-slate-50/50">
                             <td className="px-8 py-6 font-black text-slate-900 text-sm">#{order.order_no} <span className="block text-[9px] text-slate-400 font-medium">{order.date}</span></td>
                             <td className="px-8 py-6 text-sm font-medium text-slate-600">{order.client_info.name}</td>
                             <td className="px-8 py-6"><span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">{order.status}</span></td>
                             <td className="px-8 py-6 text-sm text-slate-500">{dbStores.find(s => s.id === order.store_id)?.store_name}</td>
                             <td className="px-8 py-6 text-right font-black text-blue-600 text-sm">${order.line_items.reduce((a, b) => a + (b.product.base_price * b.quantity), 0).toFixed(2)}</td>
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

// Simple Mock icon for missing Hammer
const HammerIcon = ({ size }: { size: number }) => <Hammer size={size} />;

export default App;