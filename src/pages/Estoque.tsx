import { useState } from 'react';
import {
  Plus,
  Download,
  Search,
  Package,
  AlertTriangle,
  DollarSign,
  Grid3x3,
  List,
  Filter,
} from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { StatsCard } from '@/components/common/StatsCard';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const products = [
  { id: 1, name: 'Óculos Ray-Ban Aviador', ref: 'RB-3025', category: 'Óculos de Sol', brand: 'Ray-Ban', stock: 15, minStock: 5, price: 890.00, image: null },
  { id: 2, name: 'Armação Oakley Crosslink', ref: 'OK-CL-01', category: 'Armações', brand: 'Oakley', stock: 8, minStock: 3, price: 650.00, image: null },
  { id: 3, name: 'Lente Transitions Gen 8', ref: 'LT-G8-01', category: 'Lentes', brand: 'Transitions', stock: 3, minStock: 10, price: 420.00, image: null },
  { id: 4, name: 'Óculos Chilli Beans Sport', ref: 'CB-SP-22', category: 'Óculos de Sol', brand: 'Chilli Beans', stock: 22, minStock: 8, price: 320.00, image: null },
  { id: 5, name: 'Estojo Premium Couro', ref: 'EST-PR-01', category: 'Acessórios', brand: 'Genérico', stock: 45, minStock: 15, price: 85.00, image: null },
  { id: 6, name: 'Lente Varilux X Series', ref: 'VX-XS-02', category: 'Lentes', brand: 'Varilux', stock: 2, minStock: 5, price: 1250.00, image: null },
];

export default function Estoque() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.ref.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStock = stockFilter === 'all' ||
      (stockFilter === 'low' && product.stock <= product.minStock) ||
      (stockFilter === 'normal' && product.stock > product.minStock);
    return matchesSearch && matchesCategory && matchesStock;
  });

  const totalProducts = products.length;
  const lowStockCount = products.filter(p => p.stock <= p.minStock).length;
  const totalValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestão de Estoque"
        description={`${totalProducts} produtos • ${lowStockCount} com estoque baixo`}
      >
        <Button variant="outline" size="icon">
          <Download className="w-4 h-4" />
        </Button>
        <Button className="gradient-primary text-primary-foreground hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4 mr-2" />
          Novo Produto
        </Button>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="Total de Produtos"
          value={totalProducts.toString()}
          icon={Package}
          variant="primary"
        />
        <StatsCard
          title="Estoque Baixo"
          value={lowStockCount.toString()}
          icon={AlertTriangle}
          variant="warning"
        />
        <StatsCard
          title="Valor em Estoque"
          value={`R$ ${totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={DollarSign}
          variant="success"
        />
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, referência ou código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="Óculos de Sol">Óculos de Sol</SelectItem>
                <SelectItem value="Armações">Armações</SelectItem>
                <SelectItem value="Lentes">Lentes</SelectItem>
                <SelectItem value="Acessórios">Acessórios</SelectItem>
              </SelectContent>
            </Select>

            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Estoque" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="low">Baixo</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex border border-border rounded-lg overflow-hidden">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'gradient-primary text-primary-foreground' : ''}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'gradient-primary text-primary-foreground' : ''}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      {filteredProducts.length === 0 ? (
        <EmptyState
          icon={Filter}
          title="Nenhum produto encontrado"
          description="Tente ajustar os filtros de busca"
          action={
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setCategoryFilter('all');
              setStockFilter('all');
            }}>
              Limpar Filtros
            </Button>
          }
        />
      ) : (
        <div className={cn(
          'grid gap-4',
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        )}>
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className={cn(
                'bg-card rounded-xl border border-border p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in group',
                viewMode === 'list' && 'flex items-center gap-4'
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Product Image Placeholder */}
              <div className={cn(
                'bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center overflow-hidden',
                viewMode === 'grid' ? 'aspect-square mb-3' : 'w-16 h-16 flex-shrink-0'
              )}>
                <Package className="w-8 h-8 text-muted-foreground/50" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">{product.ref}</p>
                  </div>
                  {product.stock <= product.minStock && (
                    <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 flex-shrink-0">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Baixo
                    </Badge>
                  )}
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <div>
                    <span className="text-sm text-muted-foreground">Estoque: </span>
                    <span className={cn(
                      'font-medium',
                      product.stock <= product.minStock ? 'text-destructive' : 'text-foreground'
                    )}>
                      {product.stock}
                    </span>
                  </div>
                  <span className="font-bold text-primary">
                    R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
