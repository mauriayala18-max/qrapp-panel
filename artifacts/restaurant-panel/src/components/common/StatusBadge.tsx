import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type StatusType = 
  | 'pending' | 'preparing' | 'ready' | 'delivered' | 'completed' | 'cancelled'
  | 'libre' | 'ocupada' | 'reservada' | 'fuera de servicio'
  | 'confirmada' | 'resolved';

interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusConfig = (s: string) => {
    switch (s.toLowerCase()) {
      case 'libre':
      case 'confirmada':
      case 'completed':
      case 'completada':
      case 'resolved':
      case 'delivered':
        return { label: s, className: 'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400' };
      
      case 'ocupada':
      case 'preparing':
      case 'en preparación':
      case 'pending':
      case 'pendiente':
        return { label: s, className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400' };
      
      case 'reservada':
      case 'ready':
      case 'listo':
      case 'listos':
        return { label: s, className: 'bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400' };
      
      case 'fuera de servicio':
      case 'cancelled':
      case 'cancelada':
      case 'cancelados':
        return { label: s, className: 'bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400' };
        
      default:
        return { label: s, className: 'bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300' };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge 
      variant="outline" 
      className={cn("capitalize font-medium border-transparent", config.className, className)}
      data-testid={`status-badge-${status}`}
    >
      {config.label}
    </Badge>
  );
}
