import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Promotion } from '@/types';
import { getPromotions } from '@/services/promotions';
import { formatDate } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Tag, Calendar, Users, Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Skeleton } from '@/components/ui/skeleton';

export function PromotionsPage() {
  const { employee } = useAuthStore();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPromotions = async () => {
    if (!employee?.active_branch_id) return;
    try {
      // Mock data
      const data: Promotion[] = [
        { id: '1', name: 'Descuento de Cumpleaños', discount: 15, type: 'percentage', code: 'CUMPLE15', valid_from: '2023-01-01', valid_until: '2024-12-31', uses: 45, active: true },
        { id: '2', name: 'Promo Almuerzo', discount: 20000, type: 'fixed', code: 'ALMUERZO20', valid_from: '2023-11-01', valid_until: '2023-11-30', uses: 120, active: true },
        { id: '3', name: 'Black Friday', discount: 30, type: 'percentage', code: 'BF30', valid_from: '2023-11-24', valid_until: '2023-11-26', uses: 0, active: false },
      ];
      setPromotions(data);
    } catch (error) {
      toast.error('Error al cargar promociones');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, [employee?.active_branch_id]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Promociones y Cupones</h1>
          <p className="text-muted-foreground mt-1">Crea y administra los descuentos para clientes.</p>
        </div>
        <Button className="shadow-sm">
          <Plus className="mr-2 h-4 w-4" /> Nueva Promoción
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-24 w-full rounded-none" />
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))
        ) : (
          promotions.map((promo) => (
            <Card key={promo.id} className={`overflow-hidden shadow-sm transition-all hover:shadow-md ${!promo.active ? 'opacity-70 grayscale-[0.5]' : ''}`}>
              <div className={`p-6 ${promo.active ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'} relative`}>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant={promo.active ? "secondary" : "outline"} className={promo.active ? "bg-white/20 text-white border-transparent" : ""}>
                    {promo.active ? 'Activa' : 'Inactiva'}
                  </Badge>
                  <Tag className="h-6 w-6 opacity-50" />
                </div>
                <h3 className="text-2xl font-bold mb-1">{promo.name}</h3>
                <div className="text-4xl font-black mt-4">
                  {promo.type === 'percentage' ? `${promo.discount}%` : `${promo.discount.toLocaleString('es-PY')} Gs.`}
                  <span className="text-sm font-normal opacity-80 ml-1">descuento</span>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center">
                      <Tag className="h-4 w-4 mr-2" /> Código:
                    </span>
                    <span className="font-mono font-bold bg-muted px-2 py-0.5 rounded">{promo.code}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center">
                      <Calendar className="h-4 w-4 mr-2" /> Válido:
                    </span>
                    <span>{formatDate(promo.valid_from)} - {formatDate(promo.valid_until)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center">
                      <Users className="h-4 w-4 mr-2" /> Usos:
                    </span>
                    <span className="font-medium">{promo.uses} veces</span>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-border">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" /> Editar
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
