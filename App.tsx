import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { 
  FilePlus, 
  FileText,
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
  Users,
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
  TaskItem,
  Customer,
  Lead,
  LeadStatus,
  Quote,
  QuoteStatus,
  QuoteItem,
  EmploymentType,
  TeamMember,
  WorkerType,
  FirestoreOrder,
  FirestoreProductionTask,
  FirestoreTaskItem,
  OrderStatusV2,
  PaymentStatus,
  ProductionStatus,
  StockMovement,
} from './types';
import { 
  INITIAL_USERS, 
  PERMISSION_COLUMNS,
  mockDatabase
} from './script.js';
import { loginWithEmail, logoutUser, listenToAuthState, getUserProfile } from './services/authService';
import { getRoles, saveRole, updateRolePermissions, deleteRole, RoleRecord } from './services/roleService';
import { getStores, saveStore, deleteStore } from './services/storeService';
import { getProducts, saveProduct, deleteProduct } from './services/productService';
import {
  createCustomerAndLead,
  getCustomers,
  getLeads,
  updateLeadStatus,
} from './services/customerLeadService';
import {
  createQuote,
  generateQuoteNumber,
  getQuotes,
  makeQuoteItem,
  updateQuoteStatus,
} from './services/quoteService';
import {
  createTeamMember,
  deleteTeamMember,
  getTeamMembers,
  updateTeamMember,
} from './services/teamMemberService';
import {
  convertQuoteToOrder,
  getOrders,
  getProductionTasks,
  updateOrderStatus,
  updatePaymentStatus,
  updateProductionStatus,
  updateProductionTaskItems,
} from './services/orderService';
import {
  deductStockForOrder,
  getStockMovements,
  reserveStockForOrder,
} from './services/inventoryService';

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
            <h1 className="text-2xl font-black tracking-tighter">51Wood Portal</h1>
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

const WORKER_TYPES: WorkerType[] = [
  'Designer',
  'Cabinet Maker',
  'Installer',
  'Installer Helper',
  'Sales',
  'Manager',
  'Accounting',
  'Subcontractor',
  'Countertop Subcontractor',
  'Other',
];

const EMPLOYMENT_TYPES: EmploymentType[] = [
  'Work by hour',
  'Work by case',
  'Work by piece',
  'Work by contract',
  'Subcontract',
  'Salary',
  'Commission',
  'Other',
];

const TASK_FOCUSED_ROLES = [
  'Designer',
  'Worker',
  'Cabinet Maker',
  'Installer',
  'Installer Helper',
  'Subcontractor',
  'Countertop Subcontractor',
];

const PERMISSION_ALIASES: Record<string, string[]> = {
  view_catalog: ['view_catalog', 'view_products'],
  view_production_tasks: ['view_production_tasks', 'view_tasks', 'Order Tasks'],
  complete_tasks: ['complete_tasks', 'Complete Tasks', 'complete tasks'],
  view_all_orders: ['view_all_orders', 'All Orders'],
  view_store_orders: ['view_store_orders', 'Store Orders'],
  view_payment: ['view_payment', 'Payment'],
  view_credit: ['view_credit', 'Credit'],
  view_drawings: ['view_drawings', 'Drawing'],
  upload_files: ['upload_files', 'Upload'],
  view_customer_phone: ['view_customer_phone', 'Phone', 'Cell'],
  view_customer_email: ['view_customer_email', 'Email'],
  view_customer_address: ['view_customer_address', 'Address'],
};

const isPermissionEnabled = (value: unknown) =>
  value === true || value === 'true' || value === 1 || value === '1';

const getPermissionType = (permission: string) => {
  if (permission.startsWith('view_')) return 'view';
  if (permission.startsWith('create_')) return 'create';
  if (permission.startsWith('edit_')) return 'edit';
  if (permission.startsWith('delete_')) return 'delete';
  if (permission.startsWith('manage_')) return 'manage';
  if (permission.includes('payment') || permission.includes('payroll')) return 'financial';
  return 'other';
};

const getPermissionTypeLabel = (permission: string) => {
  const type = getPermissionType(permission);

  const labels: Record<string, string> = {
    view: 'View',
    create: 'Create',
    edit: 'Edit',
    delete: 'Delete',
    manage: 'Manage',
    financial: 'Financial',
    other: 'Other',
  };

  return labels[type] || 'Other';
};

const getPermissionTypeClasses = (permission: string) => {
  const type = getPermissionType(permission);

  const classes: Record<string, string> = {
    view: 'bg-blue-50 text-blue-700 border-blue-200',
    create: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    edit: 'bg-amber-50 text-amber-700 border-amber-200',
    delete: 'bg-red-50 text-red-700 border-red-200',
    manage: 'bg-violet-50 text-violet-700 border-violet-200',
    financial: 'bg-slate-100 text-slate-800 border-slate-300',
    other: 'bg-slate-50 text-slate-600 border-slate-200',
  };

  return classes[type] || classes.other;
};

