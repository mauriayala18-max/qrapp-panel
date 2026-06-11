import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Client } from '@/types';
import { getClients } from '@/services/clients';
import { formatPrice, formatDate } from '@/lib/utils';
import { TableRowSkeleton } from '@/components/common/LoadingSkeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, User, Phone, Mail, Award } from 'lucide-react';
import { toast } from 'react-hot-toast';

export function ClientsPage() {
  const { employee } = useAuthStore();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchClients = async () => {
    if (!employee?.active_branch_id) return;
    try {
      // Mock data
      const data: Client[] = [
        { id: '1', name: 'Juan Pérez', email: 'juan@example.com', phone: '0981 123 456', total_visits: 12, last_visit: '2023-10-25', total_spent: 1500000 },
        { id: '2', name: 'Ana Silva', email: 'ana@example.com', phone: '0982 456 789', total_visits: 5, last_visit: '2023-11-02', total_spent: 600000 },
        { id: '3', name: 'Carlos Ruiz', email: 'carlos@example.com', phone: '0983 789 012', total_visits: 25, last_visit: '2023-11-10', total_spent: 3200000 },
        { id: '4', name: 'Laura Martínez', email: 'laura@example.com', phone: '0984 012 345', total_visits: 2, last_visit: '2023-09-15', total_spent: 250000 },
      ];
      setClients(data);
    } catch (error) {
      toast.error('Error al cargar clientes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [employee?.active_branch_id]);

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground mt-1">Base de datos de clientes y su historial.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por nombre, email o teléfono..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card className="shadow-sm border-border/50">
        <div className="rounded-md overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead className="text-center">Visitas</TableHead>
                <TableHead>Última Visita</TableHead>
                <TableHead className="text-right">Total Gastado</TableHead>
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
              ) : filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
                          <User className="h-4 w-4" />
                        </div>
                        {client.name}
                        {client.total_visits > 10 && <Award className="h-4 w-4 text-yellow-500" aria-label="Cliente Frecuente" />}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground flex flex-col gap-1">
                        {client.phone && <div className="flex items-center"><Phone className="h-3 w-3 mr-1" /> {client.phone}</div>}
                        {client.email && <div className="flex items-center"><Mail className="h-3 w-3 mr-1" /> {client.email}</div>}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="bg-muted px-2 py-1 rounded-md text-sm font-medium">
                        {client.total_visits}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(client.last_visit)}</TableCell>
                    <TableCell className="text-right font-medium">{formatPrice(client.total_spent)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">Ver Detalles</Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    <User className="mx-auto h-12 w-12 mb-4 opacity-20" />
                    <p className="text-lg font-medium">No se encontraron clientes</p>
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
