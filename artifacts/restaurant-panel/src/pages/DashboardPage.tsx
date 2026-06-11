import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { DashboardStats } from '@/types';
import { getDashboard } from '@/services/dashboard';
import { formatPrice, formatTime } from '@/lib/utils';
import { DashboardStatSkeleton } from '@/components/common/LoadingSkeleton';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { LayoutGrid, Receipt, DollarSign, CheckCircle, CalendarDays, AlertTriangle, Clock, Check, UtensilsCrossed } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { markOrderReady } from '@/services/orders';
import { toast } from 'react-hot-toast';

export function DashboardPage() {
  const { employee } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboard = async () => {
    if (!employee?.active_branch_id) return;
    try {
      // Mock for now
      // const data = await getDashboard(employee.active_branch_id);
      const data: DashboardStats = {
        active_tables: 12,
        active_orders: 5,
        daily_revenue: 4500000,
        completed_orders: 42,
        today_reservations: 8,
        pending_alerts: 2,
        recent_orders: [
          { id: '1', table_number: '12', status: 'preparing', total: 250000, created_at: new Date().toISOString() },
          { id: '2', table_number: '05', status: 'pending', total: 120000, created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
          { id: '3', table_number: '08', status: 'ready', total: 340000, created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
        ]
      };
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 30000); // 30s
    return () => clearInterval(interval);
  }, [employee?.active_branch_id]);

  if (employee?.role === 'kitchen') {
    return <KitchenView />;
  }

  const statCards = [
    { title: 'Mesas activas', value: stats?.active_tables || 0, icon: LayoutGrid, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { title: 'Pedidos en curso', value: stats?.active_orders || 0, icon: Receipt, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' },
    { title: 'Ingresos del día', value: formatPrice(stats?.daily_revenue || 0), icon: DollarSign, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
    { title: 'Pedidos completados', value: stats?.completed_orders || 0, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
    { title: 'Reservas de hoy', value: stats?.today_reservations || 0, icon: CalendarDays, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    { title: 'Alertas pendientes', value: stats?.pending_alerts || 0, icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Panel de Control</h1>
        <p className="text-muted-foreground mt-1">Resumen en tiempo real de la sucursal.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <DashboardStatSkeleton key={i} />)
        ) : (
          statCards.map((card, i) => (
            <Card key={i} className="border-border/50 shadow-sm" data-testid={`stat-card-${i}`}>
              <CardContent className="p-4 flex flex-col justify-between h-full space-y-4">
                <div className="flex items-start justify-between">
                  <p className="text-sm font-medium text-muted-foreground leading-tight">{card.title}</p>
                  <div className={`p-2 rounded-md ${card.bg}`}>
                    <card.icon className={`h-4 w-4 ${card.color}`} />
                  </div>
                </div>
                <div className="text-2xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-5 shadow-sm border-border/50">
          <CardHeader>
            <CardTitle>Pedidos recientes</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex justify-between items-center py-2">
                    <div className="w-1/4 h-4 bg-muted animate-pulse rounded" />
                    <div className="w-1/4 h-4 bg-muted animate-pulse rounded" />
                    <div className="w-1/4 h-4 bg-muted animate-pulse rounded" />
                  </div>
                ))}
              </div>
            ) : stats?.recent_orders && stats.recent_orders.length > 0 ? (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead>Mesa</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">Hora</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.recent_orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">Mesa {order.table_number}</TableCell>
                        <TableCell><StatusBadge status={order.status} /></TableCell>
                        <TableCell className="text-right">{formatPrice(order.total)}</TableCell>
                        <TableCell className="text-right text-muted-foreground">{formatTime(order.created_at)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                No hay pedidos recientes
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Placeholder for additional widgets */}
        <Card className="lg:col-span-2 shadow-sm border-border/50">
          <CardHeader>
            <CardTitle>Acciones rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = '/orders'}>
              <Receipt className="mr-2 h-4 w-4" /> Ver todos los pedidos
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = '/tables'}>
              <LayoutGrid className="mr-2 h-4 w-4" /> Gestionar mesas
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Kitchen View Sub-component
function KitchenView() {
  const { employee } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  
  useEffect(() => {
    // Mock kitchen orders polling
    const fetchKitchenOrders = () => {
      setOrders([
        {
          id: '101',
          table_number: '12',
          created_at: new Date(Date.now() - 1000 * 60 * 18).toISOString(), // 18 mins ago
          status: 'preparing',
          items: [
            { id: 'i1', name: 'Milanesa con Puré', quantity: 2, notes: 'Sin limón', status: 'preparing' },
            { id: 'i2', name: 'Ensalada Mixta', quantity: 1, status: 'ready' }
          ]
        },
        {
          id: '102',
          table_number: '05',
          created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
          status: 'pending',
          items: [
            { id: 'i3', name: 'Sopa de Pescado', quantity: 1, status: 'pending' },
            { id: 'i4', name: 'Asado a la Olla', quantity: 1, notes: 'Bien cocido', status: 'pending' }
          ]
        }
      ]);
    };
    
    fetchKitchenOrders();
    const interval = setInterval(fetchKitchenOrders, 5000); // 5s poll
    return () => clearInterval(interval);
  }, []);

  const handleMarkReady = async (orderId: string) => {
    try {
      // await markOrderReady(employee?.active_branch_id!, orderId);
      toast.success('Pedido marcado como listo');
      setOrders(orders.filter(o => o.id !== orderId));
    } catch (err) {
      toast.error('Error al actualizar pedido');
    }
  };

  return (
    <div className="p-4 md:p-6 h-[100dvh] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Comandas (Cocina)</h1>
        <div className="text-muted-foreground flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          <span className="font-mono text-xl">{new Date().toLocaleTimeString('es-PY', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
        <div className="flex gap-4 h-full min-w-min">
          {orders.map((order) => {
            const minutesElapsed = Math.floor((Date.now() - new Date(order.created_at).getTime()) / 60000);
            const isDelayed = minutesElapsed > 15;
            
            return (
              <Card 
                key={order.id} 
                className={`w-[350px] shrink-0 flex flex-col bg-card border-2 ${isDelayed ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-border'}`}
                data-testid={`kitchen-order-${order.id}`}
              >
                <div className={`p-4 flex justify-between items-center border-b ${isDelayed ? 'bg-red-500/10' : 'bg-muted/30'}`}>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">MESA</div>
                    <div className="text-4xl font-bold text-foreground">{order.table_number}</div>
                  </div>
                  <div className="text-right">
                    <Badge variant={isDelayed ? "destructive" : "secondary"} className="text-lg py-1 px-3">
                      {minutesElapsed} min
                    </Badge>
                  </div>
                </div>
                
                <div className="p-4 flex-1 overflow-y-auto">
                  <div className="space-y-4">
                    {order.items.map((item: any) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="font-bold text-lg text-primary">{item.quantity}x</div>
                        <div className="flex-1">
                          <div className={`text-lg font-medium ${item.status === 'ready' ? 'line-through text-muted-foreground' : ''}`}>
                            {item.name}
                          </div>
                          {item.notes && (
                            <div className="text-sm text-yellow-500 font-medium bg-yellow-500/10 px-2 py-1 rounded mt-1 inline-block">
                              Nota: {item.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 border-t bg-muted/20">
                  <Button 
                    className="w-full py-6 text-lg font-bold" 
                    onClick={() => handleMarkReady(order.id)}
                    data-testid={`btn-ready-${order.id}`}
                  >
                    <Check className="mr-2 h-6 w-6" /> TODO LISTO
                  </Button>
                </div>
              </Card>
            );
          })}
          
          {orders.length === 0 && (
            <div className="w-full flex items-center justify-center text-muted-foreground/50 border-2 border-dashed border-border rounded-xl">
              <div className="text-center">
                <UtensilsCrossed className="mx-auto h-16 w-16 mb-4 opacity-50" />
                <p className="text-2xl font-medium">No hay pedidos pendientes</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
