import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Alert } from '@/types';
import { getAlerts, resolveAlert } from '@/services/alerts';
import { formatTime } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, PackageMinus, UserX, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export function AlertsPage() {
  const { employee } = useAuthStore();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAlerts = async () => {
    if (!employee?.active_branch_id) return;
    try {
      // Mock data
      const data: Alert[] = [
        { id: '1', type: 'delay', description: 'Pedido demorado (Más de 30 min)', area: 'Cocina / Mesa 12', time: new Date(Date.now() - 1000 * 60 * 35).toISOString(), status: 'pending' },
        { id: '2', type: 'service', description: 'Mesa requiere atención', area: 'Mesa 05', time: new Date(Date.now() - 1000 * 60 * 5).toISOString(), status: 'pending' },
        { id: '3', type: 'stock', description: 'Stock bajo: Cerveza 1L (Quedan 5)', area: 'Barra', time: new Date(Date.now() - 1000 * 60 * 120).toISOString(), status: 'resolved' },
      ];
      setAlerts(data);
    } catch (error) {
      toast.error('Error al cargar alertas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [employee?.active_branch_id]);

  const handleResolve = async (id: string) => {
    try {
      setAlerts(alerts.map(a => a.id === id ? { ...a, status: 'resolved' } : a));
      toast.success('Alerta resuelta');
    } catch (error) {
      toast.error('Error al resolver alerta');
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'delay': return <Clock className="h-5 w-5 text-red-500" />;
      case 'service': return <UserX className="h-5 w-5 text-yellow-500" />;
      case 'stock': return <PackageMinus className="h-5 w-5 text-orange-500" />;
      default: return <AlertTriangle className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alertas del Sistema</h1>
          <p className="text-muted-foreground mt-1">Notificaciones y problemas que requieren atención.</p>
        </div>
      </div>

      <Card className="shadow-sm border-border/50">
        <div className="rounded-md overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Área</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.length > 0 ? (
                alerts.map((alert) => (
                  <TableRow key={alert.id} className={alert.status === 'pending' ? 'bg-red-50/30 dark:bg-red-950/10' : ''}>
                    <TableCell>{getAlertIcon(alert.type)}</TableCell>
                    <TableCell className="font-medium">{alert.description}</TableCell>
                    <TableCell className="text-muted-foreground">{alert.area}</TableCell>
                    <TableCell className="font-medium">{formatTime(alert.time)}</TableCell>
                    <TableCell>
                      {alert.status === 'pending' ? (
                        <Badge variant="destructive" className="border-transparent">Pendiente</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Resuelta</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {alert.status === 'pending' && (
                        <Button size="sm" onClick={() => handleResolve(alert.id)}>
                          <CheckCircle className="mr-2 h-4 w-4" /> Resolver
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    <AlertTriangle className="mx-auto h-12 w-12 mb-4 opacity-20" />
                    <p className="text-lg font-medium">No hay alertas recientes</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
