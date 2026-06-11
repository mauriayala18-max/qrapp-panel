import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { login } from '@/services/auth';
import { useAuthStore } from '@/stores/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Eye, EyeOff, Store } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Correo electrónico inválido' }),
  password: z.string().min(1, { message: 'La contraseña es requerida' }),
});

export function LoginPage() {
  const [, setLocation] = useLocation();
  const { login: setAuth, isAuthenticated, employee, switchBranch } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showBranchModal, setShowBranchModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated && employee) {
      if (!employee.active_branch_id && employee.branch_ids.length > 1) {
        setShowBranchModal(true);
      } else {
        setLocation('/dashboard');
      }
    }
  }, [isAuthenticated, employee, setLocation]);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      setIsLoading(true);
      // Simulating API call for mockup since backend might not exist yet
      // const data = await login(values.email, values.password);
      
      // Mock data
      const data = {
        token: 'mock-token',
        employee: {
          id: '1',
          name: 'Admin User',
          email: values.email,
          role: 'admin',
          branch_ids: ['1', '2'],
          active_branch_id: '',
        }
      };

      setAuth({ token: data.token, employee: data.employee as any });
      
      if (data.employee.branch_ids.length > 1) {
        setShowBranchModal(true);
      } else {
        // Set first branch as active
        switchBranch(data.employee.branch_ids[0]);
        toast.success('Sesión iniciada correctamente');
        setLocation('/dashboard');
      }
    } catch (error) {
      toast.error('Credenciales incorrectas o error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBranchSelect = (branchId: string) => {
    switchBranch(branchId);
    setShowBranchModal(false);
    toast.success('Sucursal seleccionada');
    setLocation('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/50 p-4">
      <Card className="w-full max-w-md shadow-lg border-none">
        <CardHeader className="space-y-3 text-center pb-8 pt-10">
          <div className="mx-auto bg-primary w-14 h-14 rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-2xl tracking-tighter">QR</span>
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">Panel de Restaurante</CardTitle>
            <CardDescription className="text-base">QR App</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pb-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <Input placeholder="admin@restaurante.com" {...field} data-testid="input-email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          {...field} 
                          data-testid="input-password" 
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                          data-testid="button-toggle-password"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full text-base py-6 font-medium shadow-sm hover:shadow-md transition-all" 
                disabled={isLoading}
                data-testid="button-submit-login"
              >
                {isLoading ? "Iniciando..." : "Iniciar sesión"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Dialog open={showBranchModal} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md" data-testid="dialog-branch-selector">
          <DialogHeader>
            <DialogTitle className="text-center text-xl pb-2">Seleccionar sucursal</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 pt-4">
            {employee?.branch_ids.map((id) => (
              <Button
                key={id}
                variant="outline"
                className="h-16 justify-start px-6 text-base font-medium border-muted-foreground/20 hover:border-primary hover:bg-primary/5"
                onClick={() => handleBranchSelect(id)}
                data-testid={`button-select-branch-${id}`}
              >
                <Store className="mr-4 h-5 w-5 text-muted-foreground" />
                Sucursal {id}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
