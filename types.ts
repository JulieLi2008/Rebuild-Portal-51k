export enum OrderStatus {
  Draft = 'Draft',
  Production = 'Production',
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
}

export interface TaskItem {
  id: string;
  task_name: string;
  is_complete: boolean;
  signed_by: string;
  // Added optional notes property to resolve type error in TaskManager
  notes?: string;
}

export interface ProductionTasks {
  order_id: string;
  tasks: TaskItem[];
}

export interface StoreInfo {
  id: string;
  store_name: string;
  manager_name: string;
  address: string;
  commissionRate: number;
}