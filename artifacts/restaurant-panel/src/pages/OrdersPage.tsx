import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Order } from '@/types';
import { getOrders, updateOrderItemStatus, markOrderReady } from '@/services/orders';
import { formatPrice, formatTime, formatDate } from '@/lib/utils';
import { StatusBadge } from '@/components/common/StatusBadge';
import { TableRowSkeleton } from '@/components/common/LoadingSkeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';

export function OrdersPage() {
  const { employee } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('todos');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const fetchOrders = async () => {
    if (!employee?.active_branch_id) return;
    try {
      // const data = await getOrders(employee.active_branch_id);
      
      // Mock data
      const data: Order[] = [
        {
          id: '1',
          table_number: '12',
          client_name: 'Juan Pérez',
          status: 'preparing',
          total: 250000,
          created_at: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
          items: [
            { id: 'i1', menu_item_id: 'm1', name: 'Milanesa con Puré', quantity: 2, price: 80000, notes: 'Sin limón', status: 'preparing' },
            { id: 'i2', menu_item_id: 'm2', name: 'Gaseosa 500ml', quantity: 2, price: 15000, status: 'ready' },
            { id: 'i3', menu_item_id: 'm3', name: 'Flan Casero', quantity: 1, price: 30000, status: 'pending' },
          ]
        },
        {
          id: '2',
          table_number: '05',
          status: 'pending',
          total: 120000,
          created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          items: [
            { id: 'i4', menu_item_id: 'm4', name: 'Sopa de Pescado', quantity: 1, price: 40000, status: 'pending' },
            { id: 'i5', menu_item_id: 'm5', name: 'Asado a la Olla', quantity: 1, price: 80000, notes: 'Bien cocido', status: 'pending' }
          ]
        },
        {
          id: '3',
          table_number: '08',
          client_name: 'María Gómez',
          status: 'ready',
          total: 340000,
          created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
          items: [
            { id: 'i6', menu_item_id: 'm6', name: 'Pizza Muzzarella', quantity: 2, price: 90000, status: 'ready' },
            { id: 'i7', menu_item_id: 'm7', name: 'Cerveza 1L', quantity: 2, price: 35000, status: 'ready' }
          ]
        },
        {
          id: '4',
          table_number: '02',
          status: 'completed',
          total: 150000,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          items: [
            { id: 'i8', menu_item_id: 'm8', name: 'Hamburguesa Completa', quantity: 2, price: 60000, status: 'delivered' },
            { id: 'i9', menu_item_id: 'm2', name: 'Gaseosa 500ml', quantity: 2, price: 15000, status: 'delivered' }
          ]
        }
      ];
      setOrders(data);
    } catch (error) {
      toast.error('Error al cargar los pedidos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // 10s poll
    return () => clearInterval(interval);
  }, [employee?.active_branch_id]);

  const handleMarkReady = async (orderId: string) => {
    try {
      // await markOrderReady(employee?.active_branch_id!, orderId);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'ready' } : o));
      toast.success('Pedido marcado como listo');
    } catch (error) {
      toast.error('Error al actualizar el pedido');
    }
  };

  const handleItemStatusChange = async (orderId: string, itemId: string, newStatus: string) => {
    try {
      // await updateOrderItemStatus(employee?.active_branch_id!, orderId, itemId, newStatus);
      setOrders(orders.map(o => {
        if (o.id === orderId) {
          const newItems = o.items.map(i => i.id === itemId ? { ...i, status: newStatus as any } : i);
          return { ...o, items: newItems };
        }
        return o;
      }));
      toast.success('Item actualizado');
    } catch (error) {
      toast.error('Error al actualizar el item');
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'todos') return true;
    if (activeTab === 'en preparación') return order.status === 'preparing';
    if (activeTab === 'listos') return order.status === 'ready';
    if (activeTab === 'completados') return order.status === 'completed';
    if (activeTab === 'pendientes') return order.status === 'pending';
    if (activeTab === 'cancelados') return order.status === 'cancelled';
    return true;
  });

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Pedidos</h1>
          <p className="text-muted-foreground mt-1">Administra y haz seguimiento de las comandas.</p>
        </div>
      </div>

      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="p-4 border-b">
            <TabsList className="w-full flex overflow-x-auto h-auto p-1 custom-scrollbar justify-start">
              <TabsTrigger value="todos" className="flex-1 min-w-[100px] data-[state=active]:bg-primary data-[state=active]:text-white">Todos</TabsTrigger>
              <TabsTrigger value="pendientes" className="flex-1 min-w-[100px] data-[state=active]:bg-yellow-500 data-[state=active]:text-white">Pendientes</TabsTrigger>
              <TabsTrigger value="en preparación" className="flex-1 min-w-[120px] data-[state=active]:bg-blue-500 data-[state=active]:text-white">En preparación</TabsTrigger>
              <TabsTrigger value="listos" className="flex-1 min-w-[100px] data-[state=active]:bg-green-500 data-[state=active]:text-white">Listos</TabsTrigger>
              <TabsTrigger value="completados" className="flex-1 min-w-[120px]">Completados</TabsTrigger>
              <TabsTrigger value="cancelados" className="flex-1 min-w-[100px]">Cancelados</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value={activeTab} className="m-0">
            <div className="rounded-b-md overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Mesa</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Tiempo</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={8}><TableRowSkeleton columns={8} /></TableCell>
                      </TableRow>
                    ))
                  ) : filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => {
                      const isExpanded = expandedOrderId === order.id;
                      const minutesElapsed = Math.floor((Date.now() - new Date(order.created_at).getTime()) / 60000);
                      
                      return (
                        <React.Fragment key={order.id}>
                          <TableRow className={`cursor-pointer ${isExpanded ? 'bg-muted/20' : ''}`} onClick={() => toggleExpand(order.id)}>
                            <TableCell>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              </Button>
                            </TableCell>
                            <TableCell className="font-bold text-lg">Mesa {order.table_number}</TableCell>
                            <TableCell>{order.client_name || '-'}</TableCell>
                            <TableCell>{order.items.reduce((acc, item) => acc + item.quantity, 0)} items</TableCell>
                            <TableCell className="font-medium">{formatPrice(order.total)}</TableCell>
                            <TableCell><StatusBadge status={order.status} /></TableCell>
                            <TableCell>
                              <div className="flex items-center text-muted-foreground">
                                <Clock className="h-3 w-3 mr-1" />
                                {minutesElapsed} min
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              {['pending', 'preparing'].includes(order.status) && (
                                <Button 
                                  size="sm" 
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                  onClick={(e) => { e.stopPropagation(); handleMarkReady(order.id); }}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" /> Listo
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                          
                          {isExpanded && (
                            <TableRow className="bg-muted/5 hover:bg-muted/5 border-b">
                              <TableCell colSpan={8} className="p-0">
                                <div className="p-4 pl-14 grid gap-3 border-l-4 border-primary/50 m-2 rounded-r-md">
                                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Detalle de items</div>
                                  {order.items.map(item => (
                                    <div key={item.id} className="flex items-center justify-between bg-card p-3 rounded-md shadow-sm border border-border/50">
                                      <div className="flex items-center gap-4">
                                        <div className="bg-muted w-8 h-8 rounded flex items-center justify-center font-bold text-primary">
                                          {item.quantity}x
                                        </div>
                                        <div>
                                          <div className="font-medium">{item.name}</div>
                                          {item.notes && <div className="text-sm text-yellow-600">Nota: {item.notes}</div>}
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-4">
                                        <div className="font-medium">{formatPrice(item.price * item.quantity)}</div>
                                        <div className="w-32 flex justify-end">
                                          <StatusBadge status={item.status} className="text-xs" />
                                        </div>
                                        {/* Action buttons for individual items could go here */}
                                      </div>
                                    </div>
                                  ))}
                                  <div className="flex justify-between items-center mt-2 pt-2 border-t text-sm text-muted-foreground">
                                    <div>Pedido creado: {formatDate(order.created_at)} a las {formatTime(order.created_at)}</div>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                        No hay pedidos en esta categoría
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
