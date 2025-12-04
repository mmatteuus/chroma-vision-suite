import { useState } from 'react';
import {
  Plus,
  Search,
  Users,
  UserCheck,
  ShoppingCart,
  Phone,
  Mail,
  MapPin,
  Eye,
  Filter,
} from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { StatsCard } from '@/components/common/StatsCard';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const customers = [
  { id: 1, name: 'Maria Silva', email: 'maria@email.com', phone: '(11) 99999-0001', city: 'São Paulo', totalPurchases: 5, totalSpent: 4250.00, lastPurchase: '04/12/2024' },
  { id: 2, name: 'João Santos', email: 'joao@email.com', phone: '(11) 99999-0002', city: 'São Paulo', totalPurchases: 3, totalSpent: 2890.00, lastPurchase: '03/12/2024' },
  { id: 3, name: 'Ana Costa', email: 'ana@email.com', phone: '(21) 99999-0003', city: 'Rio de Janeiro', totalPurchases: 8, totalSpent: 7800.00, lastPurchase: '02/12/2024' },
  { id: 4, name: 'Pedro Lima', email: 'pedro@email.com', phone: '(31) 99999-0004', city: 'Belo Horizonte', totalPurchases: 2, totalSpent: 1450.00, lastPurchase: '28/11/2024' },
  { id: 5, name: 'Carla Souza', email: 'carla@email.com', phone: '(11) 99999-0005', city: 'São Paulo', totalPurchases: 12, totalSpent: 15680.00, lastPurchase: '01/12/2024' },
];

export default function Clientes() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.totalPurchases > 0).length;
  const totalSales = customers.reduce((acc, c) => acc + c.totalSpent, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestão de Clientes"
        description={`${totalCustomers} clientes cadastrados`}
      >
        <Button className="gradient-primary text-primary-foreground hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4 mr-2" />
          Novo Cliente
        </Button>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="Total de Clientes"
          value={totalCustomers.toString()}
          icon={Users}
          variant="primary"
        />
        <StatsCard
          title="Clientes Ativos"
          value={activeCustomers.toString()}
          icon={UserCheck}
          variant="success"
        />
        <StatsCard
          title="Vendas para Clientes"
          value={`R$ ${totalSales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={ShoppingCart}
          variant="secondary"
        />
      </div>

      {/* Search */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, CPF, telefone, e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Customers List */}
      {filteredCustomers.length === 0 ? (
        <EmptyState
          icon={Filter}
          title="Nenhum cliente encontrado"
          description="Tente ajustar a busca"
          action={
            <Button variant="outline" onClick={() => setSearchTerm('')}>
              Limpar Busca
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCustomers.map((customer, index) => (
            <div
              key={customer.id}
              className="bg-card rounded-xl border border-border p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                    {customer.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {customer.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{customer.totalPurchases} compras</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{customer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{customer.city}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total gasto</p>
                  <p className="font-bold text-primary">
                    R$ {customer.totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Última compra</p>
                  <p className="text-sm font-medium">{customer.lastPurchase}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
