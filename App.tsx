import React, { useState, useMemo, useRef, Component, ErrorInfo, ReactNode, useEffect } from 'react';
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

// Sub-Modules (Imported as components)
import Dashboard from './Dashboard';
import IntakeModal from './IntakeModal';
import TechnicianWorkspace from './TechnicianWorkspace';

/**
 * ERROR BOUNDARY COMPONENT
 */
interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

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
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-12 font-sans">
          <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-12 border-2 border-red-100 text-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6">
              <AlertTriangle size={40} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 mb-4 tracking-tight uppercase">System Exception</h1>
            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mb-8 leading-relaxed">
              The application encountered a runtime error. This typically occurs due to an uninitialized data state.
            </p>
            <div className="bg-red-50 rounded-2xl p-6 text-left mb-8 overflow-x-auto border border-red-100">
              <code className="text-[10px] font-black text-red-600 block leading-relaxed">
                {this.state.error?.message || "Critical JavaScript Error"}
              </code>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-slate-900 text-white py-5 rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-blue-100"
            >
              Restart Environment
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
      <div className="w-full max-w-md bg-white rounded-[48px] shadow-2xl shadow-slate-200/50 overflow-hidden animate-in fade-in zoom-in-95 duration-500 border border-white">
        <div className="p-14">
          <div className="flex flex-col items-center gap-5 mb-14">
            <div className="w-16 h-16 bg-blue-600 rounded-[20px] flex items-center justify-center text-white shadow-2xl shadow-blue-200">
              <Layers size={32} />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">51K Portal</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">SaaS Command Interface</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Identity Pin</label>
              <input 
                type="email" 
                defaultValue="admin@51wood.ca"
                className="w-full bg-slate-50 border border-slate-100 rounded-[24px] px-6 py-5 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all" 
                placeholder="name@51wood.ca"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Access Key</label>
              <input 
                type="password" 
                defaultValue="password123"
                className="w-full bg-slate-50 border border-slate-100 rounded-[24px] px-6 py-5 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all" 
                placeholder="••••••••"
              />
            </div>
            <button 
              onClick={() => safeUsers[0] && onLogin(safeUsers[0] as UserProfile)}
              className="w-full bg-blue-600 text-white py-6 rounded-[28px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              Authorize Session <LogIn size={18} />
            </button>
          </div>

          <div className="mt-14 pt-10 border-t border-slate-100 text-center">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-8">Rapid Switcher</p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'CEO', icon: ShieldCheck, user: safeUsers[0], color: 'text-blue-600 bg-blue-50' },
                { label: 'Manager', icon: Building2, user: safeUsers[1], color: 'text-amber-600 bg-amber-50' },
                { label: 'Worker', icon: Hammer, user: safeUsers[2], color: 'text-slate-600 bg-slate-50' }
              ].map((role) => (
                <button 
                  key={role.label}
                  onClick={() => role.user && onLogin(role.user as UserProfile)}
                  className="flex flex-col items-center gap-3 p-5 rounded-[28px] border border-transparent hover:border-slate-100 hover:bg-slate-50/50 transition-all group active:scale-90"
                >
                  <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center ${role.color} transition-all group-hover:scale-110 shadow-sm`}>
                    <role.icon size={20} />
                  </div>
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{role.label}</span>
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
  const [dbStores] = useState<StoreInfo[]>(mockDatabase?.stores || []);
  const [dbProducts] = useState<Product[]>(mockDatabase?.products || []);
  const [dbOrders, setDbOrders] = useState<Order[]>(mockDatabase?.orders as Order[] || []);
  const [dbProductionTasks, setDbProductionTasks] = useState<ProductionTasks[]>(mockDatabase?.productionTasks || []);
  const [dbRoles] = useState<any[]>(mockDatabase?.roles || []);

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activeView, setActiveView] = useState('Dashboard');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [showIntakeModal, setShowIntakeModal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const [inventorySearch, setInventorySearch] = useState('');
  const [tmFilter, setTmFilter] = useState<string>('All');

  useEffect(() => {
    // Simulate system initialization to ensure blank screens are handled
    const timer = setTimeout(() => setIsLoaded(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    setActiveView(user.role === 'Worker' ? 'TaskManager' : 'Dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveView('Dashboard');
    setSelectedOrderId(null);
  };

  const handleSelectOrder = (id: string) => {
    setSelectedOrderId(id);
    setActiveView('TechnicianWorkspace');
  };

  const handleIntakeSelection = (order: Order) => {
    setShowIntakeModal(false);
    handleSelectOrder(order.id);
  };

  const toggleDbTask = (orderId: string, taskId: string) => {
    setDbProductionTasks(prev => prev.map(pt => pt.order_id === orderId ? {
      ...pt,
      tasks: pt.tasks.map(t => t.id === taskId ? { ...t, is_complete: !t.is_complete, signed_by: t.is_complete ? '' : 'TECH' } : t)
    } : pt));
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-12 font-sans">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">System Initializing...</p>
      </div>
    );
  }

  if (!currentUser) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-900 font-sans overflow-hidden">
      <aside className="w-72 bg-white border-r border-slate-200 p-8 flex flex-col z-50 shadow-[8px_0_32px_rgba(0,0,0,0.01)]">
        <div className="flex items-center gap-4 mb-14 px-2">
          <div className="w-12 h-12 bg-blue-600 rounded-[18px] flex items-center justify-center text-white shadow-xl shadow-blue-100 shrink-0">
            <Layers size={24} />
          </div>
          <div className="overflow-hidden">
            <h1 className="font-black text-xl tracking-tighter uppercase leading-none">51K Portal</h1>
            <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.3em] mt-1 whitespace-nowrap">Enterprise Console</p>
          </div>
        </div>
        
        <nav className="flex-1 space-y-8 overflow-y-auto scrollbar-hide">
          {currentUser.role !== 'Worker' && (
            <div>
              <p className="px-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Command</p>
              <button 
                onClick={() => { setActiveView('Dashboard'); setSelectedOrderId(null); }} 
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-[20px] transition-all group ${activeView === 'Dashboard' ? 'bg-blue-600 text-white shadow-2xl shadow-blue-100' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <BarChart3 size={20} className={activeView === 'Dashboard' ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'} />
                <span className="font-black text-[11px] uppercase tracking-wider">Dashboard</span>
              </button>
            </div>
          )}
          
          <div>
            <p className="px-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Manufacturing</p>
            <div className="space-y-1">
              {[
                { id: 'TaskManager', l: 'Work Queue', i: ListTodo },
                { id: 'Inventory', l: 'Materials', i: Warehouse },
                { id: 'Catalog', l: 'Product SKU', i: Package }
              ].map(item => (
                <button 
                  key={item.id} 
                  onClick={() => { setActiveView(item.id); setSelectedOrderId(null); }} 
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-[20px] transition-all group ${activeView === item.id ? 'bg-blue-600 text-white shadow-2xl shadow-blue-100' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  <item.i size={20} className={activeView === item.id ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'} />
                  <span className="font-black text-[11px] uppercase tracking-wider">{item.l}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>
        
        <div className="pt-8 border-t border-slate-100 space-y-6">
          <div className="bg-slate-50 rounded-[24px] p-5 flex items-center gap-4 border border-slate-100">
             <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 font-black text-xs border border-slate-100 uppercase">
                {currentUser.name[0]}
             </div>
             <div className="overflow-hidden">
                <p className="text-[11px] font-black text-slate-900 truncate">{currentUser.name}</p>
                <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest">{currentUser.role}</p>
             </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center gap-4 px-5 py-4 rounded-[20px] text-red-500 hover:bg-red-50 transition-all font-black text-[10px] uppercase tracking-[0.2em]"
          >
            <LogOut size={18} /> Exit System
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-24 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-12 flex items-center justify-between shrink-0 z-40">
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
             <h2 className="text-2xl font-black tracking-tighter uppercase text-slate-900">
              {activeView.replace(/([A-Z])/g, ' $1').trim()}
             </h2>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-12 scrollbar-hide bg-[#f8fafc]/50">
          {activeView === 'Dashboard' && (
            <Dashboard 
              orders={dbOrders} 
              onNewEstimate={() => setShowIntakeModal(true)} 
              onSelectOrder={handleSelectOrder}
            />
          )}

          {activeView === 'TechnicianWorkspace' && selectedOrderId && (
            <TechnicianWorkspace 
              order={dbOrders.find(o => o.id === selectedOrderId)!} 
              tasks={dbProductionTasks.find(t => t.order_id === selectedOrderId)}
              onBack={() => { setActiveView('Dashboard'); setSelectedOrderId(null); }}
              onToggleTask={(taskId) => toggleDbTask(selectedOrderId, taskId)}
            />
          )}

          {activeView === 'TaskManager' && (
            <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
               <div className="flex flex-wrap items-center justify-between gap-6">
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-900">Production Queue</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] italic">Manufacturing Pipeline Control</p>
                  </div>
                  <div className="flex bg-white p-1.5 rounded-[24px] border border-slate-100 shadow-sm gap-1">
                    {['All', 'Pending', 'In Process', 'Quality Check', 'Ready'].map(s => (
                      <button 
                        key={s} 
                        onClick={() => setTmFilter(s)} 
                        className={`px-5 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${tmFilter === s ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'text-slate-500 hover:bg-slate-50'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
               </div>
               
               <div className="space-y-10">
                 {dbOrders.filter(o => tmFilter === 'All' || o.status === tmFilter).map(order => (
                    <div key={order.id} className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden hover:shadow-2xl hover:border-blue-200 transition-all group">
                       <div className="p-10 pb-8 flex items-center justify-between">
                          <div className="flex items-center gap-10">
                             <div className="w-20 h-20 bg-slate-50 rounded-[28px] flex flex-col items-center justify-center text-slate-400 font-black group-hover:bg-blue-50 group-hover:text-blue-600 transition-all border border-slate-50 group-hover:border-blue-100">
                               <span className="text-[10px] uppercase opacity-40">RO</span>
                               <span className="text-2xl tracking-tighter">{order.order_no}</span>
                             </div>
                             <div>
                                <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">{order.client_info.name}</h4>
                             </div>
                          </div>
                          <div className={`px-6 py-3 rounded-[20px] text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ${
                            order.status === 'Pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                          }`}>
                            {order.status}
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeView === 'Inventory' && (
            <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
               <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden">
                  <table className="w-full text-left">
                     <thead className="bg-slate-50/80 backdrop-blur-sm border-b border-slate-100">
                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                          <th className="px-10 py-7">Product</th>
                          <th className="px-10 py-7 text-center">Stock</th>
                          <th className="px-10 py-7 text-right">Value</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                        {dbProducts.filter(p => p.name.toLowerCase().includes(inventorySearch.toLowerCase())).map(p => (
                          <tr key={p.id} className="hover:bg-blue-50/20 transition-colors group">
                             <td className="px-10 py-8 font-black text-slate-900">{p.name}</td>
                             <td className="px-10 py-8 text-center">{p.stockLevel}</td>
                             <td className="px-10 py-8 text-right font-black text-blue-600">${p.base_price.toFixed(2)}</td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          )}
        </main>
      </div>

      {showIntakeModal && (
        <IntakeModal 
          orders={dbOrders} 
          onClose={() => setShowIntakeModal(false)} 
          onSelectCustomer={handleIntakeSelection}
        />
      )}
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