export enum OrderStatus {
  Pending = 'Pending',
  AssignedToDesigner = 'Assigned to Designer',
  InProduction = 'In Production',
  ContractMakerPool = 'Contract Maker Pool',
  Completed = 'Completed',
  InstallFinished = 'Install Finished'
}

export type UserRole = string;

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  storeId?: string; // Links Sales/Managers to a specific store
  approved: boolean;
  avatar?: string;
  joinDate: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  clientName: string;
  address: string;
  phone: string;
  total: number;
  cabinetType: string;
  status: OrderStatus;
  storeId: string;
  salesId: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  image: string;
  stockLevel: number;
  minStock: number;
}

export interface QuoteLineItem {
  product: Product;
  quantity: number;
}

export interface StoreInfo {
  id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  managerId?: string;
  managerName?: string;
  storeType?: string;
  isActive: boolean;
  commissionRate: number;
}

export interface FactoryTask {
  id: string;
  orderId: string;
  productName: string;
  quantity: number;
  status: 'Queue' | 'Cutting' | 'Assembly' | 'Ready';
}