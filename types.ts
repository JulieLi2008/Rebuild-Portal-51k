export enum OrderStatus {
  Draft = 'Draft',
  Pending = 'Pending',
  InProcess = 'In Process',
  QualityCheck = 'Quality Check',
  Ready = 'Ready',
  Completed = 'Completed'
}

export type UserRole = string;

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  storeId?: string;
  approved: boolean;
  joinDate: string;
}

export interface Dimensions {
  w: string;
  h: string;
  d: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  base_price: number;
  unit: string;
  dimensions: Dimensions;
  modifications: string[];
  category: string;
  stockLevel: number;
  minStock: number;
  supplier?: string;
  status?: 'Active' | 'Inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface QuoteLineItem {
  product: Product;
  quantity: number;
}

export interface ClientInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface Order {
  id: string;
  order_no: string;
  store_id: string;
  manager_name: string;
  client_info: ClientInfo;
  line_items: QuoteLineItem[];
  status: OrderStatus;
  date: string;
  due_date?: string; // Added for Task Board
}

export interface TaskItem {
  id: string;
  task_name: string;
  is_complete: boolean;
  signed_by: string;
  notes?: string;
}

export interface ProductionTasks {
  order_id: string;
  tasks: TaskItem[];
  started_at?: string; // Added for dispatch tracking
}

export interface StoreInfo {
  id: string;
  store_name: string;
  manager_name: string;
  address: string;
  commissionRate: number;
  phone?: string;
  email?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  status?: 'Active' | 'Inactive';
  createdAt?: string;
  updatedAt?: string;
}

export type LeadStatus =
  | 'New'
  | 'Contacted'
  | 'Measure Scheduled'
  | 'Quoted'
  | 'Won'
  | 'Lost';

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  source?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Lead {
  id: string;
  customerId: string;
  customerName: string;
  email: string;
  phone: string;
  projectAddress: string;
  projectType: string;
  source: string;
  status: LeadStatus;
  budget?: string;
  timeline?: string;
  notes?: string;
  assignedStoreId?: string;
  assignedManager?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export type QuoteStatus =
  | 'Draft'
  | 'Sent'
  | 'Accepted'
  | 'Rejected'
  | 'Converted';

export interface QuoteItem {
  productId: string;
  sku: string;
  name: string;
  category: string;
  unit: string;
  base_price: number;
  quantity: number;
  lineTotal: number;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  customerId: string;
  leadId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  projectAddress: string;
  storeId: string;
  managerName: string;
  lineItems: QuoteItem[];
  subtotal: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  status: QuoteStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export type WorkerType =
  | 'Designer'
  | 'Cabinet Maker'
  | 'Installer'
  | 'Installer Helper'
  | 'Sales'
  | 'Manager'
  | 'Accounting'
  | 'Subcontractor'
  | 'Countertop Subcontractor'
  | 'Other';

export type EmploymentType =
  | 'Work by hour'
  | 'Work by case'
  | 'Work by piece'
  | 'Work by contract'
  | 'Subcontract'
  | 'Salary'
  | 'Commission'
  | 'Other';

export interface TeamMember {
  id: string;
  displayName: string;
  email: string;
  phone: string;
  role: string;
  permissionsRole: string;
  workerType: WorkerType;
  employmentType: EmploymentType;
  storeId?: string;
  status: 'Active' | 'Inactive';
  canLogin: boolean;
  linkedUserId?: string;
  hourlyRate?: number;
  pieceRate?: number;
  caseRate?: number;
  contractRate?: number;
  commissionRate?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export type OrderStatusV2 =
  | 'Pending'
  | 'In Process'
  | 'Quality Check'
  | 'Ready'
  | 'Completed'
  | 'Cancelled';

export type PaymentStatus =
  | 'Unpaid'
  | 'Deposit Paid'
  | 'Paid'
  | 'Refunded';

export type ProductionStatus =
  | 'Not Started'
  | 'In Production'
  | 'Quality Check'
  | 'Ready'
  | 'Completed';

export interface FirestoreOrder {
  id: string;
  orderNumber: string;
  quoteId: string;
  quoteNumber: string;
  customerId: string;
  leadId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  projectAddress: string;
  storeId: string;
  managerName: string;
  lineItems: QuoteItem[];
  subtotal: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  status: OrderStatusV2;
  paymentStatus: PaymentStatus;
  productionStatus: ProductionStatus;
  orderDate: string;
  dueDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export type ProductionTaskStatus =
  | 'Not Started'
  | 'In Progress'
  | 'Quality Check'
  | 'Ready'
  | 'Completed';

export type ProductionTaskType =
  | 'Design'
  | 'Production'
  | 'Installation'
  | 'Quality'
  | 'Logistics';

export interface FirestoreTaskItem {
  id: string;
  taskName: string;
  taskType: ProductionTaskType;
  isComplete: boolean;
  assignedTeamMemberId?: string;
  assignedTeamMemberName?: string;
  signedBy?: string;
  notes?: string;
  completedAt?: string;
}

export interface FirestoreProductionTask {
  id: string;
  orderId: string;
  orderNumber: string;
  quoteId: string;
  customerId: string;
  customerName: string;
  storeId: string;
  status: ProductionTaskStatus;
  startedAt?: string;
  completedAt?: string;
  tasks: FirestoreTaskItem[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}