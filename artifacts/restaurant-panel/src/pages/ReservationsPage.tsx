import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Reservation } from '@/types';
import { getReservations, updateReservation } from '@/services/reservations';
import { formatTime } from '@/lib/utils';
import { StatusBadge } from '@/components/common/StatusBadge';
import { TableRowSkeleton } from '@/components/common/LoadingSkeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon, User, MessageSquare, Phone, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

export function ReservationsPage() {
  const { employee } = useAuthStore();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState<Date>(new Date());

  const fetchReservations = async (selectedDate: Date) => {
    if (!employee?.active_branch_id) return;
    setIsLoading(true);
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      // const data = await getReservations(employee.active_branch_id, dateStr);
      
      // Mock data
      const data: Reservation[] = [
        { id: '1', client_name: 'Roberto Gómez', date: `${dateStr}T20:00:00Z`, guests: 4, table_id: '12', status: 'confirmada', notes: 'Cumpleaños' },
        { id: '2', client_name: 'Ana Silva', date: `${dateStr}T21:30:00Z`, guests: 2, table_id: '05', status: 'pendiente' },
        { id: '3', client_name: 'Carlos Ruiz', date: `${dateStr}T19:00:00Z`, guests: 6, status: 'cancelada', notes: 'Canceló por teléfono' },
        { id: '4', client_name: 'Laura Martínez', date: `${dateStr}T13:00:00Z`, guests: 3, table_id: '08', status: 'completada' },
      ];
      setReservations(data);
    } catch (error) {
      toast.error('Error al cargar reservas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations(date);
  }, [date, employee?.active_branch_id]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      // await updateReservation(employee?.active_branch_id!, id, { status: newStatus });
      setReservations(reservations.map(r => r.id === id ? { ...r, status: newStatus as any } : r));
      toast.success('Reserva actualizada');
    } catch (error) {
      toast.error('Error al actualizar reserva');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reservas</h1>
          <p className="text-muted-foreground mt-1">Gestiona las reservas de mesas.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal bg-card shadow-sm",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                initialFocus
                locale={es}
              />
            </PopoverContent>
          </Popover>
          <Button className="shadow-sm">Nueva Reserva</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full">
              <User className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Personas</p>
              <h3 className="text-2xl font-bold">
                {reservations.filter(r => ['confirmada', 'completada'].includes(r.status)).reduce((acc, r) => acc + r.guests, 0)}
              </h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full">
              <CalendarIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Confirmadas</p>
              <h3 className="text-2xl font-bold">
                {reservations.filter(r => r.status === 'confirmada').length}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-border/50">
        <div className="rounded-md overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Hora</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Personas</TableHead>
                <TableHead>Mesa Asignada</TableHead>
                <TableHead>Notas</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={7}><TableRowSkeleton columns={7} /></TableCell>
                  </TableRow>
                ))
              ) : reservations.length > 0 ? (
                reservations.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell className="font-bold text-lg">{formatTime(reservation.date)}</TableCell>
                    <TableCell>
                      <div className="font-medium">{reservation.client_name}</div>
                      <div className="text-xs text-muted-foreground flex items-center mt-1">
                        <Phone className="h-3 w-3 mr-1" /> +595 981 123 456
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center bg-muted w-fit px-2 py-1 rounded text-sm font-medium">
                        <User className="h-4 w-4 mr-1" /> {reservation.guests}
                      </div>
                    </TableCell>
                    <TableCell>
                      {reservation.table_id ? (
                        <span className="font-medium px-2 py-1 bg-primary/10 text-primary rounded border border-primary/20">
                          Mesa {reservation.table_id}
                        </span>
                      ) : (
                        <span className="text-muted-foreground italic">No asignada</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {reservation.notes ? (
                        <div className="flex items-start gap-1 text-sm text-muted-foreground max-w-[200px]">
                          <MessageSquare className="h-4 w-4 shrink-0 mt-0.5" />
                          <span className="truncate">{reservation.notes}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell><StatusBadge status={reservation.status} /></TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => {}}>Editar reserva</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {}}>Asignar mesa</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleStatusChange(reservation.id, 'confirmada')}>Marcar Confirmada</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(reservation.id, 'completada')}>Marcar Completada</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(reservation.id, 'cancelada')} className="text-red-600">Cancelar reserva</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    <CalendarIcon className="mx-auto h-12 w-12 mb-4 opacity-20" />
                    <p className="text-lg font-medium">No hay reservas para esta fecha</p>
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
