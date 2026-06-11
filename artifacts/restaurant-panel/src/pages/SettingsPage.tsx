import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'react-hot-toast';
import { Save } from 'lucide-react';

export function SettingsPage() {
  const handleSave = () => {
    toast.success('Configuración guardada correctamente');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground mt-1">Administra las preferencias de esta sucursal.</p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Información General</CardTitle>
          <CardDescription>Datos públicos de la sucursal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la sucursal</Label>
              <Input id="name" defaultValue="Sucursal Centro" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono de contacto</Label>
              <Input id="phone" defaultValue="+595 981 123 456" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Dirección</Label>
              <Input id="address" defaultValue="Av. Mariscal López esq. San Martín" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/50 px-6 py-4 border-t">
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" /> Guardar cambios
          </Button>
        </CardFooter>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Configuración de Pedidos</CardTitle>
          <CardDescription>Preferencias para la atención al cliente</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Permitir reservas online</Label>
              <p className="text-sm text-muted-foreground">Los clientes podrán solicitar mesas desde la app</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Propinas automáticas</Label>
              <p className="text-sm text-muted-foreground">Sugerir 10% de propina al cerrar la cuenta</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="space-y-2">
            <Label>Tiempo estimado de preparación (minutos)</Label>
            <div className="flex items-center gap-4">
              <Input type="number" defaultValue="15" className="w-24" />
              <p className="text-sm text-muted-foreground">Tiempo por defecto para nuevos pedidos</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/50 px-6 py-4 border-t">
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" /> Guardar cambios
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
