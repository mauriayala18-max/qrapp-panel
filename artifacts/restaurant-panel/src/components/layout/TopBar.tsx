import React from 'react';
import { useAuthStore } from '@/stores/authStore';
import { LogOut, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';

interface TopBarProps {
  onMenuToggle: () => void;
}

export function TopBar({ onMenuToggle }: TopBarProps) {
  const { employee, logout, switchBranch } = useAuthStore();

  if (!employee) return null;

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'manager': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'kitchen': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'waiter': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden" 
          onClick={onMenuToggle}
          data-testid="button-menu-toggle"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="font-semibold text-foreground hidden sm:block">
          Sucursal Centro {/* In a real app, map active_branch_id to name */}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {employee.branch_ids && employee.branch_ids.length > 1 && (
          <div className="hidden sm:block">
            <Select 
              value={employee.active_branch_id} 
              onValueChange={switchBranch}
            >
              <SelectTrigger className="w-[180px] h-9" data-testid="select-branch">
                <SelectValue placeholder="Seleccionar sucursal" />
              </SelectTrigger>
              <SelectContent>
                {employee.branch_ids.map(id => (
                  <SelectItem key={id} value={id}>Sucursal {id}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex items-center gap-3 border-l pl-4 border-border ml-2">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-medium leading-none" data-testid="text-employee-name">
              {employee.name}
            </span>
            <Badge 
              variant="secondary" 
              className={`mt-1 text-[10px] px-1.5 py-0 rounded-sm uppercase tracking-wider font-semibold border-transparent ${getRoleColor(employee.role)}`}
            >
              {employee.role}
            </Badge>
          </div>
          <div className="h-9 w-9 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <User className="h-5 w-5" />
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:text-destructive" 
            onClick={logout}
            title="Cerrar sesión"
            data-testid="button-logout-topbar"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
