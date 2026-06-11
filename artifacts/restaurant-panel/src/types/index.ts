export interface Employee {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'kitchen' | 'waiter';
  branch_ids: string[];
  active_branch_id: string;
}

export interface OrderItem {
  id: string;
  menu_item_id: string;
  name: string;
  quantity: number;
  price: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
  notes?: string;
}

export interface Order {
  id: string;
  table_number: string;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  total: number;
  created_at: string;
  items: OrderItem[];
  client_name?: string;
}

export interface Table {
  id: string;
  number: string;
  status: 'libre' | 'ocupada' | 'reservada' | 'fuera de servicio';
  capacity: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
}

export interface Reservation {
  id: string;
  client_name: string;
  date: string;
  guests: number;
  table_id?: string;
  status: 'confirmada' | 'pendiente' | 'cancelada' | 'completada';
  notes?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  total_visits: number;
  last_visit: string;
  total_spent: number;
}

export interface Promotion {
  id: string;
  name: string;
  discount: number;
  type: 'percentage' | 'fixed';
  code: string;
  valid_from: string;
  valid_until: string;
  uses: number;
  active: boolean;
}

export interface Alert {
  id: string;
  type: string;
  description: string;
  area: string;
  time: string;
  status: 'pending' | 'resolved';
}

export interface DashboardStats {
  active_tables: number;
  active_orders: number;
  daily_revenue: number;
  completed_orders: number;
  today_reservations: number;
  pending_alerts: number;
  recent_orders: {
    id: string;
    table_number: string;
    status: string;
    total: number;
    created_at: string;
  }[];
}

export interface Statistics {
  revenue_by_date: { date: string; revenue: number }[];
  orders_by_hour: { hour: string; count: number }[];
  top_items: { name: string; quantity: number; revenue: number }[];
  total_revenue: number;
  avg_order_value: number;
}
