import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Statistics } from '@/types';
import { getStatistics } from '@/services/statistics';
import { formatPrice } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { DollarSign, TrendingUp, ShoppingBag } from 'lucide-react';
import { toast } from 'react-hot-toast';

export function StatisticsPage() {
  const { employee } = useAuthStore();
  const [stats, setStats] = useState<Statistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState('month');

  const fetchStats = async () => {
    if (!employee?.active_branch_id) return;
    setIsLoading(true);
    try {
      // Mock data
      const data: Statistics = {
        revenue_by_date: Array.from({ length: 30 }, (_, i) => ({
          date: `2023-11-${(i + 1).toString().padStart(2, '0')}`,
          revenue: Math.floor(Math.random() * 5000000) + 2000000
        })),
        orders_by_hour: Array.from({ length: 14 }, (_, i) => ({
          hour: `${i + 10}:00`,
          count: Math.floor(Math.random() * 20) + 5
        })),
        top_items: [
          { name: 'Milanesa con Puré', quantity: 145, revenue: 11600000 },
          { name: 'Asado a la Olla', quantity: 98, revenue: 8330000 },
          { name: 'Gaseosa 500ml', quantity: 350, revenue: 5250000 },
          { name: 'Pizza Muzzarella', quantity: 85, revenue: 7650000 },
          { name: 'Cerveza 1L', quantity: 120, revenue: 4200000 },
        ],
        total_revenue: 85400000,
        avg_order_value: 125000
      };
      setStats(data);
    } catch (error) {
      toast.error('Error al cargar estadísticas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [period, employee?.active_branch_id]);

  const formatYAxis = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
    return value.toString();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Estadísticas</h1>
          <p className="text-muted-foreground mt-1">Análisis de ventas y rendimiento.</p>
        </div>
        <div className="w-48">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger>
              <SelectValue placeholder="Periodo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hoy</SelectItem>
              <SelectItem value="week">Esta semana</SelectItem>
              <SelectItem value="month">Este mes</SelectItem>
              <SelectItem value="quarter">Último trimestre</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatPrice(stats?.total_revenue || 0)}</div>
            <p className="text-xs text-muted-foreground mt-1">+12% respecto al periodo anterior</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ticket Promedio</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats?.avg_order_value || 0)}</div>
            <p className="text-xs text-muted-foreground mt-1">+5% respecto al periodo anterior</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Pedidos</CardTitle>
            <ShoppingBag className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.orders_by_hour.reduce((acc, curr) => acc + curr.count, 0) || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">+18% respecto al periodo anterior</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Ingresos por Día</CardTitle>
            <CardDescription>Evolución de ventas en el periodo seleccionado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {stats && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.revenue_by_date} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      tickFormatter={(val) => val.split('-')[2]} // Show only day
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      tickFormatter={formatYAxis}
                    />
                    <RechartsTooltip 
                      formatter={(value: number) => [formatPrice(value), 'Ingresos']}
                      labelFormatter={(label) => `Fecha: ${label}`}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#FF6B35" 
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 6, fill: '#FF6B35', stroke: '#fff', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Pedidos por Hora</CardTitle>
            <CardDescription>Distribución de comandas durante el día</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {stats && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.orders_by_hour} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="hour" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                    />
                    <RechartsTooltip 
                      cursor={{ fill: '#f1f5f9' }}
                      formatter={(value: number) => [value, 'Pedidos']}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    />
                    <Bar 
                      dataKey="count" 
                      fill="#3B82F6" 
                      radius={[4, 4, 0, 0]} 
                      barSize={30}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Platos Más Vendidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Plato / Producto</TableHead>
                  <TableHead className="text-center">Cantidad Vendida</TableHead>
                  <TableHead className="text-right">Ingresos Generados</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats?.top_items.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-center">
                      <span className="bg-muted px-2 py-1 rounded-md text-sm">{item.quantity}</span>
                    </TableCell>
                    <TableCell className="text-right font-medium text-green-600">{formatPrice(item.revenue)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
