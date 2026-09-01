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