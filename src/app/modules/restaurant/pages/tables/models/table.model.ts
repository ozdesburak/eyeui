export interface TablePosition {
  row: number;
  col: number;
  region?: string;
}

export interface Table {
  id: number;
  name: string;
  number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  currentOrder: Order | null;
  activeOrder?: any; // Backend'den gelen aktif sipariş için
  totalAmount: number;
  paymentMethod?: 'cash' | 'online' | 'card';
  isPaidOnline?: boolean;
  position: TablePosition;
  region?: string;
}

export interface Order {
  id: number;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'paid';
  createdAt: Date;
  processStatus?: string;
}

export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
} 