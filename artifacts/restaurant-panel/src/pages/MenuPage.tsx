import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { MenuItem } from '@/types';
import { getMenu, createMenuItem, updateMenuItem, deleteMenuItem } from '@/services/menu';
import { formatPrice } from '@/lib/utils';
import { MenuCardSkeleton } from '@/components/common/LoadingSkeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';

export function MenuPage() {
  const { employee } = useAuthStore();
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('todos');
  
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    available: true
  });

  const categories = ['Platos Principales', 'Entradas', 'Postres', 'Bebidas', 'Cafetería'];

  const fetchMenu = async () => {
    if (!employee?.active_branch_id) return;
    try {
      // Mock data
      const data: MenuItem[] = [
        { id: '1', name: 'Milanesa con Puré', description: 'Milanesa de carne vacuna con puré de papas casero', price: 80000, category: 'Platos Principales', available: true },
        { id: '2', name: 'Asado a la Olla', description: 'Asado cocido a fuego lento con mandioca y ensalada', price: 85000, category: 'Platos Principales', available: true },
        { id: '3', name: 'Sopa de Pescado', description: 'Sopa tradicional de surubí con verduras', price: 40000, category: 'Entradas', available: true },
        { id: '4', name: 'Flan Casero', description: 'Flan de huevo con dulce de leche', price: 30000, category: 'Postres', available: true },
        { id: '5', name: 'Gaseosa 500ml', description: 'Línea Coca-Cola', price: 15000, category: 'Bebidas', available: true },
        { id: '6', name: 'Cerveza 1L', description: 'Cerveza nacional en botella', price: 35000, category: 'Bebidas', available: false },
      ];
      setMenu(data);
    } catch (error) {
      toast.error('Error al cargar el menú');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [employee?.active_branch_id]);

  const handleOpenDialog = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        available: item.available
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: categories[0],
        available: true
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.category || formData.price <= 0) {
      toast.error('Complete los campos obligatorios');
      return;
    }

    try {
      if (editingItem) {
        // await updateMenuItem(employee?.active_branch_id!, editingItem.id, formData);
        setMenu(menu.map(i => i.id === editingItem.id ? { ...i, ...formData } : i));
        toast.success('Plato actualizado');
      } else {
        // const newItem = await createMenuItem(employee?.active_branch_id!, formData);
        const newItem = { ...formData, id: Math.random().toString() };
        setMenu([...menu, newItem]);
        toast.success('Plato creado');
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast.error('Error al guardar');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Está seguro de eliminar este plato?')) {
      try {
        // await deleteMenuItem(employee?.active_branch_id!, id);
        setMenu(menu.filter(i => i.id !== id));
        toast.success('Plato eliminado');
      } catch (error) {
        toast.error('Error al eliminar');
      }
    }
  };

  const handleToggleAvailable = async (id: string, current: boolean) => {
    try {
      // await updateMenuItem(employee?.active_branch_id!, id, { available: !current });
      setMenu(menu.map(i => i.id === id ? { ...i, available: !current } : i));
      toast.success(current ? 'Marcado como agotado' : 'Marcado como disponible');
    } catch (error) {
      toast.error('Error al actualizar disponibilidad');
    }
  };

  const filteredMenu = menu.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'todos' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Menú y Carta</h1>
          <p className="text-muted-foreground mt-1">Gestiona los platos, precios y disponibilidad.</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="shadow-sm">
          <Plus className="mr-2 h-4 w-4" /> Nuevo Plato
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar platos o ingredientes..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="w-full flex overflow-x-auto h-auto p-1 bg-transparent border-b rounded-none justify-start pb-px">
          <TabsTrigger 
            value="todos" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
          >
            Todos
          </TabsTrigger>
          {categories.map(cat => (
            <TabsTrigger 
              key={cat} 
              value={cat} 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
            >
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => <MenuCardSkeleton key={i} />)
            ) : filteredMenu.length > 0 ? (
              filteredMenu.map((item) => (
                <Card key={item.id} className={`overflow-hidden transition-all hover:shadow-md ${!item.available ? 'opacity-70 grayscale-[0.3]' : ''}`}>
                  <div className="h-32 bg-muted flex items-center justify-center text-muted-foreground/30 relative">
                    <ImageIcon className="h-12 w-12" />
                    {!item.available && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white font-bold px-3 py-1 bg-red-500 rounded text-sm uppercase tracking-wider">Agotado</span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg leading-tight truncate pr-2">{item.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 h-10 mb-4">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-bold text-primary text-xl">{formatPrice(item.price)}</span>
                      <span className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground font-medium">{item.category}</span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={item.available} 
                          onCheckedChange={() => handleToggleAvailable(item.id, item.available)}
                        />
                        <span className="text-sm font-medium text-muted-foreground">
                          {item.available ? 'Disponible' : 'Oculto'}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => handleOpenDialog(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                <UtensilsCrossed className="mx-auto h-12 w-12 mb-4 opacity-20" />
                <p className="text-lg font-medium">No se encontraron platos</p>
              </div>
            )}
          </div>
        </div>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Editar Plato' : 'Nuevo Plato'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del plato *</Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                placeholder="Ej. Hamburguesa Doble"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Categoría *</Label>
              <Select value={formData.category} onValueChange={(val) => setFormData({...formData, category: val})}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Precio (Gs.) *</Label>
              <Input 
                id="price" 
                type="number"
                value={formData.price || ''} 
                onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} 
                placeholder="35000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea 
                id="description" 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
                placeholder="Ingredientes y detalles..."
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-md mt-2">
              <div>
                <Label className="text-base">Disponible</Label>
                <p className="text-sm text-muted-foreground">Mostrar en el menú a los clientes</p>
              </div>
              <Switch 
                checked={formData.available} 
                onCheckedChange={(checked) => setFormData({...formData, available: checked})} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Guardar plato</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Needed for empty state icon above
import { UtensilsCrossed } from 'lucide-react';
