import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Employee } from '@/types';
import { getEmployees } from '@/services/employees';
import { TableRowSkeleton } from '@/components/common/LoadingSkeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, UserX, Store } from 'lucide-react';
import { toast } from 'react-hot-toast';

export function EmployeesPage() {
  const { employee: currentEmployee } = useAuthStore();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEmployees = async () => {
    if (!currentEmployee?.active_branch_id) return;
    try {
      // Mock data
      const data: Employee[] = [
        { id: '1', name: 'Admin User', email: 'admin@restaurante.com', role: 'admin', branch_ids: ['1', '2'], active_branch_id: '1' },
        { id: '2', name: 'Carlos Gerente', email: 'carlos@restaurante.com', role: 'manager', branch_ids: ['1'], active_branch_id: '1' },
        { id: '3', name: 'Mario Chef', email: 'mario@restaurante.com', role: 'kitchen', branch_ids: ['1'], active_branch_id: '1' },
        { id: '4', name: 'Sofia Moza', email: 'sofia@restaurante.com', role: 'waiter', branch_ids: ['1'], active_branch_id: '1' },
        { id: '5', name: 'Lucas Mozo', email: 'lucas@restaurante.com', role: 'waiter', branch_ids: ['1'], active_branch_id: '1' },
      ];
      setEmployees(data);
    } catch (error) {
      toast.error('Error al cargar empleados');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [currentEmployee?.active_branch_id]);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin': return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 border-transparent dark:bg-purple-900/30 dark:text-purple-400">Administrador</Badge>;
      case 'manager': return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-transparent dark:bg-blue-900/30 dark:text-blue-400">Gerente</Badge>;
      case 'kitchen': return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 border-transparent dark:bg-orange-900/30 dark:text-orange-400">Cocina</Badge>;
      case 'waiter': return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-transparent dark:bg-green-900/30 dark:text-green-400">Mozo/a</Badge>;
      default: return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Empleados</h1>
          <p className="text-muted-foreground mt-1">Administra el personal y sus roles de acceso.</p>
        </div>
        <Button className="shadow-sm">
          <Plus className="mr-2 h-4 w-4" /> Nuevo Empleado
        </Button>
      </div>

      <Card className="shadow-sm border-border/50">
        <div className="rounded-md overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Correo Electrónico</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Sucursales</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={6}><TableRowSkeleton columns={6} /></TableCell>
                  </TableRow>
                ))
              ) : (
                employees.map((emp) => (
                  <TableRow key={emp.id}>
                    <TableCell className="font-medium">{emp.name}</TableCell>
                    <TableCell className="text-muted-foreground">{emp.email}</TableCell>
                    <TableCell>{getRoleBadge(emp.role)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Store className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-medium">{emp.branch_ids.length}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Activo</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                          <UserX className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