const formatPermissionLabel = (permission: string) => {
  return permission
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const formatMoney = (value?: number) => {
  return `$${Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatDate = (value?: string) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
};

const formatTaxRate = (value?: number) => {
  return `${(Number(value || 0) * 100).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}%`;
};

const App: React.FC = () => {
  // --- Central Data Store ---
  const [dbStores, setDbStores] = useState<StoreInfo[]>([]);
  const [storesLoading, setStoresLoading] = useState(false);
  const [storesError, setStoresError] = useState('');
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState('');
  const [dbCustomers, setDbCustomers] = useState<Customer[]>([]);
  const [dbLeads, setDbLeads] = useState<Lead[]>([]);
  const [dbQuotes, setDbQuotes] = useState<Quote[]>([]);
  const [quotesLoading, setQuotesLoading] = useState(false);
  const [quotesError, setQuotesError] = useState('');
  const [firestoreOrders, setFirestoreOrders] = useState<FirestoreOrder[]>([]);
  const [firestoreProductionTasks, setFirestoreProductionTasks] = useState<FirestoreProductionTask[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [stockMovementsLoading, setStockMovementsLoading] = useState(false);
  const [stockMovementsError, setStockMovementsError] = useState('');
  const [inventoryActionLoadingOrderId, setInventoryActionLoadingOrderId] = useState<string | null>(null);
  const [dbTeamMembers, setDbTeamMembers] = useState<TeamMember[]>([]);
  const [teamMembersLoading, setTeamMembersLoading] = useState(false);
  const [teamMembersError, setTeamMembersError] = useState('');
  const [showTeamMemberModal, setShowTeamMemberModal] = useState(false);
  const [editingTeamMemberId, setEditingTeamMemberId] = useState<string | null>(null);
  const [teamMemberTypeFilter, setTeamMemberTypeFilter] = useState<WorkerType | 'All'>('All');
  const [newTeamMemberData, setNewTeamMemberData] = useState({
    displayName: '',
    email: '',
    phone: '',
    role: 'CabinetMaker',
    permissionsRole: 'Worker',
    workerType: 'Cabinet Maker' as WorkerType,
    employmentType: 'Work by hour' as EmploymentType,
    storeId: '',
    status: 'Active' as 'Active' | 'Inactive',
    canLogin: false,
    linkedUserId: '',
    hourlyRate: '0',
    pieceRate: '0',
    caseRate: '0',
    contractRate: '0',
    commissionRate: '0',
    notes: '',
  });
  const [customerLeadLoading, setCustomerLeadLoading] = useState(false);
  const [customerLeadError, setCustomerLeadError] = useState('');
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadStatusFilter, setLeadStatusFilter] = useState<LeadStatus | 'All'>('All');
  const [newLeadData, setNewLeadData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    customerAddress: '',
    city: '',
    province: 'ON',
    postalCode: '',
    projectAddress: '',
    projectType: 'Kitchen Cabinet',
    source: 'info@51wood.ca',
    status: 'New' as LeadStatus,
    budget: '',
    timeline: '',
    notes: '',
    assignedStoreId: '',
  });
  const [dbOrders, setDbOrders] = useState<Order[]>(mockDatabase.orders as Order[]);
  const [dbProductionTasks, setDbProductionTasks] = useState<ProductionTasks[]>(mockDatabase.productionTasks);
  const [dbRoles, setDbRoles] = useState<RoleRecord[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [rolesError, setRolesError] = useState('');

  const loadRoles = useCallback(async () => {
    setRolesLoading(true);
    setRolesError('');

    try {
      const roles = await getRoles();

      if (roles.length > 0) {
        setDbRoles(roles);
      } else {
        setDbRoles(mockDatabase.roles as RoleRecord[]);
      }
    } catch (err) {
      console.error('Failed to load roles:', err);
      setRolesError('Could not load roles from Firebase.');
      setDbRoles(mockDatabase.roles as RoleRecord[]);
    } finally {
      setRolesLoading(false);
    }
  }, []);

  const loadStores = useCallback(async () => {
    setStoresLoading(true);
    setStoresError('');

    try {
      const stores = await getStores();

      if (stores.length > 0) {
        setDbStores(stores);
      } else {
        setDbStores(mockDatabase.stores as StoreInfo[]);
      }
    } catch (err) {
      console.error('Failed to load stores:', err);
      setStoresError('Could not load stores from Firebase.');
      setDbStores(mockDatabase.stores as StoreInfo[]);
    } finally {
      setStoresLoading(false);
    }
  }, []);

  const loadProducts = useCallback(async () => {
    setProductsLoading(true);
    setProductsError('');

    try {
      const products = await getProducts();

      if (products.length > 0) {
        setDbProducts(products);
      } else {
        setDbProducts(mockDatabase.products as Product[]);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
      setProductsError('Could not load products from Firebase.');
      setDbProducts(mockDatabase.products as Product[]);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  const loadCustomersAndLeads = useCallback(async () => {
    setCustomerLeadLoading(true);
    setCustomerLeadError('');

    try {
      const [customers, leads] = await Promise.all([
        getCustomers(),
        getLeads(),
      ]);

      setDbCustomers(customers);
      setDbLeads(leads);
    } catch (err) {
      console.error('Failed to load customers/leads:', err);
      setCustomerLeadError('Could not load customers and leads from Firebase.');
    } finally {
      setCustomerLeadLoading(false);
    }
  }, []);

  const loadQuotes = useCallback(async () => {
    setQuotesLoading(true);
    setQuotesError('');

    try {
      const quotes = await getQuotes();
      setDbQuotes(quotes);
    } catch (err) {
      console.error('Failed to load quotes:', err);
      setQuotesError('Could not load quotes from Firebase.');
    } finally {
      setQuotesLoading(false);
    }
  }, []);

  const loadTeamMembers = useCallback(async () => {
    setTeamMembersLoading(true);
    setTeamMembersError('');

    try {
      const members = await getTeamMembers();
      setDbTeamMembers(members);
    } catch (err) {
      console.error('Failed to load team members:', err);
      setTeamMembersError('Could not load HR / Labor records from Firebase.');
    } finally {
      setTeamMembersLoading(false);
    }
  }, []);

  const loadOrdersAndTasks = useCallback(async () => {
    setOrdersLoading(true);
    setOrdersError('');

    try {
      const orders = await getOrders();
      setFirestoreOrders(orders);
    } catch (err) {
      console.error('Failed to load orders:', err);
      setOrdersError('Could not load orders from Firebase.');
    }

    try {
      const tasks = await getProductionTasks();
      setFirestoreProductionTasks(tasks);
    } catch (err) {
      console.error('Failed to load production tasks:', err);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  const loadStockMovements = useCallback(async () => {
    setStockMovementsLoading(true);
    setStockMovementsError('');

    try {
      const movements = await getStockMovements();
      setStockMovements(movements);
    } catch (err) {
      console.error('Failed to load stock movements:', err);
      setStockMovementsError('Could not load stock movement history from Firebase.');
    } finally {
      setStockMovementsLoading(false);
    }
  }, []);

  // --- Auth & Navigation ---
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeView, setActiveView] = useState('Dashboard');
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [selectedQuoteId, setSelectedQuoteId] = useState('');
  const [selectedLeadIdForDetail, setSelectedLeadIdForDetail] = useState('');
  const [selectedCustomerIdForDetail, setSelectedCustomerIdForDetail] = useState('');
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

        if (TASK_FOCUSED_ROLES.includes(profile.role)) {
          setActiveView('TaskManager');
        } else {
          setActiveView('Dashboard');
        }

        await loadRoles();
        await loadStores();
        await loadProducts();
        await loadCustomersAndLeads();
        await loadQuotes();
        await loadTeamMembers();
        await loadOrdersAndTasks();
        await loadStockMovements();
        setAuthLoading(false);
      } catch (err) {
        console.error('Failed to load user profile:', err);
        await logoutUser();
        setCurrentUser(null);
        setAuthLoading(false);
      }
    });

    return () => unsubscribe();
  }, [loadRoles, loadStores, loadProducts, loadCustomersAndLeads, loadQuotes, loadTeamMembers, loadOrdersAndTasks, loadStockMovements]);

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
  const [selectedLeadId, setSelectedLeadId] = useState('');
  const [quoteNotes, setQuoteNotes] = useState('');
  const [quoteDiscount, setQuoteDiscount] = useState('0');
  const [quoteTaxRate, setQuoteTaxRate] = useState('0.13');
  const [clientInfo, setClientInfo] = useState({ 
    store_id: '', 
    managerName: '', 
    firstName: '', 
    lastName: '', 
    cellPhone: '', 
    email: '', 
    address: '' 
  });

  useEffect(() => {
    if (dbStores.length === 0) return;

    const preferredId = currentUser?.storeId || clientInfo.store_id;
    const selected = dbStores.find((store) => store.id === preferredId) || dbStores[0];

    if (
      selected &&
      (clientInfo.store_id !== selected.id || clientInfo.managerName !== selected.manager_name)
    ) {
      setClientInfo((prev) => ({
        ...prev,
        store_id: selected.id,
        managerName: selected.manager_name,
      }));
    }
  }, [dbStores, currentUser?.storeId]);

  useEffect(() => {
    if (!newLeadData.assignedStoreId && dbStores.length > 0) {
      setNewLeadData((prev) => ({
        ...prev,
        assignedStoreId: dbStores[0].id,
      }));
    }
  }, [dbStores, newLeadData.assignedStoreId]);

  useEffect(() => {
    if (!newTeamMemberData.storeId && dbStores.length > 0) {
      setNewTeamMemberData((prev) => ({
        ...prev,
        storeId: dbStores[0].id,
      }));
    }
  }, [dbStores, newTeamMemberData.storeId]);

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

    const roleName = currentUser.role?.trim();
    if (!roleName) return null;

    const role = dbRoles.find(
      (r) => r.name === roleName || r.id === roleName
    );

    return role?.permissions || {};
  }, [currentUser, dbRoles]);

  const hasPermission = (permission: string) => {
    if (currentUser?.role === 'SuperAdmin') return true;
    if (!currentUserRolePermissions) return false;
    if (isPermissionEnabled(currentUserRolePermissions[permission])) return true;

    const aliases = PERMISSION_ALIASES[permission] || [permission];
    return aliases.some((key) => isPermissionEnabled(currentUserRolePermissions[key]));
  };

  const canAccess = (roles: UserRole[]) => currentUser && roles.includes(currentUser.role);

  const handleLogin = async (user: UserProfile) => {
    setCurrentUser(user);
    if (TASK_FOCUSED_ROLES.includes(user.role)) {
      setActiveView('TaskManager');
    } else {
      setActiveView('Dashboard');
    }
    await loadRoles();
    await loadStores();
    await loadProducts();
    await loadCustomersAndLeads();
    await loadQuotes();
    await loadTeamMembers();
    await loadOrdersAndTasks();
    await loadStockMovements();
  };

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
    setActiveView('Dashboard');
  };

  // --- EXECUTIVE > ACCESS CONTROL Logic ---
  const togglePermission = async (roleId: string, permissionName: string) => {
    const role = dbRoles.find((r) => r.id === roleId);
    if (!role) return;

    const nextPermissions = {
      ...role.permissions,
      [permissionName]: !role.permissions?.[permissionName],
    };

    setDbRoles((prev) =>
      prev.map((r) =>
        r.id === roleId ? { ...r, permissions: nextPermissions } : r
      )
    );

    try {
      await updateRolePermissions(roleId, nextPermissions);
    } catch (err) {
      console.error('Failed to update role permissions:', err);
      alert('Could not save permission change. Please refresh and try again.');
      await loadRoles();
    }
  };

  const handleAddRole = async () => {
    const trimmedName = newRoleName.trim();

    if (!trimmedName) {
      alert('Role name is required.');
      return;
    }

    const permissions =
      editingRoleId
        ? dbRoles.find((role) => role.id === editingRoleId)?.permissions || {}
        : PERMISSION_COLUMNS.reduce(
            (acc, col) => ({ ...acc, [col]: false }),
            {} as Record<string, boolean>
          );

    const roleToSave = {
      id: trimmedName,
      name: trimmedName,
      permissions,
    };

    try {
      await saveRole(roleToSave);

      if (editingRoleId && editingRoleId !== trimmedName) {
        await deleteRole(editingRoleId);
      }

      await loadRoles();
      setEditingRoleId(null);
      setNewRoleName('');
      setShowRoleModal(false);
    } catch (err) {
      console.error('Failed to save role:', err);
      alert('Could not save role. Please try again.');
    }
  };

  const handleEditRole = (role: RoleRecord) => {
    setNewRoleName(role.name);
    setEditingRoleId(role.id);
    setShowRoleModal(true);
  };

  const handleDeleteRole = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this role? This might affect existing users.')) {
      return;
    }

    try {
      await deleteRole(id);
      await loadRoles();
    } catch (err) {
      console.error('Failed to delete role:', err);
      alert('Could not delete role. Please try again.');
    }
  };

  // --- EXECUTIVE > STORES Logic ---
  const handleAddStore = async () => {
    if (!newStoreData.name || !newStoreData.manager) {
      alert('Fill required fields.');
      return;
    }

    const newStore: StoreInfo = {
      id: `S${Date.now()}`,
      store_name: newStoreData.name.trim(),
      manager_name: newStoreData.manager.trim(),
      address: newStoreData.address.trim() || 'TBD',
      commissionRate: Number(newStoreData.commission || 0),
      status: 'Active',
    };

    try {
      await saveStore(newStore);
      await loadStores();
      setNewStoreData({ name: '', manager: '', address: '', commission: '10' });
      setShowStoreModal(false);
    } catch (err) {
      console.error('Failed to save store:', err);
      alert('Could not save store. Please try again.');
    }
  };

  const handleDeleteStore = async (storeId: string) => {
    if (!window.confirm('Are you sure you want to delete this store?')) {
      return;
    }

    try {
      await deleteStore(storeId);
      await loadStores();
    } catch (err) {
      console.error('Failed to delete store:', err);
      alert('Could not delete store. Please try again.');
    }
  };

  // --- PRODUCTION > CATALOG Logic ---
  const handleAddProduct = async () => {
    if (!newProductData.name || !newProductData.sku) {
      alert('Fill SKU and Name.');
      return;
    }

    const newProd: Product = {
      id: newProductData.sku.trim(),
      sku: newProductData.sku.trim(),
      name: newProductData.name.trim(),
      base_price: parseFloat(newProductData.price) || 0,
      unit: 'Piece',
      dimensions: { w: '0', h: '0', d: '0' },
      modifications: [],
      category: newProductData.category,
      stockLevel: parseInt(newProductData.stock, 10) || 0,
      minStock: 5,
      supplier: newProductData.supplier || 'Standard',
      status: 'Active',
    };

    try {
      await saveProduct(newProd);
      await loadProducts();
      setNewProductData({
        name: '',
        sku: '',
        category: 'Hardware',
        price: '0',
        stock: '10',
        supplier: 'Standard',
      });
      setShowProductModal(false);
    } catch (err) {
      console.error('Failed to save product:', err);
      alert('Could not save product. Please try again.');
    }
  };

  const handleCreateLead = async () => {
    if (!newLeadData.firstName || !newLeadData.lastName || !newLeadData.phone || !newLeadData.projectAddress) {
      alert('First name, last name, phone, and project address are required.');
      return;
    }

    const assignedStore = dbStores.find((store) => store.id === newLeadData.assignedStoreId);

    try {
      await createCustomerAndLead({
        ...newLeadData,
        assignedManager: assignedStore?.manager_name || '',
        createdBy: currentUser?.id || '',
      });

      await loadCustomersAndLeads();

      setNewLeadData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        customerAddress: '',
        city: '',
        province: 'ON',
        postalCode: '',
        projectAddress: '',
        projectType: 'Kitchen Cabinet',
        source: 'info@51wood.ca',
        status: 'New',
        budget: '',
        timeline: '',
        notes: '',
        assignedStoreId: dbStores[0]?.id || '',
      });

      setShowLeadModal(false);
    } catch (err) {
      console.error('Failed to create lead:', err);
      alert('Could not create lead. Please try again.');
    }
  };

  const handleLeadStatusChange = async (leadId: string, status: LeadStatus) => {
    setDbLeads((prev) =>
      prev.map((lead) =>
        lead.id === leadId ? { ...lead, status } : lead
      )
    );

    try {
      await updateLeadStatus(leadId, status);
    } catch (err) {
      console.error('Failed to update lead status:', err);
      alert('Could not update lead status. Please refresh and try again.');
      await loadCustomersAndLeads();
    }
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

  const processImport = async () => {
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
      const sku = row[skuIdx] || `SKU-${idx}`;
      
      return {
        id: sku,
        name: row[nameIdx] || 'Unnamed Product',
        sku,
        base_price: isNaN(priceVal) ? 0 : priceVal,
        stockLevel: isNaN(stockVal) ? 0 : stockVal,
        category: categoryIdx !== -1 ? row[categoryIdx] : 'Other',
        supplier: supplierIdx !== -1 ? row[supplierIdx] : 'Standard',
        unit: 'Piece',
        dimensions: { w: '0', h: '0', d: '0' },
        modifications: [],
        minStock: 5,
        status: 'Active',
      };
    });

    try {
      await Promise.all(importedProducts.map((product) => saveProduct(product)));
      await loadProducts();
      setShowImportModal(false);
      alert(`Successfully imported ${importedProducts.length} items to catalog.`);
    } catch (err) {
      console.error('Failed to import products:', err);
      alert('Could not import products. Please check the CSV and try again.');
    }
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

  const handleSelectLeadForQuote = (leadId: string) => {
    setSelectedLeadId(leadId);

    const lead = dbLeads.find((item) => item.id === leadId);
    if (!lead) return;

    const nameParts = lead.customerName.split(' ');

    setClientInfo((prev) => ({
      ...prev,
      store_id: lead.assignedStoreId || prev.store_id,
      managerName: lead.assignedManager || prev.managerName,
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      cellPhone: lead.phone || '',
      email: lead.email || '',
      address: lead.projectAddress || '',
    }));
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

  const quoteTotals = useMemo(() => {
    const subtotal = lineItems.reduce(
      (sum, item) => sum + item.product.base_price * item.quantity,
      0
    );

    const discount = Number(quoteDiscount || 0);
    const taxRate = Number(quoteTaxRate || 0);
    const taxableAmount = Math.max(subtotal - discount, 0);
    const taxAmount = taxableAmount * taxRate;
    const total = taxableAmount + taxAmount;

    return {
      subtotal,
      discount,
      taxRate,
      taxAmount,
      total,
    };
  }, [lineItems, quoteDiscount, quoteTaxRate]);

  const validateQuoteStep1 = () => {
    if (!clientInfo.firstName || !clientInfo.lastName || !clientInfo.cellPhone || !clientInfo.address) {
      alert('Required: First Name, Last Name, Cell Phone, and Project Address.');
      return;
    }
    setQuoteStep(2);
  };

  const handleSubmitQuote = async () => {
    if (lineItems.length === 0) {
      alert('No items selected.');
      return;
    }

    if (!clientInfo.firstName || !clientInfo.lastName || !clientInfo.cellPhone || !clientInfo.address) {
      alert('Required: customer name, cell phone, and project address.');
      return;
    }

    const selectedLead = dbLeads.find((lead) => lead.id === selectedLeadId);
    const customerId = selectedLead?.customerId || `manual-${Date.now()}`;
    const customerName = `${clientInfo.firstName} ${clientInfo.lastName}`.trim();

    try {
      await createQuote({
        quoteNumber: generateQuoteNumber(),
        customerId,
        leadId: selectedLeadId || '',
        customerName,
        customerEmail: clientInfo.email || '',
        customerPhone: clientInfo.cellPhone,
        projectAddress: clientInfo.address,
        storeId: clientInfo.store_id,
        managerName: clientInfo.managerName,
        lineItems: lineItems.map((item): QuoteItem =>
          makeQuoteItem(
            {
              id: item.product.id,
              sku: item.product.sku,
              name: item.product.name,
              category: item.product.category,
              unit: item.product.unit,
              base_price: item.product.base_price,
            },
            item.quantity
          )
        ),
        subtotal: quoteTotals.subtotal,
        discount: quoteTotals.discount,
        taxRate: quoteTotals.taxRate,
        taxAmount: quoteTotals.taxAmount,
        total: quoteTotals.total,
        status: 'Draft',
        notes: quoteNotes,
        createdBy: currentUser?.id || '',
      });

      if (selectedLeadId) {
        await updateLeadStatus(selectedLeadId, 'Quoted');
      }

      await Promise.all([
        loadQuotes(),
        loadCustomersAndLeads(),
      ]);

      setLineItems([]);
      setQuoteStep(1);
      setSelectedLeadId('');
      setQuoteNotes('');
      setQuoteDiscount('0');
      setQuoteTaxRate('0.13');
      setClientInfo({
        store_id: dbStores[0]?.id || '',
        managerName: dbStores[0]?.manager_name || '',
        firstName: '',
        lastName: '',
        cellPhone: '',
        email: '',
        address: '',
      });

      alert('Quote saved successfully.');
    } catch (err) {
      console.error('Failed to save quote:', err);
      alert('Could not save quote. Please try again.');
    }
  };

  const handleQuoteStatusChange = async (quoteId: string, status: QuoteStatus) => {
    setDbQuotes((prev) =>
      prev.map((quote) =>
        quote.id === quoteId ? { ...quote, status } : quote
      )
    );

    try {
      await updateQuoteStatus(quoteId, status);
    } catch (err) {
      console.error('Failed to update quote status:', err);
      alert('Could not update quote status. Please refresh and try again.');
      await loadQuotes();
    }
  };

  const handlePrintQuote = () => {
    window.print();
  };

  const handleMarkQuoteAsSent = async (quoteId: string) => {
    try {
      await updateQuoteStatus(quoteId, 'Sent');
      await loadQuotes();
      alert('Quote marked as sent.');
    } catch (err) {
      console.error('Failed to mark quote as sent:', err);
      alert('Could not update quote status. Please try again.');
    }
  };

  const handleConvertQuoteToOrder = async (quote: Quote) => {
    if (quote.status !== 'Accepted') {
      alert('Only accepted quotes can be converted to orders.');
      return;
    }

    if (!window.confirm(`Convert quote ${quote.quoteNumber} to an order?`)) {
      return;
    }

    try {
      const result = await convertQuoteToOrder(quote, currentUser?.id || '');

      await Promise.all([
        loadQuotes(),
        loadOrdersAndTasks(),
      ]);

      alert(`Order ${result.orderNumber} created successfully.`);
    } catch (err: any) {
      console.error('Failed to convert quote:', err);
      alert(err?.message || 'Could not convert quote to order. Please try again.');
    }
  };

  const handleOrderStatusChange = async (
    orderId: string,
    status: OrderStatusV2
  ) => {
    setFirestoreOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );

    try {
      await updateOrderStatus(orderId, status);
    } catch (err) {
      console.error('Failed to update order status:', err);
      alert('Could not update order status. Please refresh and try again.');
      await loadOrdersAndTasks();
    }
  };

  const handlePaymentStatusChange = async (
    orderId: string,
    paymentStatus: PaymentStatus
  ) => {
    setFirestoreOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, paymentStatus } : order
      )
    );

    try {
      await updatePaymentStatus(orderId, paymentStatus);
    } catch (err) {
      console.error('Failed to update payment status:', err);
      alert('Could not update payment status. Please refresh and try again.');
      await loadOrdersAndTasks();
    }
  };

  const handleProductionStatusChange = async (
    orderId: string,
    productionStatus: ProductionStatus
  ) => {
    setFirestoreOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, productionStatus } : order
      )
    );

    try {
      await updateProductionStatus(orderId, productionStatus);
    } catch (err) {
      console.error('Failed to update production status:', err);
      alert('Could not update production status. Please refresh and try again.');
      await loadOrdersAndTasks();
    }
  };

  const getAssignableTeamMembers = (taskType: string) => {
    return dbTeamMembers.filter((member) => {
      if (member.status !== 'Active') return false;

      if (taskType === 'Design') {
        return member.workerType === 'Designer';
      }

      if (taskType === 'Production') {
        return (
          member.workerType === 'Cabinet Maker' ||
          member.workerType === 'Subcontractor'
        );
      }

      if (taskType === 'Installation') {
        return (
          member.workerType === 'Installer' ||
          member.workerType === 'Installer Helper' ||
          member.workerType === 'Subcontractor'
        );
      }

      if (taskType === 'Quality') {
        return (
          member.workerType === 'Manager' ||
          member.workerType === 'Cabinet Maker'
        );
      }

      if (taskType === 'Logistics') {
        return (
          member.workerType === 'Installer' ||
          member.workerType === 'Installer Helper'
        );
      }

      return true;
    });
  };

  const handleUpdateProductionTaskItem = async (
    productionTaskId: string,
    orderId: string,
    taskItemId: string,
    changes: Partial<FirestoreTaskItem>
  ) => {
    const productionTask = firestoreProductionTasks.find(
      (item) => item.id === productionTaskId
    );

    if (!productionTask) return;

    const nextTasks = productionTask.tasks.map((task) => {
      if (task.id !== taskItemId) return task;

      const nextTask = {
        ...task,
        ...changes,
      };

      if (changes.isComplete === true && !task.completedAt) {
        nextTask.completedAt = new Date().toISOString();
      }

      if (changes.isComplete === false) {
        nextTask.completedAt = '';
      }

      return nextTask;
    });

    setFirestoreProductionTasks((prev) =>
      prev.map((item) =>
        item.id === productionTaskId
          ? { ...item, tasks: nextTasks }
          : item
      )
    );

    try {
      await updateProductionTaskItems({
        productionTaskId,
        orderId,
        tasks: nextTasks,
      });

      await loadOrdersAndTasks();
    } catch (err) {
      console.error('Failed to update production task:', err);
      alert('Could not update production task. Please refresh and try again.');
      await loadOrdersAndTasks();
    }
  };

  const handleAssignTask = async (
    productionTaskId: string,
    orderId: string,
    taskItem: FirestoreTaskItem,
    teamMemberId: string
  ) => {
    const assignedMember = dbTeamMembers.find(
      (member) => member.id === teamMemberId
    );

    await handleUpdateProductionTaskItem(
      productionTaskId,
      orderId,
      taskItem.id,
      {
        assignedTeamMemberId: assignedMember?.id || '',
        assignedTeamMemberName: assignedMember?.displayName || '',
      }
    );
  };

  const handleDraftProductionTaskItem = (
    productionTaskId: string,
    taskItemId: string,
    changes: Partial<FirestoreTaskItem>
  ) => {
    setFirestoreProductionTasks((prev) =>
      prev.map((item) =>
        item.id === productionTaskId
          ? {
              ...item,
              tasks: item.tasks.map((task) =>
                task.id === taskItemId ? { ...task, ...changes } : task
              ),
            }
          : item
      )
    );
  };

  const resetTeamMemberForm = () => {
    setEditingTeamMemberId(null);
    setNewTeamMemberData({
      displayName: '',
      email: '',
      phone: '',
      role: 'CabinetMaker',
      permissionsRole: 'Worker',
      workerType: 'Cabinet Maker',
      employmentType: 'Work by hour',
      storeId: dbStores[0]?.id || '',
      status: 'Active',
      canLogin: false,
      linkedUserId: '',
      hourlyRate: '0',
      pieceRate: '0',
      caseRate: '0',
      contractRate: '0',
      commissionRate: '0',
      notes: '',
    });
  };

  const handleSaveTeamMember = async () => {
    if (!newTeamMemberData.displayName.trim()) {
      alert('Name is required.');
      return;
    }

    const payload = {
      displayName: newTeamMemberData.displayName.trim(),
      email: newTeamMemberData.email.trim(),
      phone: newTeamMemberData.phone.trim(),
      role: newTeamMemberData.role.trim(),
      permissionsRole: newTeamMemberData.permissionsRole,
      workerType: newTeamMemberData.workerType,
      employmentType: newTeamMemberData.employmentType,
      storeId: newTeamMemberData.storeId,
      status: newTeamMemberData.status,
      canLogin: newTeamMemberData.canLogin,
      linkedUserId: newTeamMemberData.linkedUserId.trim(),
      hourlyRate: Number(newTeamMemberData.hourlyRate || 0),
      pieceRate: Number(newTeamMemberData.pieceRate || 0),
      caseRate: Number(newTeamMemberData.caseRate || 0),
      contractRate: Number(newTeamMemberData.contractRate || 0),
      commissionRate: Number(newTeamMemberData.commissionRate || 0),
      notes: newTeamMemberData.notes.trim(),
      createdBy: currentUser?.id || '',
    };

    try {
      if (editingTeamMemberId) {
        const existing = dbTeamMembers.find((member) => member.id === editingTeamMemberId);

        await updateTeamMember(editingTeamMemberId, {
          ...payload,
          createdAt: existing?.createdAt || '',
        });
      } else {
        await createTeamMember(payload);
      }

      await loadTeamMembers();
      resetTeamMemberForm();
      setShowTeamMemberModal(false);
    } catch (err) {
      console.error('Failed to save team member:', err);
      alert('Could not save HR / Labor record. Please try again.');
    }
  };

  const handleEditTeamMember = (member: TeamMember) => {
    setEditingTeamMemberId(member.id);
    setNewTeamMemberData({
      displayName: member.displayName,
      email: member.email || '',
      phone: member.phone || '',
      role: member.role || '',
      permissionsRole: member.permissionsRole || member.role || 'Worker',
      workerType: member.workerType || 'Other',
      employmentType: member.employmentType || 'Other',
      storeId: member.storeId || dbStores[0]?.id || '',
      status: member.status || 'Active',
      canLogin: member.canLogin === true,
      linkedUserId: member.linkedUserId || '',
      hourlyRate: String(member.hourlyRate || 0),
      pieceRate: String(member.pieceRate || 0),
      caseRate: String(member.caseRate || 0),
      contractRate: String(member.contractRate || 0),
      commissionRate: String(member.commissionRate || 0),
      notes: member.notes || '',
    });
    setShowTeamMemberModal(true);
  };

  const handleDeleteTeamMember = async (memberId: string) => {
    if (!window.confirm('Are you sure you want to delete this HR / Labor record?')) {
      return;
    }

    try {
      await deleteTeamMember(memberId);
      await loadTeamMembers();
    } catch (err) {
      console.error('Failed to delete team member:', err);
      alert('Could not delete HR / Labor record. Please try again.');
    }
  };

  const handleTeamMemberStatusChange = async (
    memberId: string,
    status: 'Active' | 'Inactive'
  ) => {
    setDbTeamMembers((prev) =>
      prev.map((member) =>
        member.id === memberId ? { ...member, status } : member
      )
    );

    try {
      await updateTeamMember(memberId, { status });
    } catch (err) {
      console.error('Failed to update team member status:', err);
      alert('Could not update status. Please refresh and try again.');
      await loadTeamMembers();
    }
  };

  const filteredTeamMembers = useMemo(() => {
    return dbTeamMembers.filter((member) => {
      if (teamMemberTypeFilter === 'All') return true;
      return member.workerType === teamMemberTypeFilter;
    });
  }, [dbTeamMembers, teamMemberTypeFilter]);

  const getTeamMemberRateLabel = (member: TeamMember) => {
    switch (member.employmentType) {
      case 'Work by hour':
        return `$${(member.hourlyRate || 0).toFixed(2)}/hr`;
      case 'Work by piece':
        return `$${(member.pieceRate || 0).toFixed(2)}/pc`;
      case 'Work by case':
        return `$${(member.caseRate || 0).toFixed(2)}/case`;
      case 'Work by contract':
      case 'Subcontract':
        return `$${(member.contractRate || 0).toFixed(2)}`;
      case 'Commission':
        return `${member.commissionRate || 0}%`;
      default:
        return '—';
    }
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

  const filteredFirestoreProductionTasks = useMemo(() => {
    return firestoreProductionTasks.filter((task) => {
      const matchesStatus = tmFilter === 'All' || task.status === tmFilter;
      const matchesStore = !currentUser?.storeId || task.storeId === currentUser.storeId;
      return matchesStatus && matchesStore;
    });
  }, [firestoreProductionTasks, tmFilter, currentUser]);

  const filteredLeads = useMemo(() => {
    return dbLeads.filter((lead) => {
      if (leadStatusFilter === 'All') return true;
      return lead.status === leadStatusFilter;
    });
  }, [dbLeads, leadStatusFilter]);

  const openOrderDetail = (orderId: string) => {
    setSelectedOrderId(orderId);
    setActiveView('OrderDetail');
  };

  const openQuoteDetail = (quoteId: string) => {
    setSelectedQuoteId(quoteId);
    setActiveView('QuoteDetail');
  };

  const openCustomerLeadDetail = ({
    leadId,
    customerId,
  }: {
    leadId?: string;
    customerId?: string;
  }) => {
    setSelectedLeadIdForDetail(leadId || '');
    setSelectedCustomerIdForDetail(customerId || '');
    setActiveView('CustomerLeadDetail');
  };

  const selectedOrderDetail = useMemo(() => {
    return firestoreOrders.find((order) => order.id === selectedOrderId) || null;
  }, [firestoreOrders, selectedOrderId]);

  const selectedOrderQuote = useMemo(() => {
    if (!selectedOrderDetail?.quoteId) return null;
    return dbQuotes.find((quote) => quote.id === selectedOrderDetail.quoteId) || null;
  }, [dbQuotes, selectedOrderDetail]);

  const selectedQuoteDetail = useMemo(() => {
    return dbQuotes.find((quote) => quote.id === selectedQuoteId) || null;
  }, [dbQuotes, selectedQuoteId]);

  const selectedQuoteCustomer = useMemo(() => {
    if (!selectedQuoteDetail?.customerId) return null;
    return (
      dbCustomers.find(
        (customer) => customer.id === selectedQuoteDetail.customerId
      ) || null
    );
  }, [dbCustomers, selectedQuoteDetail]);

  const selectedQuoteLead = useMemo(() => {
    if (!selectedQuoteDetail?.leadId) return null;
    return dbLeads.find((lead) => lead.id === selectedQuoteDetail.leadId) || null;
  }, [dbLeads, selectedQuoteDetail]);

  const selectedOrderProductionTask = useMemo(() => {
    if (!selectedOrderDetail?.id) return null;
    return (
      firestoreProductionTasks.find(
        (task) => task.orderId === selectedOrderDetail.id
      ) || null
    );
  }, [firestoreProductionTasks, selectedOrderDetail]);

  const selectedOrderStockMovements = useMemo(() => {
    if (!selectedOrderDetail?.id) return [];
    return stockMovements.filter(
      (movement) => movement.orderId === selectedOrderDetail.id
    );
  }, [stockMovements, selectedOrderDetail]);

  const selectedLeadDetail = useMemo(() => {
    return dbLeads.find((lead) => lead.id === selectedLeadIdForDetail) || null;
  }, [dbLeads, selectedLeadIdForDetail]);

  const selectedCustomerDetail = useMemo(() => {
    const customerId =
      selectedCustomerIdForDetail || selectedLeadDetail?.customerId || '';

    if (!customerId) return null;

    return dbCustomers.find((customer) => customer.id === customerId) || null;
  }, [dbCustomers, selectedCustomerIdForDetail, selectedLeadDetail]);

  const selectedCustomerQuotes = useMemo(() => {
    const customerId = selectedCustomerDetail?.id || selectedLeadDetail?.customerId || '';
    if (!customerId) return [];
    return dbQuotes.filter((quote) => quote.customerId === customerId);
  }, [dbQuotes, selectedCustomerDetail, selectedLeadDetail]);

  const selectedCustomerOrders = useMemo(() => {
    const customerId = selectedCustomerDetail?.id || selectedLeadDetail?.customerId || '';
    if (!customerId) return [];
    return firestoreOrders.filter((order) => order.customerId === customerId);
  }, [firestoreOrders, selectedCustomerDetail, selectedLeadDetail]);

  const getStoreName = (storeId?: string) => {
    return dbStores.find((store) => store.id === storeId)?.store_name || storeId || '';
  };

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
  const canViewDataCenter = hasPermission('view_data_center');

  const showDashboard = hasPermission('view_dashboard');
  const showAccessControl = hasPermission('manage_roles');
  const showStores = hasPermission('view_stores');
  const showCustomersLeads = hasPermission('view_customers') || hasPermission('view_leads');
  const showQuoteBuilder = hasPermission('create_quotes');
  const showQuotes = hasPermission('view_quotes');
  const canConvertQuotes = hasPermission('convert_quotes') || currentUser?.role === 'Sales';
  const showOrders = hasPermission('view_orders');
  const showHRLabor = hasPermission('view_hr_labor');
  const canCreateHRLabor = hasPermission('create_team_members');
  const canEditHRLabor = hasPermission('edit_team_members');
  const canDeleteHRLabor = hasPermission('delete_team_members');
  const showTaskManager = hasPermission('view_production_tasks');
  const canAssignProductionTasks =
    currentUser?.role === 'SuperAdmin' ||
    currentUser?.role === 'Manager' ||
    hasPermission('assign_tasks');
  // Completion is driven by role permission, not workerType / Cabinet Maker / Installer hardcoding.
  const canCompleteProductionTasks =
    currentUser?.role === 'SuperAdmin' ||
    currentUser?.role === 'Manager' ||
    hasPermission('complete_tasks');
  const showInventory = hasPermission('view_inventory');
  const canManageInventory =
    currentUser?.role === 'SuperAdmin' ||
    currentUser?.role === 'Manager' ||
    hasPermission('edit_inventory');
  const showCatalog = hasPermission('view_catalog');
  const canViewCustomerPhone =
    currentUser?.role === 'SuperAdmin' || hasPermission('view_customer_phone');
  const canViewCustomerEmail =
    currentUser?.role === 'SuperAdmin' || hasPermission('view_customer_email');
  const canViewCustomerAddress =
    currentUser?.role === 'SuperAdmin' || hasPermission('view_customer_address');
  const canViewQuotePrice =
    currentUser?.role === 'SuperAdmin' || hasPermission('view_quote_price');
  const canViewOrderPayment =
    currentUser?.role === 'SuperAdmin' || hasPermission('view_order_payment');
  const showExecutive = showAccessControl || showStores || canViewDataCenter;
  const showSales = showCustomersLeads || showQuoteBuilder || showQuotes || showOrders;
  const showProduction = showTaskManager || showInventory || showCatalog;

  const handleReserveStockForOrder = async (order: FirestoreOrder) => {
    if (!canManageInventory) {
      alert('You do not have permission to reserve stock.');
      return;
    }

    if (order.inventoryStatus === 'Reserved') {
      alert('Stock is already reserved for this order.');
      return;
    }

    if (order.inventoryStatus === 'Deducted') {
      alert('Stock has already been deducted for this order.');
      return;
    }

    if (!window.confirm(`Reserve stock for order ${order.orderNumber}?`)) {
      return;
    }

    setInventoryActionLoadingOrderId(order.id);

    try {
      await reserveStockForOrder(order, currentUser?.id || '');
      await Promise.all([
        loadOrdersAndTasks(),
        loadStockMovements(),
      ]);
      alert('Stock reserved successfully.');
    } catch (err: any) {
      console.error('Failed to reserve stock:', err);
      alert(err?.message || 'Could not reserve stock.');
    } finally {
      setInventoryActionLoadingOrderId(null);
    }
  };

  const handleDeductStockForOrder = async (order: FirestoreOrder) => {
    if (!canManageInventory) {
      alert('You do not have permission to deduct stock.');
      return;
    }

    if (order.inventoryStatus === 'Deducted') {
      alert('Stock has already been deducted for this order.');
      return;
    }

    if (!window.confirm(`Deduct stock for order ${order.orderNumber}? This will reduce catalog stock levels.`)) {
      return;
    }

    setInventoryActionLoadingOrderId(order.id);

    try {
      await deductStockForOrder(order, currentUser?.id || '');
      await Promise.all([
        loadOrdersAndTasks(),
        loadProducts(),
        loadStockMovements(),
      ]);
      alert('Stock deducted successfully.');
    } catch (err: any) {
      console.error('Failed to deduct stock:', err);
      alert(err?.message || 'Could not deduct stock.');
    } finally {
      setInventoryActionLoadingOrderId(null);
    }
  };

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
            Loading 51Wood Portal
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
      <aside className="no-print w-72 bg-white border-r border-slate-200 p-6 flex flex-col z-50">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0"><Layers size={22} /></div>
          <h1 className="font-black text-lg tracking-tighter">51Wood Portal</h1>
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
                {[
                  showAccessControl && {id:'Users',label:'Access Control',icon:ShieldCheck},
                  showStores && {id:'Stores',label:'Store Network',icon:Building2},
                  canViewDataCenter && {id:'DataCenter',label:'Data Center',icon:Database},
                ].filter(Boolean).map(item => (
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
                {[
                  showCustomersLeads && {id:'CustomersLeads',label:'Customers / Leads',icon:Users},
                  showQuoteBuilder && {id:'Quote',label:'Quote Builder',icon:FilePlus},
                  showQuotes && {id:'Quotes',label:'Quotes',icon:FileText},
                  showOrders && {id:'Orders',label:'Orders',icon:ClipboardList},
                ].filter(Boolean).map(item => (
                  <button key={item.id} onClick={() => setActiveView(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeView === item.id ||
                    (item.id === 'Quotes' && activeView === 'QuoteDetail') ||
                    (item.id === 'Orders' && activeView === 'OrderDetail') ||
                    (item.id === 'CustomersLeads' && activeView === 'CustomerLeadDetail')
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'
                  }`}>
                    <item.icon size={18} /><span className="font-bold text-xs truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {showHRLabor && (
            <div>
              <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">MANAGEMENT</p>
              <div className="space-y-1">
                <button onClick={() => setActiveView('HRLabor')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'HRLabor' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'}`}>
                  <User size={18} /><span className="font-bold text-xs truncate">HR / Labor</span>
                </button>
              </div>
            </div>
          )}

          {showProduction && (
            <div>
              <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">PRODUCTION</p>
              <div className="space-y-1">
                {[
                  showTaskManager && {id:'TaskManager',label:'Task Manager',icon:ListTodo},
                  showInventory && {id:'Inventory',label:'Inventory',icon:Warehouse},
                  showCatalog && {id:'Catalog',label:'Master Catalog',icon:Package},
                ].filter(Boolean).map(item => (
                  <button key={item.id} onClick={() => setActiveView(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'}`}>
                    <item.icon size={18} /><span className="font-bold text-xs truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </nav>
        <div className="pt-6 border-t border-slate-200">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-black text-xs uppercase"><LogOut size={18} /> Logout</button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="no-print h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-10 flex items-center justify-between shrink-0 z-40">
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

          {activeView === 'CustomersLeads' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black uppercase tracking-widest">Customers / Leads</h3>
                <button
                  onClick={() => setShowLeadModal(true)}
                  className="bg-blue-600 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase shadow-lg shadow-blue-100"
                >
                  <Plus size={14} className="inline mr-2" /> New Lead
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {(['All', 'New', 'Contacted', 'Measure Scheduled', 'Quoted', 'Won', 'Lost'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setLeadStatusFilter(status)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      leadStatusFilter === status
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                        : 'bg-white text-slate-400 border border-slate-200 hover:text-blue-600'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              {customerLeadLoading && (
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Loading customers and leads...
                </p>
              )}

              {customerLeadError && (
                <p className="text-sm font-bold text-red-500">
                  {customerLeadError}
                </p>
              )}

              {showLeadModal && (
                <div className="bg-white p-10 rounded-[40px] border border-blue-200 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div className="md:col-span-2 flex justify-between items-center">
                    <h4 className="font-black uppercase text-xs">New Lead from info@51wood.ca</h4>
                    <button onClick={() => setShowLeadModal(false)}><X size={18} /></button>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase">First Name *</label>
                    <input type="text" value={newLeadData.firstName} onChange={(e) => setNewLeadData({ ...newLeadData, firstName: e.target.value })} className="w-full bg-slate-50 border p-3 rounded-xl outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Last Name *</label>
                    <input type="text" value={newLeadData.lastName} onChange={(e) => setNewLeadData({ ...newLeadData, lastName: e.target.value })} className="w-full bg-slate-50 border p-3 rounded-xl outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Phone *</label>
                    <input type="text" value={newLeadData.phone} onChange={(e) => setNewLeadData({ ...newLeadData, phone: e.target.value })} className="w-full bg-slate-50 border p-3 rounded-xl outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Email</label>
                    <input type="email" value={newLeadData.email} onChange={(e) => setNewLeadData({ ...newLeadData, email: e.target.value })} className="w-full bg-slate-50 border p-3 rounded-xl outline-none" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Customer Address</label>
                    <input type="text" value={newLeadData.customerAddress} onChange={(e) => setNewLeadData({ ...newLeadData, customerAddress: e.target.value })} className="w-full bg-slate-50 border p-3 rounded-xl outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase">City</label>
                    <input type="text" value={newLeadData.city} onChange={(e) => setNewLeadData({ ...newLeadData, city: e.target.value })} className="w-full bg-slate-50 border p-3 rounded-xl outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Province</label>
                    <input type="text" value={newLeadData.province} onChange={(e) => setNewLeadData({ ...newLeadData, province: e.target.value })} className="w-full bg-slate-50 border p-3 rounded-xl outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Postal Code</label>
                    <input type="text" value={newLeadData.postalCode} onChange={(e) => setNewLeadData({ ...newLeadData, postalCode: e.target.value })} className="w-full bg-slate-50 border p-3 rounded-xl outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Assigned Store *</label>
                    <select
                      value={newLeadData.assignedStoreId}
                      onChange={(e) => setNewLeadData({ ...newLeadData, assignedStoreId: e.target.value })}
                      className="w-full bg-slate-50 border p-3 rounded-xl outline-none"
                    >
                      {dbStores.map((store) => (
                        <option key={store.id} value={store.id}>
                          {store.store_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Project Address *</label>
                    <input type="text" value={newLeadData.projectAddress} onChange={(e) => setNewLeadData({ ...newLeadData, projectAddress: e.target.value })} className="w-full bg-slate-50 border p-3 rounded-xl outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Project Type</label>
                    <select
                      value={newLeadData.projectType}
                      onChange={(e) => setNewLeadData({ ...newLeadData, projectType: e.target.value })}
                      className="w-full bg-slate-50 border p-3 rounded-xl outline-none"
                    >
                      {['Kitchen Cabinet', 'Bathroom Vanity', 'Closet', 'Custom Millwork', 'Countertop', 'Repair / Service', 'Other'].map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Source</label>
                    <select
                      value={newLeadData.source}
                      onChange={(e) => setNewLeadData({ ...newLeadData, source: e.target.value })}
                      className="w-full bg-slate-50 border p-3 rounded-xl outline-none"
                    >
                      {['info@51wood.ca', 'Phone Call', 'Walk-in', 'Referral', 'Website', 'Other'].map((source) => (
                        <option key={source} value={source}>{source}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Budget</label>
                    <input type="text" value={newLeadData.budget} onChange={(e) => setNewLeadData({ ...newLeadData, budget: e.target.value })} className="w-full bg-slate-50 border p-3 rounded-xl outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Timeline</label>
                    <input type="text" value={newLeadData.timeline} onChange={(e) => setNewLeadData({ ...newLeadData, timeline: e.target.value })} className="w-full bg-slate-50 border p-3 rounded-xl outline-none" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Notes</label>
                    <textarea value={newLeadData.notes} onChange={(e) => setNewLeadData({ ...newLeadData, notes: e.target.value })} className="w-full bg-slate-50 border p-3 rounded-xl outline-none min-h-[90px]" />
                  </div>
                  <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                    <button onClick={() => setShowLeadModal(false)} className="px-6 font-bold text-xs">Cancel</button>
                    <button onClick={handleCreateLead} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase">Save Lead</button>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-x-auto scrollbar-hide">
                <table className="w-full text-left min-w-[1100px]">
                  <thead>
                    <tr className="bg-slate-50 border-b">
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Customer</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Phone</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Email</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Project</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Source</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Status</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Manager</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Created</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-50/50">
                        <td className="px-8 py-6">
                          <p className="text-sm font-black">{lead.customerName}</p>
                          {lead.notes && <p className="text-[10px] text-slate-400 mt-1 max-w-xs truncate">{lead.notes}</p>}
                        </td>
                        <td className="px-8 py-6 text-xs font-bold text-slate-500">{hasPermission('view_customer_phone') ? lead.phone : 'Restricted'}</td>
                        <td className="px-8 py-6 text-xs font-bold text-slate-500">{hasPermission('view_customer_email') ? (lead.email || '—') : 'Restricted'}</td>
                        <td className="px-8 py-6">
                          <p className="text-xs font-black uppercase text-slate-500">{lead.projectType}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{hasPermission('view_customer_address') ? lead.projectAddress : 'Restricted'}</p>
                        </td>
                        <td className="px-8 py-6 text-xs font-bold text-slate-500">{lead.source}</td>
                        <td className="px-8 py-6">
                          <select
                            value={lead.status}
                            onChange={(e) => handleLeadStatusChange(lead.id, e.target.value as LeadStatus)}
                            className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-[10px] font-black uppercase outline-none"
                          >
                            {['New', 'Contacted', 'Measure Scheduled', 'Quoted', 'Won', 'Lost'].map((status) => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-8 py-6 text-xs font-bold text-slate-500">{lead.assignedManager || '—'}</td>
                        <td className="px-8 py-6 text-xs font-bold text-slate-500">
                          {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : '—'}
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              openCustomerLeadDetail({
                                leadId: lead.id,
                                customerId: lead.customerId,
                              })
                            }
                            className="px-3 py-2 rounded-xl bg-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all"
                          >
                            View Detail
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredLeads.length === 0 && !customerLeadLoading && (
                      <tr>
                        <td colSpan={9} className="py-20 text-center text-slate-300 italic font-bold uppercase tracking-widest text-[10px]">
                          No leads found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeView === 'CustomerLeadDetail' && (
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-black tracking-tight">
                    {selectedCustomerDetail?.displayName || selectedLeadDetail?.customerName || 'Customer / Lead Detail'}
                  </h3>
                  {selectedLeadDetail && (
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                      Lead status: {selectedLeadDetail.status}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setActiveView('CustomersLeads')}
                  className="px-5 py-3 rounded-2xl bg-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all"
                >
                  Back to Customers / Leads
                </button>
              </div>

              {!selectedLeadDetail && !selectedCustomerDetail ? (
                <div className="bg-white rounded-[40px] border border-dashed border-slate-200 py-20 text-center text-slate-300 italic font-bold uppercase tracking-widest text-[10px]">
                  No customer or lead selected.
                </div>
              ) : (
                <>
                  <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm p-8 space-y-6">
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Customer Profile</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Name</p>
                        <p className="text-sm font-black text-slate-800 mt-1">{selectedCustomerDetail?.displayName || selectedLeadDetail?.customerName || '—'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone</p>
                        <p className="text-sm font-bold text-slate-600 mt-1">{canViewCustomerPhone ? (selectedCustomerDetail?.phone || selectedLeadDetail?.phone || '—') : 'Restricted'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email</p>
                        <p className="text-sm font-bold text-slate-600 mt-1">{canViewCustomerEmail ? (selectedCustomerDetail?.email || selectedLeadDetail?.email || '—') : 'Restricted'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Address</p>
                        <p className="text-sm font-bold text-slate-600 mt-1">{canViewCustomerAddress ? (selectedCustomerDetail?.address || '—') : 'Restricted'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">City</p>
                        <p className="text-sm font-bold text-slate-600 mt-1">{selectedCustomerDetail?.city || '—'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Province</p>
                        <p className="text-sm font-bold text-slate-600 mt-1">{selectedCustomerDetail?.province || '—'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Postal Code</p>
                        <p className="text-sm font-bold text-slate-600 mt-1">{selectedCustomerDetail?.postalCode || '—'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Source</p>
                        <p className="text-sm font-bold text-slate-600 mt-1">{selectedCustomerDetail?.source || selectedLeadDetail?.source || '—'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Created</p>
                        <p className="text-sm font-bold text-slate-600 mt-1">{formatDate(selectedCustomerDetail?.createdAt || selectedLeadDetail?.createdAt) || '—'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Notes</p>
                        <p className="text-sm font-medium text-slate-500 mt-1">{selectedCustomerDetail?.notes || '—'}</p>
                      </div>
                    </div>
                  </div>

                  {selectedLeadDetail && (
                    <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm p-8 space-y-6">
                      <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Lead / Project</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Project Type</p>
                          <p className="text-sm font-black text-slate-800 mt-1">{selectedLeadDetail.projectType || '—'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Project Address</p>
                          <p className="text-sm font-bold text-slate-600 mt-1">{canViewCustomerAddress ? (selectedLeadDetail.projectAddress || '—') : 'Restricted'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Source</p>
                          <p className="text-sm font-bold text-slate-600 mt-1">{selectedLeadDetail.source || '—'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</p>
                          <select
                            value={selectedLeadDetail.status}
                            onChange={(e) => handleLeadStatusChange(selectedLeadDetail.id, e.target.value as LeadStatus)}
                            className="mt-2 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-[10px] font-black uppercase outline-none"
                          >
                            {['New', 'Contacted', 'Measure Scheduled', 'Quoted', 'Won', 'Lost'].map((status) => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Budget</p>
                          <p className="text-sm font-bold text-slate-600 mt-1">{selectedLeadDetail.budget || '—'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Timeline</p>
                          <p className="text-sm font-bold text-slate-600 mt-1">{selectedLeadDetail.timeline || '—'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Assigned Store</p>
                          <p className="text-sm font-bold text-slate-600 mt-1">{getStoreName(selectedLeadDetail.assignedStoreId) || '—'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Assigned Manager</p>
                          <p className="text-sm font-bold text-slate-600 mt-1">{selectedLeadDetail.assignedManager || '—'}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Notes</p>
                          <p className="text-sm font-medium text-slate-500 mt-1">{selectedLeadDetail.notes || '—'}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-100">
                      <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Linked Quotes</h4>
                    </div>
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50 border-b">
                          <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Quote</th>
                          <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Status</th>
                          <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Total</th>
                          <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Created</th>
                          <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {selectedCustomerQuotes.map((quote) => (
                          <tr key={quote.id}>
                            <td className="px-8 py-5 text-sm font-black">{quote.quoteNumber}</td>
                            <td className="px-8 py-5 text-xs font-black uppercase text-slate-500">{quote.status}</td>
                            <td className="px-8 py-5 text-sm font-bold text-blue-600">{canViewQuotePrice ? formatMoney(quote.total) : 'Restricted'}</td>
                            <td className="px-8 py-5 text-xs font-bold text-slate-400">{formatDate(quote.createdAt) || '—'}</td>
                            <td className="px-8 py-5 text-right">
                              <button
                                type="button"
                                onClick={() => openQuoteDetail(quote.id)}
                                className="px-3 py-2 rounded-xl bg-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all"
                              >
                                View Quote
                              </button>
                            </td>
                          </tr>
                        ))}
                        {selectedCustomerQuotes.length === 0 && (
                          <tr>
                            <td colSpan={5} className="py-12 text-center text-slate-300 italic font-bold uppercase tracking-widest text-[10px]">No linked quotes</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-100">
                      <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Linked Orders</h4>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left min-w-[900px]">
                        <thead>
                          <tr className="bg-slate-50 border-b">
                            <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Order</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Status</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Payment</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Production</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Inventory</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Total</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {selectedCustomerOrders.map((order) => (
                            <tr key={order.id}>
                              <td className="px-8 py-5 text-sm font-black">{order.orderNumber}</td>
                              <td className="px-8 py-5 text-xs font-black uppercase text-slate-500">{order.status}</td>
                              <td className="px-8 py-5 text-xs font-bold text-slate-500">{canViewOrderPayment ? order.paymentStatus : 'Restricted'}</td>
                              <td className="px-8 py-5 text-xs font-bold text-slate-500">{order.productionStatus}</td>
                              <td className="px-8 py-5 text-xs font-black uppercase text-slate-500">{order.inventoryStatus || 'Not Reserved'}</td>
                              <td className="px-8 py-5 text-sm font-bold text-blue-600">{canViewQuotePrice ? formatMoney(order.total) : 'Restricted'}</td>
                              <td className="px-8 py-5 text-right">
                                <button
                                  type="button"
                                  onClick={() => openOrderDetail(order.id)}
                                  className="px-3 py-2 rounded-xl bg-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all"
                                >
                                  View Order
                                </button>
                              </td>
                            </tr>
                          ))}
                          {selectedCustomerOrders.length === 0 && (
                            <tr>
                              <td colSpan={7} className="py-12 text-center text-slate-300 italic font-bold uppercase tracking-widest text-[10px]">No linked orders</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {activeView === 'Quote' && (
            <div className="max-w-6xl mx-auto grid grid-cols-1 xl:grid-cols-4 gap-10 animate-in slide-in-from-bottom-6 duration-500">
               <div className="xl:col-span-3 space-y-10">
                  {quoteStep === 1 ? (
                    <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden p-10">
                      <h3 className="text-sm font-black uppercase tracking-widest mb-10 border-b pb-4">Step 1: Client Enrollment</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                         <div className="space-y-1.5 md:col-span-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                             Select Existing Lead
                           </label>
                           <select
                             value={selectedLeadId}
                             onChange={(e) => handleSelectLeadForQuote(e.target.value)}
                             className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                           >
                             <option value="">Manual / No Lead Selected</option>
                             {dbLeads.map((lead) => (
                               <option key={lead.id} value={lead.id}>
                                 {lead.customerName} - {lead.projectType} - {lead.status}
                               </option>
                             ))}
                           </select>
                         </div>
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
                         <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500">Email</label><input type="email" value={clientInfo.email} onChange={e => setClientInfo({...clientInfo, email: e.target.value})} className="w-full border p-3 rounded-xl text-sm outline-none focus:border-blue-400" /></div>
                         <div className="space-y-1.5 md:col-span-2"><label className="text-xs font-bold text-slate-500">Project Address *</label><input type="text" value={clientInfo.address} onChange={e => setClientInfo({...clientInfo, address: e.target.value})} className="w-full border p-3 rounded-xl text-sm outline-none focus:border-blue-400" /></div>
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
                     <div className="space-y-3 mb-8">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Subtotal</span>
                          <span className="text-sm font-black text-slate-900">${quoteTotals.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Discount</label>
                          <input
                            type="number"
                            value={quoteDiscount}
                            onChange={(e) => setQuoteDiscount(e.target.value)}
                            min="0"
                            className="w-full bg-slate-50 border p-3 rounded-xl text-sm font-bold outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Tax Rate</label>
                          <input
                            type="number"
                            value={quoteTaxRate}
                            onChange={(e) => setQuoteTaxRate(e.target.value)}
                            min="0"
                            step="0.01"
                            className="w-full bg-slate-50 border p-3 rounded-xl text-sm font-bold outline-none"
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Tax Amount</span>
                          <span className="text-sm font-black text-slate-900">${quoteTotals.taxAmount.toFixed(2)}</span>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Notes</label>
                          <textarea
                            value={quoteNotes}
                            onChange={(e) => setQuoteNotes(e.target.value)}
                            placeholder="Quote notes..."
                            className="w-full bg-slate-50 border p-3 rounded-xl text-sm outline-none min-h-[80px]"
                          />
                        </div>
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Estimated Total</span>
                          <span className="text-2xl font-black text-slate-900 tracking-tighter">${quoteTotals.total.toFixed(2)}</span>
                        </div>
                     </div>
                     <button 
                        onClick={handleSubmitQuote} 
                        disabled={lineItems.length === 0} 
                        className="w-full bg-blue-600 disabled:opacity-30 text-white py-5 rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all transform hover:-translate-y-0.5"
                     >
                       Save Quote
                     </button>
                  </div>
               </div>
            </div>
          )}

          {activeView === 'Quotes' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black uppercase tracking-widest">Quotes</h3>
              </div>

              {quotesLoading && (
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Loading quotes...
                </p>
              )}

              {quotesError && (
                <p className="text-sm font-bold text-red-500">
                  {quotesError}
                </p>
              )}

              <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-x-auto scrollbar-hide">
                <table className="w-full text-left min-w-[1000px]">
                  <thead>
                    <tr className="bg-slate-50 border-b">
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Quote No</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Customer</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Phone</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Project Address</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Status</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase text-right">Total</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Created</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {dbQuotes.map((quote) => (
                      <tr key={quote.id} className="hover:bg-slate-50/50">
                        <td className="px-8 py-6 text-sm font-black">{quote.quoteNumber}</td>
                        <td className="px-8 py-6 text-sm font-black">{quote.customerName}</td>
                        <td className="px-8 py-6 text-xs font-bold text-slate-500">{hasPermission('view_customer_phone') ? quote.customerPhone : 'Restricted'}</td>
                        <td className="px-8 py-6 text-xs font-bold text-slate-500">{hasPermission('view_customer_address') ? quote.projectAddress : 'Restricted'}</td>
                        <td className="px-8 py-6">
                          <select
                            value={quote.status}
                            onChange={(e) => handleQuoteStatusChange(quote.id, e.target.value as QuoteStatus)}
                            className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-[10px] font-black uppercase outline-none"
                          >
                            {['Draft', 'Sent', 'Accepted', 'Rejected', 'Converted'].map((status) => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-8 py-6 text-right font-black text-blue-600">${quote.total.toFixed(2)}</td>
                        <td className="px-8 py-6 text-xs font-bold text-slate-500">
                          {quote.createdAt ? new Date(quote.createdAt).toLocaleDateString() : '—'}
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openQuoteDetail(quote.id)}
                              className="px-3 py-2 rounded-xl bg-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all"
                            >
                              View Detail
                            </button>
                            {quote.status === 'Accepted' && canConvertQuotes && (
                              <button
                                onClick={() => handleConvertQuoteToOrder(quote)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-sm shadow-blue-100 hover:bg-blue-700 transition-all"
                              >
                                Convert to Order
                              </button>
                            )}
                            {quote.status === 'Converted' && (
                              <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">
                                Converted
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {dbQuotes.length === 0 && !quotesLoading && (
                      <tr>
                        <td colSpan={8} className="py-20 text-center text-slate-300 italic font-bold uppercase tracking-widest text-[10px]">
                          No quotes found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeView === 'QuoteDetail' && (
            <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
              {!selectedQuoteDetail ? (
                <div className="space-y-6">
                  <button
                    type="button"
                    onClick={() => setActiveView('Quotes')}
                    className="no-print px-5 py-3 rounded-2xl bg-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all"
                  >
                    Back to Quotes
                  </button>
                  <div>No quote selected.</div>
                </div>
              ) : (
                <>
                  <div className="no-print flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-black tracking-tight">{selectedQuoteDetail.quoteNumber}</h3>
                      <p className="text-sm font-bold text-slate-500 mt-1">
                        {selectedQuoteDetail.customerName || selectedQuoteCustomer?.displayName || 'Quote'}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="px-3 py-1 rounded-full bg-slate-50 text-[9px] font-black uppercase tracking-widest text-slate-500">
                          {selectedQuoteDetail.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveView('Quotes')}
                        className="px-5 py-3 rounded-2xl bg-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all"
                      >
                        Back to Quotes
                      </button>
                      <button
                        type="button"
                        onClick={handlePrintQuote}
                        className="px-5 py-3 rounded-2xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
                      >
                        Print Quote
                      </button>
                      {selectedQuoteDetail.status === 'Draft' && (
                        <button
                          type="button"
                          onClick={() => handleMarkQuoteAsSent(selectedQuoteDetail.id)}
                          className="px-5 py-3 rounded-2xl bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all"
                        >
                          Mark as Sent
                        </button>
                      )}
                    </div>
                  </div>

                  <div id="quote-print-area" className="quote-print-area bg-white text-slate-900 rounded-[40px] border border-slate-200 shadow-sm p-10 space-y-10">
                    <div className="flex flex-wrap items-start justify-between gap-6 border-b border-slate-200 pb-6">
                      <div>
                        <p className="text-xl font-black tracking-tight">51Wood Portal</p>
                        <p className="text-3xl font-black mt-1">Quote</p>
                      </div>
                      <div className="text-sm font-bold text-slate-600 text-right space-y-1">
                        <p>51wood</p>
                        <p>info@51wood.ca</p>
                        <p>www.51wood.ca</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Quote Info</h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <p className="font-bold text-slate-400">Quote Number</p>
                          <p className="font-black">{selectedQuoteDetail.quoteNumber}</p>
                          <p className="font-bold text-slate-400">Quote Date</p>
                          <p className="font-black">{formatDate(selectedQuoteDetail.createdAt) || '—'}</p>
                          <p className="font-bold text-slate-400">Status</p>
                          <p className="font-black uppercase">{selectedQuoteDetail.status}</p>
                          <p className="font-bold text-slate-400">Store</p>
                          <p className="font-black">{getStoreName(selectedQuoteDetail.storeId) || '—'}</p>
                          <p className="font-bold text-slate-400">Manager</p>
                          <p className="font-black">{selectedQuoteDetail.managerName || '—'}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Customer Info</h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <p className="font-bold text-slate-400">Customer Name</p>
                          <p className="font-black">
                            {selectedQuoteDetail.customerName || selectedQuoteCustomer?.displayName || selectedQuoteLead?.customerName || '—'}
                          </p>
                          <p className="font-bold text-slate-400">Phone</p>
                          <p className="font-black">
                            {canViewCustomerPhone
                              ? (selectedQuoteDetail.customerPhone || selectedQuoteCustomer?.phone || selectedQuoteLead?.phone || '—')
                              : 'Restricted'}
                          </p>
                          <p className="font-bold text-slate-400">Email</p>
                          <p className="font-black">
                            {canViewCustomerEmail
                              ? (selectedQuoteDetail.customerEmail || selectedQuoteCustomer?.email || selectedQuoteLead?.email || '—')
                              : 'Restricted'}
                          </p>
                          <p className="font-bold text-slate-400">Project Address</p>
                          <p className="font-black">
                            {canViewCustomerAddress
                              ? (selectedQuoteDetail.projectAddress || selectedQuoteLead?.projectAddress || selectedQuoteCustomer?.address || '—')
                              : 'Restricted'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Line Items</h4>
                      <table>
                        <thead>
                          <tr>
                            <th>SKU</th>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Unit</th>
                            <th>Qty</th>
                            <th>Unit Price</th>
                            <th>Line Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(selectedQuoteDetail.lineItems || []).map((item, index) => (
                            <tr key={`${item.productId || item.sku}-${index}`}>
                              <td>{item.sku}</td>
                              <td>{item.name}</td>
                              <td>{item.category}</td>
                              <td>{item.unit}</td>
                              <td>{item.quantity}</td>
                              <td>{canViewQuotePrice ? formatMoney(item.base_price) : 'Restricted'}</td>
                              <td>{canViewQuotePrice ? formatMoney(item.lineTotal) : 'Restricted'}</td>
                            </tr>
                          ))}
                          {(selectedQuoteDetail.lineItems || []).length === 0 && (
                            <tr>
                              <td colSpan={7}>No line items</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex justify-end">
                      <div className="w-full max-w-sm space-y-2 text-sm">
                        <div className="flex justify-between gap-8">
                          <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Subtotal</span>
                          <span className="font-black">{canViewQuotePrice ? formatMoney(selectedQuoteDetail.subtotal) : 'Restricted'}</span>
                        </div>
                        <div className="flex justify-between gap-8">
                          <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Discount</span>
                          <span className="font-black">{canViewQuotePrice ? formatMoney(selectedQuoteDetail.discount) : 'Restricted'}</span>
                        </div>
                        <div className="flex justify-between gap-8">
                          <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Tax Rate</span>
                          <span className="font-black">{canViewQuotePrice ? formatTaxRate(selectedQuoteDetail.taxRate) : 'Restricted'}</span>
                        </div>
                        <div className="flex justify-between gap-8">
                          <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Tax Amount</span>
                          <span className="font-black">{canViewQuotePrice ? formatMoney(selectedQuoteDetail.taxAmount) : 'Restricted'}</span>
                        </div>
                        <div className="flex justify-between gap-8 border-t border-slate-200 pt-3">
                          <span className="font-black uppercase tracking-widest text-xs">Total</span>
                          <span className="font-black text-lg">{canViewQuotePrice ? formatMoney(selectedQuoteDetail.total) : 'Restricted'}</span>
                        </div>
                      </div>
                    </div>

                    {selectedQuoteDetail.notes && (
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Notes</h4>
                        <p className="text-sm font-medium text-slate-600 whitespace-pre-wrap">{selectedQuoteDetail.notes}</p>
                      </div>
                    )}

                    <p className="text-sm font-bold text-slate-500 border-t border-slate-200 pt-6">
                      Thank you for choosing 51wood.
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {activeView === 'HRLabor' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black uppercase tracking-widest">HR / Labor Management</h3>
                {canCreateHRLabor && (
                  <button
                    onClick={() => {
                      resetTeamMemberForm();
                      setShowTeamMemberModal(true);
                    }}
                    className="bg-blue-600 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase shadow-lg shadow-blue-100"
                  >
                    <Plus size={14} className="inline mr-2" /> Add Team Member
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {(['All', ...WORKER_TYPES] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setTeamMemberTypeFilter(type)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      teamMemberTypeFilter === type
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                        : 'bg-white text-slate-400 border border-slate-200 hover:text-blue-600'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {teamMembersLoading && (
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Loading HR / Labor records...
                </p>
              )}

              {teamMembersError && (
                <p className="text-sm font-bold text-red-500">
                  {teamMembersError}
                </p>
              )}

              {showTeamMemberModal && (canCreateHRLabor || canEditHRLabor) && (
                <div className="bg-white p-10 rounded-[40px] border border-blue-200 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div className="md:col-span-2 flex justify-between items-center">
                    <h4 className="font-black uppercase text-xs">
                      {editingTeamMemberId ? 'Edit Team Member' : 'Add Team Member'}
                    </h4>
                    <button
                      onClick={() => {
                        resetTeamMemberForm();
                        setShowTeamMemberModal(false);
                      }}
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Name *</label>
                    <input
                      type="text"
                      value={newTeamMemberData.displayName}
                      onChange={(e) => setNewTeamMemberData({ ...newTeamMemberData, displayName: e.target.value })}
                      className="w-full bg-slate-50 border p-3 rounded-xl outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Email</label>
                    <input
                      type="email"
                      value={newTeamMemberData.email}
                      onChange={(e) => setNewTeamMemberData({ ...newTeamMemberData, email: e.target.value })}
                      className="w-full bg-slate-50 border p-3 rounded-xl outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Phone</label>
                    <input
                      type="text"
                      value={newTeamMemberData.phone}
                      onChange={(e) => setNewTeamMemberData({ ...newTeamMemberData, phone: e.target.value })}
                      className="w-full bg-slate-50 border p-3 rounded-xl outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Business Role</label>
                    <input
                      type="text"
                      value={newTeamMemberData.role}
                      onChange={(e) => setNewTeamMemberData({ ...newTeamMemberData, role: e.target.value })}
                      className="w-full bg-slate-50 border p-3 rounded-xl outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Permission Role</label>
                    <select
                      value={newTeamMemberData.permissionsRole}
                      onChange={(e) =>
                        setNewTeamMemberData({
                          ...newTeamMemberData,
                          permissionsRole: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border p-3 rounded-xl outline-none"
                    >
                      {!dbRoles.some((role) => role.name === newTeamMemberData.permissionsRole) && (
                        <option value={newTeamMemberData.permissionsRole}>
                          {newTeamMemberData.permissionsRole || 'Select Role'}
                        </option>
                      )}
                      {dbRoles.map((role) => (
                        <option key={role.id} value={role.name}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Worker Type</label>
                    <select
                      value={newTeamMemberData.workerType}
                      onChange={(e) =>
                        setNewTeamMemberData({
                          ...newTeamMemberData,
                          workerType: e.target.value as WorkerType,
                        })
                      }
                      className="w-full bg-slate-50 border p-3 rounded-xl outline-none"
                    >
                      {WORKER_TYPES.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Employment Type</label>
                    <select
                      value={newTeamMemberData.employmentType}
                      onChange={(e) =>
                        setNewTeamMemberData({
                          ...newTeamMemberData,
                          employmentType: e.target.value as EmploymentType,
                        })
                      }
                      className="w-full bg-slate-50 border p-3 rounded-xl outline-none"
                    >
                      {EMPLOYMENT_TYPES.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Store</label>
                    <select
                      value={newTeamMemberData.storeId}
                      onChange={(e) =>
                        setNewTeamMemberData({
                          ...newTeamMemberData,
                          storeId: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border p-3 rounded-xl outline-none"
                    >
                      {dbStores.map((store) => (
                        <option key={store.id} value={store.id}>
                          {store.store_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Status</label>
                    <select
                      value={newTeamMemberData.status}
                      onChange={(e) =>
                        setNewTeamMemberData({
                          ...newTeamMemberData,
                          status: e.target.value as 'Active' | 'Inactive',
                        })
                      }
                      className="w-full bg-slate-50 border p-3 rounded-xl outline-none"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="space-y-2 flex items-end">
                    <label className="flex items-center gap-3 text-xs font-black uppercase text-slate-500 pb-3">
                      <input
                        type="checkbox"
                        checked={newTeamMemberData.canLogin}
                        onChange={(e) =>
                          setNewTeamMemberData({
                            ...newTeamMemberData,
                            canLogin: e.target.checked,
                          })
                        }
                      />
                      Can Login
                    </label>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Linked Firebase UID</label>
                    <input
                      type="text"
                      value={newTeamMemberData.linkedUserId}
                      onChange={(e) => setNewTeamMemberData({ ...newTeamMemberData, linkedUserId: e.target.value })}
                      className="w-full bg-slate-50 border p-3 rounded-xl outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Hourly Rate</label>
                    <input
                      type="number"
                      min="0"
                      value={newTeamMemberData.hourlyRate}
                      onChange={(e) => setNewTeamMemberData({ ...newTeamMemberData, hourlyRate: e.target.value })}
                      className="w-full bg-slate-50 border p-3 rounded-xl outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Piece Rate</label>
                    <input
                      type="number"
                      min="0"
                      value={newTeamMemberData.pieceRate}
                      onChange={(e) => setNewTeamMemberData({ ...newTeamMemberData, pieceRate: e.target.value })}
                      className="w-full bg-slate-50 border p-3 rounded-xl outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Case Rate</label>
                    <input
                      type="number"
                      min="0"
                      value={newTeamMemberData.caseRate}
                      onChange={(e) => setNewTeamMemberData({ ...newTeamMemberData, caseRate: e.target.value })}
                      className="w-full bg-slate-50 border p-3 rounded-xl outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Contract Rate</label>
                    <input
                      type="number"
                      min="0"
                      value={newTeamMemberData.contractRate}
                      onChange={(e) => setNewTeamMemberData({ ...newTeamMemberData, contractRate: e.target.value })}
                      className="w-full bg-slate-50 border p-3 rounded-xl outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Commission Rate</label>
                    <input
                      type="number"
                      min="0"
                      value={newTeamMemberData.commissionRate}
                      onChange={(e) => setNewTeamMemberData({ ...newTeamMemberData, commissionRate: e.target.value })}
                      className="w-full bg-slate-50 border p-3 rounded-xl outline-none"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Notes</label>
                    <textarea
                      value={newTeamMemberData.notes}
                      onChange={(e) => setNewTeamMemberData({ ...newTeamMemberData, notes: e.target.value })}
                      className="w-full bg-slate-50 border p-3 rounded-xl outline-none min-h-[90px]"
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                    <button
                      onClick={() => {
                        resetTeamMemberForm();
                        setShowTeamMemberModal(false);
                      }}
                      className="px-6 font-bold text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveTeamMember}
                      className="bg-blue-600 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase"
                    >
                      {editingTeamMemberId ? 'Save Changes' : 'Save Team Member'}
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-x-auto scrollbar-hide">
                <table className="w-full text-left min-w-[1200px]">
                  <thead>
                    <tr className="bg-slate-50 border-b">
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Name</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Worker Type</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Employment</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Permission Role</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Store</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Contact</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Login</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Rate</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Status</th>
                      {canEditHRLabor && (
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredTeamMembers.map((member) => {
                      const storeName = dbStores.find((store) => store.id === member.storeId)?.store_name || member.storeId || '—';

                      return (
                        <tr key={member.id} className="hover:bg-slate-50/50">
                          <td className="px-8 py-6">
                            <p className="text-sm font-black">{member.displayName}</p>
                            <p className="text-[10px] text-slate-400 mt-1">{member.role || '—'}</p>
                          </td>
                          <td className="px-8 py-6 text-xs font-bold text-slate-500">{member.workerType}</td>
                          <td className="px-8 py-6 text-xs font-bold text-slate-500">{member.employmentType}</td>
                          <td className="px-8 py-6 text-xs font-bold text-slate-500">{member.permissionsRole || '—'}</td>
                          <td className="px-8 py-6 text-xs font-bold text-slate-500">{storeName}</td>
                          <td className="px-8 py-6">
                            <p className="text-xs font-bold text-slate-500">{member.phone || '—'}</p>
                            <p className="text-[10px] text-slate-400 mt-1">{member.email || '—'}</p>
                          </td>
                          <td className="px-8 py-6 text-xs font-black uppercase">
                            <span className={member.canLogin ? 'text-emerald-600' : 'text-slate-400'}>
                              {member.canLogin ? 'Enabled' : 'Disabled'}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-xs font-black text-blue-600">
                            {hasPermission('view_labor_rate') ? getTeamMemberRateLabel(member) : 'Restricted'}
                          </td>
                          <td className="px-8 py-6">
                            {canEditHRLabor ? (
                              <select
                                value={member.status}
                                onChange={(e) =>
                                  handleTeamMemberStatusChange(member.id, e.target.value as 'Active' | 'Inactive')
                                }
                                className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-[10px] font-black uppercase outline-none"
                              >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                              </select>
                            ) : (
                              <span className="text-[10px] font-black uppercase text-slate-500">{member.status}</span>
                            )}
                          </td>
                          {canEditHRLabor && (
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleEditTeamMember(member)}
                                  className="p-2 bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 transition-all"
                                >
                                  <Edit3 size={14} />
                                </button>
                                {canDeleteHRLabor && (
                                  <button
                                    onClick={() => handleDeleteTeamMember(member.id)}
                                    className="p-2 bg-slate-100 rounded-lg text-slate-400 hover:text-red-500 transition-all"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                )}
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                    {filteredTeamMembers.length === 0 && !teamMembersLoading && (
                      <tr>
                        <td colSpan={canEditHRLabor ? 10 : 9} className="py-20 text-center text-slate-300 italic font-bold uppercase tracking-widest text-[10px]">
                          No team members found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
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
                  
                  <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border gap-1">
                    {['All', 'Not Started', 'In Progress', 'Quality Check', 'Ready', 'Completed'].map(status => (
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

               {ordersLoading && (
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                   Loading production tasks...
                 </p>
               )}

               {ordersError && (
                 <p className="text-sm font-bold text-red-500">
                   {ordersError}
                 </p>
               )}

               <div className="space-y-8 pb-20">
                 {filteredFirestoreProductionTasks.length === 0 ? (
                   <div className="py-32 text-center space-y-4 bg-white rounded-[40px] border border-dashed border-slate-200">
                      <Clock size={48} className="mx-auto text-slate-200" />
                      <p className="text-xs text-slate-400 font-black uppercase tracking-widest">
                        No live production tasks yet. Convert an accepted quote to create production tasks.
                      </p>
                   </div>
                 ) : (
                   filteredFirestoreProductionTasks.map((taskRecord) => {
                     const progress = taskRecord.tasks.length > 0
                       ? Math.round((taskRecord.tasks.filter((task) => task.isComplete).length / taskRecord.tasks.length) * 100)
                       : 0;

                     return (
                       <div key={taskRecord.id} className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all group p-1">
                          <div className="p-8 pb-6 flex flex-wrap items-center justify-between gap-6">
                             <div className="flex items-center gap-6">
                                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all font-black text-xs">{taskRecord.orderNumber}</div>
                                <div>
                                   <h4 className="text-lg font-black text-slate-900 leading-tight">{taskRecord.customerName}</h4>
                                   <p className="text-[10px] font-black uppercase text-slate-400 mt-1">Order {taskRecord.orderNumber}</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-4">
                                <div className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-blue-50 text-blue-600">
                                   {taskRecord.status}
                                </div>
                                <div className="w-48 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                   <div className="h-full bg-emerald-500 transition-all duration-1000" style={{width: `${progress}%`}}></div>
                                </div>
                             </div>
                          </div>

                          <div className="p-8 bg-slate-50/50 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                             {taskRecord.tasks.map((task) => {
                               const assigneeOptions = getAssignableTeamMembers(task.taskType);
                               const assignedMember = dbTeamMembers.find((member) => member.id === task.assignedTeamMemberId);
                               const dropdownOptions =
                                 assignedMember && !assigneeOptions.some((member) => member.id === assignedMember.id)
                                   ? [assignedMember, ...assigneeOptions]
                                   : assigneeOptions;
                               const canCompleteThisTask = canCompleteProductionTasks;

                               return (
                               <div key={task.id} className={`p-5 rounded-3xl border bg-white shadow-sm transition-all ${task.isComplete ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-100'}`}>
                                  <div className="flex items-center gap-3 mb-3">
                                     <button
                                       type="button"
                                       disabled={!canCompleteThisTask}
                                       onClick={() =>
                                         handleUpdateProductionTaskItem(
                                           taskRecord.id,
                                           taskRecord.orderId,
                                           task.id,
                                           { isComplete: !task.isComplete }
                                         )
                                       }
                                       className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all disabled:opacity-40 ${task.isComplete ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-transparent border border-slate-200'}`}
                                     >
                                       <Check size={14} strokeWidth={4} />
                                     </button>
                                     <span className={`text-[11px] font-black ${task.isComplete ? 'text-emerald-600 line-through' : 'text-slate-700'}`}>{task.taskName}</span>
                                  </div>
                                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3">{task.taskType}</p>
                                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">
                                    Assigned: {task.assignedTeamMemberName || 'Unassigned'}
                                  </p>
                                  <select
                                    value={task.assignedTeamMemberId || ''}
                                    disabled={!canAssignProductionTasks}
                                    onChange={(e) =>
                                      handleAssignTask(
                                        taskRecord.id,
                                        taskRecord.orderId,
                                        task,
                                        e.target.value
                                      )
                                    }
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-[10px] font-bold outline-none mb-3 disabled:opacity-50"
                                  >
                                    <option value="">Unassigned</option>
                                    {task.assignedTeamMemberId &&
                                      !dropdownOptions.some((member) => member.id === task.assignedTeamMemberId) && (
                                        <option value={task.assignedTeamMemberId}>
                                          {task.assignedTeamMemberName || 'Assigned'}
                                        </option>
                                      )}
                                    {dropdownOptions.map((member) => (
                                      <option key={member.id} value={member.id}>
                                        {member.displayName} — {member.workerType}
                                      </option>
                                    ))}
                                  </select>
                                  <input
                                    value={task.notes || ''}
                                    disabled={!canCompleteThisTask}
                                    onChange={(e) =>
                                      handleDraftProductionTaskItem(
                                        taskRecord.id,
                                        task.id,
                                        { notes: e.target.value }
                                      )
                                    }
                                    onBlur={(e) =>
                                      handleUpdateProductionTaskItem(
                                        taskRecord.id,
                                        taskRecord.orderId,
                                        task.id,
                                        { notes: e.target.value }
                                      )
                                    }
                                    placeholder="Notes..."
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-[9px] font-bold outline-none mb-3 disabled:opacity-50"
                                  />
                                  <div className="flex items-center justify-between">
                                    <span className="text-[8px] font-black text-slate-300 uppercase">Worker Init</span>
                                    <input
                                      value={task.signedBy || ''}
                                      disabled={!canCompleteThisTask}
                                      maxLength={3}
                                      onChange={(e) =>
                                        handleDraftProductionTaskItem(
                                          taskRecord.id,
                                          task.id,
                                          { signedBy: e.target.value.toUpperCase() }
                                        )
                                      }
                                      onBlur={(e) =>
                                        handleUpdateProductionTaskItem(
                                          taskRecord.id,
                                          taskRecord.orderId,
                                          task.id,
                                          { signedBy: e.target.value.toUpperCase() }
                                        )
                                      }
                                      placeholder="..."
                                      className="w-10 bg-white border border-slate-200 rounded-lg py-1.5 text-[9px] font-black text-center uppercase outline-none disabled:opacity-50"
                                    />
                                  </div>
                               </div>
                               );
                             })}
                          </div>
                       </div>
                     );
                   })
                 )}
               </div>
            </div>
          )}

          {activeView === 'Users' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="flex flex-wrap items-center justify-between gap-3">
                 <div>
                   <h3 className="text-lg font-black uppercase tracking-widest">Platform Access Governance</h3>
                   <p className="text-xs font-bold text-slate-400 mt-1">
                     Manage roles and edit permissions below.
                   </p>
                 </div>
                 <button
                   type="button"
                   onClick={() => { setNewRoleName(''); setEditingRoleId(null); setShowRoleModal(true); }}
                   className="bg-blue-600 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase shadow-lg shadow-blue-100"
                 >
                   <Plus size={14} className="inline mr-2" /> Define New Role
                 </button>
               </div>
               
               {rolesLoading && (
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                   Loading roles...
                 </p>
               )}

               {rolesError && (
                 <p className="text-sm font-bold text-red-500">
                   {rolesError}
                 </p>
               )}

               {showRoleModal && (
                 <div className="bg-white p-8 rounded-[32px] border border-blue-200 shadow-xl mb-8 animate-in slide-in-from-top-4">
                   <div className="flex justify-between items-center mb-6"><h4 className="font-black uppercase text-xs">{editingRoleId ? 'Edit Role' : 'Create Access Role'}</h4><button type="button" onClick={() => setShowRoleModal(false)}><X size={18} /></button></div>
                   <div className="flex gap-4"><input type="text" value={newRoleName} onChange={e => setNewRoleName(e.target.value)} placeholder="Enter Role Title..." className="flex-1 bg-slate-50 border p-4 rounded-xl outline-none text-sm font-bold" /><button type="button" onClick={handleAddRole} className="bg-blue-600 text-white px-8 rounded-xl font-black text-[10px] uppercase">{editingRoleId ? 'Save' : 'Register'}</button></div>
                 </div>
               )}

               <div>
                 <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-3">
                   Role Identifiers
                 </h4>
                 <div className="flex flex-wrap gap-2">
                   {dbRoles.map((role) => (
                     <div key={role.id} className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
                       <span className="text-xs font-black text-slate-700">{role.name}</span>
                       <button
                         type="button"
                         onClick={() => handleEditRole(role)}
                         className="p-2 bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 transition-all"
                         aria-label={`Edit ${role.name}`}
                       >
                         <Edit3 size={14} />
                       </button>
                       <button
                         type="button"
                         onClick={() => handleDeleteRole(role.id)}
                         className="p-2 bg-slate-100 rounded-lg text-slate-400 hover:text-red-500 transition-all"
                         aria-label={`Delete ${role.name}`}
                       >
                         <Trash2 size={14} />
                       </button>
                     </div>
                   ))}
                 </div>
               </div>

               <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full min-w-[900px] border-collapse">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="sticky left-0 z-20 bg-slate-50 px-5 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-500 border-r border-slate-200">
                            Permission
                          </th>
                          <th className="px-4 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-500">
                            Type
                          </th>
                          {dbRoles.map((role) => (
                            <th
                              key={role.id}
                              className="px-4 py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-500 whitespace-nowrap"
                            >
                              {role.name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {PERMISSION_COLUMNS.map((permission) => (
                          <tr key={permission} className="hover:bg-slate-50/80">
                            <td className="sticky left-0 z-10 bg-white px-5 py-4 text-sm font-black text-slate-800 border-r border-slate-200 whitespace-nowrap">
                              {formatPermissionLabel(permission)}
                            </td>
                            <td className="px-4 py-4">
                              <span className={`inline-flex rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-widest ${getPermissionTypeClasses(permission)}`}>
                                {getPermissionTypeLabel(permission)}
                              </span>
                            </td>
                            {dbRoles.map((role) => {
                              const isChecked = role.permissions?.[permission] === true;

                              return (
                                <td
                                  key={`${permission}-${role.id}`}
                                  className="px-4 py-4 text-center"
                                >
                                  <button
                                    type="button"
                                    onClick={() => togglePermission(role.id, permission)}
                                    aria-label={`Toggle ${permission} for ${role.name}`}
                                    className={`mx-auto flex h-9 w-9 items-center justify-center rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                                      isChecked
                                        ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                                        : 'border-slate-400 bg-white text-transparent hover:border-blue-400 hover:bg-blue-50'
                                    }`}
                                  >
                                    <Check size={16} strokeWidth={4} />
                                  </button>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               </div>
            </div>
          )}

          {activeView === 'Stores' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex items-center justify-between"><h3 className="text-lg font-black uppercase tracking-widest">Store Network</h3><button onClick={() => setShowStoreModal(true)} className="bg-blue-600 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase"><Plus size={14} className="inline mr-2" /> Open New Hub</button></div>
              {storesLoading && (
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Loading stores...
                </p>
              )}
              {storesError && (
                <p className="text-sm font-bold text-red-500">
                  {storesError}
                </p>
              )}
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
                    <div className="pt-8 border-t flex justify-between items-center"><p className="text-sm font-black">{store.manager_name}</p><div className="flex items-center gap-3"><p className="text-sm font-black text-blue-600">{store.commissionRate}% Rate</p><button onClick={() => handleDeleteStore(store.id)} className="p-2 bg-slate-100 rounded-lg text-slate-400 hover:text-red-500 transition-all"><Trash2 size={14}/></button></div></div>
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

              {productsLoading && (
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Loading products...
                </p>
              )}

              {productsError && (
                <p className="text-sm font-bold text-red-500">
                  {productsError}
                </p>
              )}

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
            <div className="space-y-8 animate-in fade-in duration-500">
              {ordersLoading && (
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Loading orders...
                </p>
              )}
              {ordersError && (
                <p className="text-sm font-bold text-red-500">
                  {ordersError}
                </p>
              )}
              <div className="bg-white rounded-[40px] border shadow-sm overflow-hidden">
                <table className="w-full text-left min-w-[1300px]">
                  <thead>
                    <tr className="bg-slate-50 border-b">
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Order Ref</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Customer Profile</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Status</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Payment</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Production</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Inventory</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase text-right">Total</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {firestoreOrders
                      .filter((order) => !currentUser?.storeId || order.storeId === currentUser.storeId)
                      .map((order) => (
                        <tr key={order.id} className="hover:bg-blue-50/40 transition-all">
                          <td className="px-8 py-6 text-sm font-black">
                            {order.orderNumber}
                            <span className="block text-[10px] text-slate-400 font-medium">{order.orderDate}</span>
                          </td>
                          <td className="px-8 py-6 text-sm font-bold text-slate-700">{order.customerName}</td>
                          <td className="px-8 py-6">
                            <select
                              value={order.status}
                              onChange={(e) => handleOrderStatusChange(order.id, e.target.value as OrderStatusV2)}
                              className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-[10px] font-black uppercase outline-none"
                            >
                              {['Pending', 'In Process', 'Quality Check', 'Ready', 'Completed', 'Cancelled'].map((status) => (
                                <option key={status} value={status}>{status}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-8 py-6">
                            <select
                              value={order.paymentStatus}
                              onChange={(e) => handlePaymentStatusChange(order.id, e.target.value as PaymentStatus)}
                              className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-[10px] font-black uppercase outline-none"
                            >
                              {['Unpaid', 'Deposit Paid', 'Paid', 'Refunded'].map((status) => (
                                <option key={status} value={status}>{status}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-8 py-6">
                            <select
                              value={order.productionStatus}
                              onChange={(e) => handleProductionStatusChange(order.id, e.target.value as ProductionStatus)}
                              className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-[10px] font-black uppercase outline-none"
                            >
                              {['Not Started', 'In Production', 'Quality Check', 'Ready', 'Completed'].map((status) => (
                                <option key={status} value={status}>{status}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-8 py-6">
                            <span className={`inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                              order.inventoryStatus === 'Deducted'
                                ? 'bg-emerald-50 text-emerald-700'
                                : order.inventoryStatus === 'Reserved'
                                  ? 'bg-amber-50 text-amber-700'
                                  : 'bg-slate-50 text-slate-500'
                            }`}>
                              {order.inventoryStatus || 'Not Reserved'}
                            </span>
                            {canManageInventory && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                <button
                                  type="button"
                                  onClick={() => handleReserveStockForOrder(order)}
                                  disabled={
                                    inventoryActionLoadingOrderId === order.id ||
                                    order.inventoryStatus === 'Reserved' ||
                                    order.inventoryStatus === 'Deducted'
                                  }
                                  className="px-3 py-2 rounded-xl bg-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                  {inventoryActionLoadingOrderId === order.id ? 'Working...' : 'Reserve Stock'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeductStockForOrder(order)}
                                  disabled={
                                    inventoryActionLoadingOrderId === order.id ||
                                    order.inventoryStatus === 'Deducted'
                                  }
                                  className="px-3 py-2 rounded-xl bg-blue-600 text-[9px] font-black uppercase tracking-widest text-white hover:bg-blue-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                  Deduct Stock
                                </button>
                              </div>
                            )}
                          </td>
                          <td className="px-8 py-6 text-right font-black text-blue-600 text-sm">${order.total.toFixed(2)}</td>
                          <td className="px-8 py-6 text-right">
                            <button
                              type="button"
                              onClick={() => openOrderDetail(order.id)}
                              className="px-3 py-2 rounded-xl bg-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all"
                            >
                              View Detail
                            </button>
                          </td>
                        </tr>
                      ))}
                    {firestoreOrders.length === 0 && !ordersLoading && (
                      <tr>
                        <td colSpan={8} className="py-20 text-center text-slate-300 italic font-bold uppercase tracking-widest text-[10px]">
                          No live orders yet. Convert an accepted quote to create the first order.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeView === 'OrderDetail' && (
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
              {!selectedOrderDetail ? (
                <div className="space-y-6">
                  <button
                    type="button"
                    onClick={() => setActiveView('Orders')}
                    className="px-5 py-3 rounded-2xl bg-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all"
                  >
                    Back to Orders
                  </button>
                  <div className="bg-white rounded-[40px] border border-dashed border-slate-200 py-20 text-center text-slate-300 italic font-bold uppercase tracking-widest text-[10px]">
                    No order selected.
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-black tracking-tight">{selectedOrderDetail.orderNumber}</h3>
                      <p className="text-sm font-bold text-slate-500 mt-1">{selectedOrderDetail.customerName}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="px-3 py-1 rounded-full bg-slate-50 text-[9px] font-black uppercase tracking-widest text-slate-500">{selectedOrderDetail.status}</span>
                        <span className="px-3 py-1 rounded-full bg-slate-50 text-[9px] font-black uppercase tracking-widest text-slate-500">{canViewOrderPayment ? selectedOrderDetail.paymentStatus : 'Restricted'}</span>
                        <span className="px-3 py-1 rounded-full bg-blue-50 text-[9px] font-black uppercase tracking-widest text-blue-600">{selectedOrderDetail.productionStatus}</span>
                        <span className="px-3 py-1 rounded-full bg-amber-50 text-[9px] font-black uppercase tracking-widest text-amber-700">{selectedOrderDetail.inventoryStatus || 'Not Reserved'}</span>
                      </div>
                    </div>
                    <div className="text-right space-y-3">
                      <p className="text-2xl font-black text-blue-600">{canViewQuotePrice ? formatMoney(selectedOrderDetail.total) : 'Restricted'}</p>
                      <button
                        type="button"
                        onClick={() => setActiveView('Orders')}
                        className="px-5 py-3 rounded-2xl bg-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all"
                      >
                        Back to Orders
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm p-8 space-y-6">
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Customer / Project</h4>
                      <button
                        type="button"
                        onClick={() =>
                          openCustomerLeadDetail({
                            leadId: selectedOrderDetail.leadId,
                            customerId: selectedOrderDetail.customerId,
                          })
                        }
                        className="px-3 py-2 rounded-xl bg-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all"
                      >
                        View Customer
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Customer</p>
                        <p className="text-sm font-black text-slate-800 mt-1">{selectedOrderDetail.customerName}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone</p>
                        <p className="text-sm font-bold text-slate-600 mt-1">{canViewCustomerPhone ? (selectedOrderDetail.customerPhone || '—') : 'Restricted'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email</p>
                        <p className="text-sm font-bold text-slate-600 mt-1">{canViewCustomerEmail ? (selectedOrderDetail.customerEmail || '—') : 'Restricted'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Project Address</p>
                        <p className="text-sm font-bold text-slate-600 mt-1">{canViewCustomerAddress ? (selectedOrderDetail.projectAddress || '—') : 'Restricted'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Store</p>
                        <p className="text-sm font-bold text-slate-600 mt-1">{getStoreName(selectedOrderDetail.storeId) || '—'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Manager</p>
                        <p className="text-sm font-bold text-slate-600 mt-1">{selectedOrderDetail.managerName || '—'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm p-8 space-y-6">
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Quote Link</h4>
                      <button
                        type="button"
                        onClick={() => {
                          const quoteId = selectedOrderQuote?.id || selectedOrderDetail.quoteId;
                          if (quoteId) {
                            openQuoteDetail(quoteId);
                          } else {
                            setActiveView('Quotes');
                          }
                        }}
                        className="px-3 py-2 rounded-xl bg-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all"
                      >
                        {selectedOrderQuote?.id || selectedOrderDetail.quoteId ? 'View Quote' : 'Open Quotes'}
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Quote Number</p>
                        <p className="text-sm font-black text-slate-800 mt-1">{selectedOrderQuote?.quoteNumber || selectedOrderDetail.quoteNumber || '—'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Quote Status</p>
                        <p className="text-sm font-bold text-slate-600 mt-1">{selectedOrderQuote?.status || '—'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Quote Total</p>
                        <p className="text-sm font-black text-blue-600 mt-1">{canViewQuotePrice ? formatMoney(selectedOrderQuote?.total ?? selectedOrderDetail.total) : 'Restricted'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-100">
                      <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Order Line Items</h4>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left min-w-[800px]">
                        <thead>
                          <tr className="bg-slate-50 border-b">
                            <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">SKU</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Product</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Category</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Unit</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 text-center">Qty</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 text-right">Unit Price</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 text-right">Line Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {(selectedOrderDetail.lineItems || []).map((item, index) => (
                            <tr key={`${item.productId || item.sku}-${index}`}>
                              <td className="px-8 py-5 text-xs font-bold uppercase text-slate-500">{item.sku}</td>
                              <td className="px-8 py-5 text-sm font-black">{item.name}</td>
                              <td className="px-8 py-5 text-xs font-bold text-slate-500">{item.category}</td>
                              <td className="px-8 py-5 text-xs font-bold text-slate-500">{item.unit}</td>
                              <td className="px-8 py-5 text-center text-sm font-black">{item.quantity}</td>
                              <td className="px-8 py-5 text-right text-sm font-bold text-slate-600">{canViewQuotePrice ? formatMoney(item.base_price) : 'Restricted'}</td>
                              <td className="px-8 py-5 text-right text-sm font-black text-blue-600">{canViewQuotePrice ? formatMoney(item.lineTotal) : 'Restricted'}</td>
                            </tr>
                          ))}
                          {(selectedOrderDetail.lineItems || []).length === 0 && (
                            <tr>
                              <td colSpan={7} className="py-12 text-center text-slate-300 italic font-bold uppercase tracking-widest text-[10px]">No line items</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm p-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Production Tasks</h4>
                      <span className="px-3 py-1 rounded-full bg-blue-50 text-[9px] font-black uppercase tracking-widest text-blue-600">
                        {selectedOrderProductionTask?.status || 'Not Started'}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(selectedOrderProductionTask?.tasks || []).map((task) => (
                        <div key={task.id} className={`p-5 rounded-3xl border ${task.isComplete ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-100 bg-slate-50/50'}`}>
                          <p className={`text-sm font-black ${task.isComplete ? 'text-emerald-600 line-through' : 'text-slate-800'}`}>{task.taskName}</p>
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">{task.taskType}</p>
                          <p className="text-[10px] font-bold text-slate-500 mt-3">Assigned: {task.assignedTeamMemberName || 'Unassigned'}</p>
                          <p className="text-[10px] font-bold text-slate-500">Signed: {task.signedBy || '—'}</p>
                          <p className="text-[10px] font-medium text-slate-400 mt-2">{task.notes || 'No notes'}</p>
                          <p className="text-[9px] font-black uppercase tracking-widest mt-3">{task.isComplete ? 'Complete' : 'Not complete'}</p>
                        </div>
                      ))}
                      {(!selectedOrderProductionTask || selectedOrderProductionTask.tasks.length === 0) && (
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No production tasks for this order.</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-100">
                      <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Inventory Movements</h4>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left min-w-[800px]">
                        <thead>
                          <tr className="bg-slate-50 border-b">
                            <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Type</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Product</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 text-center">Qty</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 text-center">Previous</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 text-center">New</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Created</th>
                            <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Notes</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {selectedOrderStockMovements.map((movement) => (
                            <tr key={movement.id}>
                              <td className="px-8 py-5 text-xs font-black uppercase text-slate-500">{movement.movementType}</td>
                              <td className="px-8 py-5 text-sm font-black">{movement.productName}</td>
                              <td className="px-8 py-5 text-center text-sm font-black">{movement.quantity}</td>
                              <td className="px-8 py-5 text-center text-sm font-bold text-slate-500">{movement.previousStock}</td>
                              <td className="px-8 py-5 text-center text-sm font-black">{movement.newStock}</td>
                              <td className="px-8 py-5 text-xs font-bold text-slate-400">{formatDate(movement.createdAt) || '—'}</td>
                              <td className="px-8 py-5 text-xs font-medium text-slate-400">{movement.notes || '—'}</td>
                            </tr>
                          ))}
                          {selectedOrderStockMovements.length === 0 && (
                            <tr>
                              <td colSpan={7} className="py-12 text-center text-slate-300 italic font-bold uppercase tracking-widest text-[10px]">No stock movements yet.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm p-8">
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Internal Notes</h4>
                    <p className="text-sm font-medium text-slate-500 mt-3">{selectedOrderDetail.notes || 'No internal notes.'}</p>
                  </div>
                </>
              )}
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
               {productsLoading && (
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                   Loading products...
                 </p>
               )}

               {productsError && (
                 <p className="text-sm font-bold text-red-500">
                   {productsError}
                 </p>
               )}

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

               <div className="bg-white rounded-[40px] border shadow-sm overflow-hidden">
                  <div className="px-8 py-6 border-b border-slate-100">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Stock Movement History</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Reserve and deduct records from live orders</p>
                  </div>

                  {stockMovementsLoading && (
                    <p className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Loading stock movements...
                    </p>
                  )}

                  {stockMovementsError && (
                    <p className="px-8 py-4 text-sm font-bold text-red-500">
                      {stockMovementsError}
                    </p>
                  )}

                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[1100px]">
                      <thead>
                        <tr className="bg-slate-50 border-b">
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Type</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Product</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">SKU</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase text-center">Qty</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase text-center">Previous</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase text-center">New</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Order</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Customer</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Created</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Notes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {stockMovements.map((movement) => (
                          <tr key={movement.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-8 py-5">
                              <span className={`inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                movement.movementType === 'Deducted'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : movement.movementType === 'Reserved'
                                    ? 'bg-amber-50 text-amber-700'
                                    : 'bg-slate-50 text-slate-600'
                              }`}>
                                {movement.movementType}
                              </span>
                            </td>
                            <td className="px-8 py-5 text-sm font-black text-slate-800">{movement.productName || '—'}</td>
                            <td className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">{movement.sku || '—'}</td>
                            <td className="px-8 py-5 text-center text-sm font-black">{movement.quantity}</td>
                            <td className="px-8 py-5 text-center text-sm font-bold text-slate-500">{movement.previousStock}</td>
                            <td className="px-8 py-5 text-center text-sm font-black">{movement.newStock}</td>
                            <td className="px-8 py-5 text-xs font-black text-slate-700">{movement.orderNumber || '—'}</td>
                            <td className="px-8 py-5 text-xs font-bold text-slate-500">{movement.customerName || '—'}</td>
                            <td className="px-8 py-5 text-[10px] font-bold text-slate-400">
                              {movement.createdAt ? new Date(movement.createdAt).toLocaleString() : '—'}
                            </td>
                            <td className="px-8 py-5 text-xs font-medium text-slate-400">{movement.notes || '—'}</td>
                          </tr>
                        ))}
                        {!stockMovementsLoading && stockMovements.length === 0 && (
                          <tr>
                            <td colSpan={10} className="py-20 text-center text-slate-300 italic font-bold uppercase tracking-widest text-[10px]">
                              No stock movements yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
               </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default App;