import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

// Layout
import { DashboardLayout } from "@/components/layout/DashboardLayout";

// Pages
import { LoginPage } from "@/pages/LoginPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { OrdersPage } from "@/pages/OrdersPage";
import { TablesPage } from "@/pages/TablesPage";
import { MenuPage } from "@/pages/MenuPage";
import { ReservationsPage } from "@/pages/ReservationsPage";
import { ClientsPage } from "@/pages/ClientsPage";
import { PromotionsPage } from "@/pages/PromotionsPage";
import { StatisticsPage } from "@/pages/StatisticsPage";
import { EmployeesPage } from "@/pages/EmployeesPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { AlertsPage } from "@/pages/AlertsPage";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

// Auth Guard Component
const ProtectedRoute = ({ component: Component, roles }: { component: any, roles?: string[] }) => {
  const { isAuthenticated, employee } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  if (roles && employee && !roles.includes(employee.role)) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <DashboardLayout>
      <Component />
    </DashboardLayout>
  );
};

function Router() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      
      <Route path="/">
        <Redirect to="/dashboard" />
      </Route>

      <Route path="/dashboard">
        {() => <ProtectedRoute component={DashboardPage} />}
      </Route>

      <Route path="/orders">
        {() => <ProtectedRoute component={OrdersPage} roles={['admin', 'manager', 'kitchen', 'waiter']} />}
      </Route>

      <Route path="/tables">
        {() => <ProtectedRoute component={TablesPage} roles={['admin', 'manager', 'waiter']} />}
      </Route>

      <Route path="/menu">
        {() => <ProtectedRoute component={MenuPage} roles={['admin']} />}
      </Route>

      <Route path="/reservations">
        {() => <ProtectedRoute component={ReservationsPage} roles={['admin', 'manager']} />}
      </Route>

      <Route path="/clients">
        {() => <ProtectedRoute component={ClientsPage} roles={['admin']} />}
      </Route>

      <Route path="/promotions">
        {() => <ProtectedRoute component={PromotionsPage} roles={['admin']} />}
      </Route>

      <Route path="/statistics">
        {() => <ProtectedRoute component={StatisticsPage} roles={['admin']} />}
      </Route>

      <Route path="/employees">
        {() => <ProtectedRoute component={EmployeesPage} roles={['admin']} />}
      </Route>

      <Route path="/settings">
        {() => <ProtectedRoute component={SettingsPage} roles={['admin']} />}
      </Route>

      <Route path="/alerts">
        {() => <ProtectedRoute component={AlertsPage} roles={['admin', 'manager', 'waiter']} />}
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
