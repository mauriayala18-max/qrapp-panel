import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Receipt, 
  LayoutGrid, 
  UtensilsCrossed, 
  CalendarDays, 
  Users, 
  Tag, 
  BarChart2, 
  UserCog, 
  Settings, 
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import api from '@/services/api';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (val: boolean) => void;
}

export function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }: SidebarProps) {
  const [location] = useLocation();
  const { employee, logout } = useAuthStore();
  const [pendingOrders, setPendingOrders] = useState(0);
  const [pendingAlerts, setPendingAlerts] = useState(0);

  // Poll for badges
  useEffect(() => {
    if (!employee?.active_branch_id) return;
    
    const fetchBadges = async () => {
      try {
        const { data } = await api.get(`/api/v1/panel/branches/${employee.active_branch_id}/dashboard`);
        setPendingOrders(data.active_orders || 0);
        setPendingAlerts(data.pending_alerts || 0);
      } catch (err) {
        // Silent fail for polling
      }
    };

    fetchBadges();
    const interval = setInterval(fetchBadges, 30000);
    return () => clearInterval(interval);
  }, [employee?.active_branch_id]);

  if (!employee) return null;

  const role = employee.role;

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'manager', 'waiter'] },
    { name: 'Pedidos', path: '/orders', icon: Receipt, roles: ['admin', 'manager', 'kitchen', 'waiter'], badge: pendingOrders },
    { name: 'Mesas', path: '/tables', icon: LayoutGrid, roles: ['admin', 'manager', 'waiter'] },
    { name: 'Menú', path: '/menu', icon: UtensilsCrossed, roles: ['admin'] },
    { name: 'Reservas', path: '/reservations', icon: CalendarDays, roles: ['admin', 'manager'] },
    { name: 'Clientes', path: '/clients', icon: Users, roles: ['admin'] },
    { name: 'Promociones', path: '/promotions', icon: Tag, roles: ['admin'] },
    { name: 'Estadísticas', path: '/statistics', icon: BarChart2, roles: ['admin'] },
    { name: 'Empleados', path: '/employees', icon: UserCog, roles: ['admin'] },
    { name: 'Configuración', path: '/settings', icon: Settings, roles: ['admin'] },
    { name: 'Alertas', path: '/alerts', icon: Bell, roles: ['admin', 'manager', 'waiter'], badge: pendingAlerts },
  ];

  const visibleItems = menuItems.filter(item => item.roles.includes(role));

  const sidebarClass = cn(
    "fixed inset-y-0 left-0 z-40 bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out border-r border-sidebar-border flex flex-col",
    collapsed ? "w-[72px]" : "w-[260px]",
    mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={sidebarClass}>
        <div className={cn("flex items-center h-16 px-4 border-b border-sidebar-border shrink-0", collapsed ? "justify-center" : "justify-between")}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">QR</span>
            </div>
            {!collapsed && <span className="font-bold text-white text-lg tracking-tight">QR App</span>}
          </div>
          {!collapsed && (
            <Button variant="ghost" size="icon" className="hidden md:flex text-sidebar-foreground hover:text-white" onClick={() => setCollapsed(true)}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
        </div>

        {collapsed && (
          <div className="hidden md:flex justify-center mt-2">
            <Button variant="ghost" size="icon" className="text-sidebar-foreground hover:text-white" onClick={() => setCollapsed(false)}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1 custom-scrollbar">
          {visibleItems.map((item) => {
            const isActive = location === item.path || location.startsWith(`${item.path}/`);
            return (
              <Link key={item.path} href={item.path} onClick={() => setMobileOpen(false)}>
                <div 
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors cursor-pointer group relative",
                    isActive 
                      ? "bg-primary/10 text-white" 
                      : "text-sidebar-foreground hover:bg-white/5 hover:text-white",
                    collapsed && "justify-center px-0"
                  )}
                  data-testid={`link-sidebar-${item.name.toLowerCase()}`}
                >
                  {isActive && !collapsed && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-primary rounded-r-full" />
                  )}
                  {isActive && collapsed && (
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary" />
                  )}
                  
                  <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-300")} />
                  
                  {!collapsed && (
                    <span className="font-medium flex-1">{item.name}</span>
                  )}

                  {!collapsed && item.badge !== undefined && item.badge > 0 && (
                    <Badge variant="default" className="bg-primary text-white h-5 px-1.5 min-w-5 flex items-center justify-center text-xs">
                      {item.badge}
                    </Badge>
                  )}

                  {collapsed && item.badge !== undefined && item.badge > 0 && (
                    <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-primary rounded-full" />
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-sidebar-border shrink-0">
          {!collapsed ? (
            <div className="flex items-center justify-between">
              <div className="flex flex-col truncate pr-2">
                <span className="text-sm font-medium text-white truncate">{employee.name}</span>
                <span className="text-xs text-sidebar-foreground capitalize">{employee.role}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={logout} className="text-sidebar-foreground hover:text-white shrink-0" data-testid="button-logout-sidebar">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="flex justify-center">
              <Button variant="ghost" size="icon" onClick={logout} className="text-sidebar-foreground hover:text-white" title="Cerrar sesión">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
