export interface Table {
  id: number;
  name: string;
  seats: number;
  status: string; // available, occupied, cleaning
}

export interface MenuItem {
  id: number;
  name: string;
  description?: string | null;
  price: string;
  category: string;
  subcategory?: string | null;
  image?: string | null;
  available: boolean;
}

export interface Order {
  id: number;
  tableId: number;
  status: string;
  subtotal: string;
  tax: string;
  total: string;
  createdAt: string;
  startedAt?: string | null;
  readyAt?: string | null;
  paidAt?: string | null;
}

export interface OrderItem {
  id: number;
  orderId: number;
  menuItemId: number;
  quantity: number;
  price: string;
  status: string;
  menuItem?: MenuItem;
}

export interface OrderWithItems extends Order {
  table: Table;
  items: OrderItem[];
}

export interface OrderSummary {
  ordersCompleted: number;
  totalRevenue: string;
  averageOrderValue: string;
  tablesServed: number;
} 