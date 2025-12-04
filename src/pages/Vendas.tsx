import { useState } from 'react';
import {
  Plus,
  Search,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Eye,
  Filter,
} from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { StatsCard } from '@/components/common/StatsCard';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const sales = [
  { id: 1, date: '04/12/2024', customer: 'Maria Silva', items: 2, total: 1250.00, status: 'concluído', channel: 'Loja Física' },
  { id: 2, date: '04/12/2024', customer: 'João Santos', items: 1, total: 890.00, status: 'pendente', channel: 'WhatsApp' },
  { id: 3, date: '03/12/2024', customer: 'Ana Costa', items: 3, total: 2100.00, status: 'concluído', channel: 'Loja Física' },
  { id: 4, date: '03/12/2024', customer: 'Pedro Lima', items: 1, total: 450.00, status: 'cancelado', channel: 'Instagram' },
  { id: 5, date: '02/12/2024', customer: 'Carla Souza', items: 2, total: 1780.00, status: 'concluído', channel: 'Loja Física' },
  { id: 6, date: '02/12/2024', customer: 'Roberto Alves', items: 1, total: 650.00, status: 'concluído', channel: 'WhatsApp' },
];

const statusStyles = {
  concluído: 'bg-success/10 text-success border-success/20',
  pendente: 'bg-warning/10 text-warning border-warning/20',
  cancelado: 'bg-destructive/10 text-destructive border-destructive/20',
};

export default function Vendas() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sale.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalSales = sales.filter(s => s.status === 'concluído').length;
  const totalRevenue = sales.filter(s => s.status === 'concluído').reduce((acc, s) => acc + s.total, 0);
  const avgTicket = totalSales > 0 ? totalRevenue / totalSales : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestão de Vendas"
        description={`${sales.length} vendas registradas`}
      >
        <Button className="gradient-primary text-primary-foreground hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4 mr-2" />
          Nova Venda
        </Button>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="Vendas Concluídas"
          value={totalSales.toString()}
          icon={ShoppingCart}
          variant="primary"
        />
        <StatsCard
          title="Receita Total"
          value={`R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={DollarSign}
          variant="success"
        />
        <StatsCard
          title="Ticket Médio"
          value={`R$ ${avgTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={TrendingUp}
          variant="secondary"
        />
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="concluído">Concluído</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Sales List */}
      {filteredSales.length === 0 ? (
        <EmptyState
          icon={Filter}
          title="Nenhuma venda encontrada"
          description="Tente ajustar os filtros de busca"
          action={
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}>
              Limpar Filtros
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4">
          {filteredSales.map((sale, index) => (
            <div
              key={sale.id}
              className="bg-card rounded-xl border border-border p-4 transition-all duration-300 hover:shadow-lg hover:border-primary/30 animate-fade-in group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {sale.customer}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {sale.date} • {sale.channel} • {sale.items} {sale.items === 1 ? 'item' : 'itens'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Badge variant="outline" className={statusStyles[sale.status as keyof typeof statusStyles]}>
                    {sale.status}
                  </Badge>
                  <span className="font-bold text-lg text-foreground">
                    R$ {sale.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
