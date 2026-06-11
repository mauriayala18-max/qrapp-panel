import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Table } from '@/types';
import { getTables, updateTableStatus } from '@/services/tables';
import { StatusBadge } from '@/components/common/StatusBadge';
import { TableCardSkeleton } from '@/components/common/LoadingSkeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Users, Clock, Receipt, MoreVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function TablesPage() {
  const { employee } = useAuthStore();
  const [tables, setTables] = useState<Table[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTables = async () => {
    if (!employee?.active_branch_id) return;
    try {
      // const data = await getTables(employee.active_branch_id);
      
      // Mock data
      const data: Table[] = Array.from({ length: 20 }, (_, i) => {
        const id = (i + 1).toString();
        const rand = Math.random();
        let status: 'libre' | 'ocupada' | 'reservada' | 'fuera de servicio' = 'libre';
        if (rand > 0.8) status = 'fuera de servicio';
        else if (rand > 0.6) status = 'reservada';
        else if (rand > 0.3) status = 'ocupada';
        
        return {
          id,
          number: id.padStart(2, '0'),
          status,
          capacity: i % 3 === 0 ? 6 : (i % 2 === 0 ? 2 : 4)
        };
      });
      setTables(data);
    } catch (error) {
      toast.error('Error al cargar mesas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, [employee?.active_branch_id]);

  const handleStatusChange = async (tableId: string, newStatus: string) => {
    try {
      // await updateTableStatus(employee?.active_branch_id!, tableId, newStatus);
      setTables(tables.map(t => t.id === tableId ? { ...t, status: newStatus as any } : t));
      toast.success('Estado actualizado');
    } catch (error) {
      toast.error('Error al actualizar el estado de la mesa');
    }
  };

  const getTableColorClass = (status: string) => {
    switch (status) {
      case 'libre': return 'border-green-500 bg-green-50/50 dark:bg-green-950/20';
      case 'ocupada': return 'border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20';
      case 'reservada': return 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20';
      case 'fuera de servicio': return 'border-gray-400 bg-gray-50/50 dark:bg-gray-900/20 opacity-60';
      default: return 'border-border bg-card';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'libre': return 'bg-green-500';
      case 'ocupada': return 'bg-yellow-500';
      case 'reservada': return 'bg-blue-500';
      case 'fuera de servicio': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const stats = {
    total: tables.length,
    libres: tables.filter(t => t.status === 'libre').length,
    ocupadas: tables.filter(t => t.status === 'ocupada').length,
    reservadas: tables.filter(t => t.status === 'reservada').length
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Mesas</h1>
          <p className="text-muted-foreground mt-1">Plano y estado actual de las mesas.</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-card rounded-md border shadow-sm text-sm font-medium">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            Libres: {stats.libres}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-card rounded-md border shadow-sm text-sm font-medium">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            Ocupadas: {stats.ocupadas}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-card rounded-md border shadow-sm text-sm font-medium">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            Reservadas: {stats.reservadas}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {isLoading ? (
          Array.from({ length: 12 }).map((_, i) => <TableCardSkeleton key={i} />)
        ) : (
          tables.map((table) => (
            <Card 
              key={table.id} 
              className={cn("overflow-hidden border-2 transition-all hover:shadow-md", getTableColorClass(table.status))}
            >
              <CardContent className="p-0 h-full flex flex-col relative">
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-black/10 dark:hover:bg-white/10">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Cambiar estado</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleStatusChange(table.id, 'libre')}>
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2" /> Libre
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(table.id, 'ocupada')}>
                        <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2" /> Ocupada
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(table.id, 'reservada')}>
                        <div className="w-2 h-2 rounded-full bg-blue-500 mr-2" /> Reservada
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(table.id, 'fuera de servicio')}>
                        <div className="w-2 h-2 rounded-full bg-gray-500 mr-2" /> Fuera de servicio
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="p-4 flex-1 flex flex-col items-center justify-center cursor-pointer" onClick={() => handleStatusChange(table.id, table.status === 'libre' ? 'ocupada' : 'libre')}>
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">MESA</div>
                  <div className="text-4xl font-bold text-foreground mb-3">{table.number}</div>
                  
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-medium mb-3">
                    <Users className="w-4 h-4" /> {table.capacity} pers.
                  </div>
                  
                  <div className="mt-auto">
                    <Badge variant="outline" className={cn("border-transparent text-white", getStatusColor(table.status))}>
                      {table.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                
                {table.status === 'ocupada' && (
                  <div className="bg-yellow-100 dark:bg-yellow-900 border-t border-yellow-200 dark:border-yellow-800 p-2 text-xs flex justify-between items-center text-yellow-800 dark:text-yellow-200">
                    <div className="flex items-center font-medium">
                      <Clock className="w-3 h-3 mr-1" /> 45m
                    </div>
                    <div className="flex items-center font-bold">
                      <Receipt className="w-3 h-3 mr-1" /> 185K
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
