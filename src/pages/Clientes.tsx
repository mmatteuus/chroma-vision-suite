import { useState } from "react";
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
  AlertCircle,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatsCard } from "@/components/common/StatsCard";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useMockQuery } from "@/hooks/useMockQuery";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import { FilterBar } from "@/components/common/FilterBar";
import { ListItemCard } from "@/components/common/ListItemCard";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  totalPurchases: number;
  totalSpent: number;
  lastPurchase: string;
}

const customerSeed: Customer[] = [
  { id: 1, name: "Maria Silva", email: "maria@email.com", phone: "(11) 99999-0001", city: "São Paulo", totalPurchases: 5, totalSpent: 4250.0, lastPurchase: "04/12/2024" },
  { id: 2, name: "João Santos", email: "joao@email.com", phone: "(11) 99999-0002", city: "São Paulo", totalPurchases: 3, totalSpent: 2890.0, lastPurchase: "03/12/2024" },
  { id: 3, name: "Ana Costa", email: "ana@email.com", phone: "(21) 99999-0003", city: "Rio de Janeiro", totalPurchases: 8, totalSpent: 7800.0, lastPurchase: "02/12/2024" },
  { id: 4, name: "Pedro Lima", email: "pedro@email.com", phone: "(31) 99999-0004", city: "Belo Horizonte", totalPurchases: 2, totalSpent: 1450.0, lastPurchase: "28/11/2024" },
  { id: 5, name: "Carla Souza", email: "carla@email.com", phone: "(11) 99999-0005", city: "São Paulo", totalPurchases: 12, totalSpent: 15680.0, lastPurchase: "01/12/2024" },
];

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Falha ao carregar clientes</AlertTitle>
      <AlertDescription className="flex items-center justify-between gap-3">
        Não foi possível carregar os registros.
        <Button variant="outline" size="sm" onClick={onRetry}>
          Tentar novamente
        </Button>
      </AlertDescription>
    </Alert>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, idx) => (
        <div key={idx} className="bg-card rounded-xl border border-border p-5 space-y-3 animate-pulse">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="bg-card rounded-xl border border-border p-5 space-y-3 animate-pulse">
      <Skeleton className="h-8 w-8 rounded-full" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}

export default function Clientes() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, isFetching, isError, refetch } = useMockQuery(["customers"], customerSeed);
  const customers = data ?? [];
  const loading = isLoading || isFetching;
  const isMobile = useIsMobile();

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm),
  );

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.totalPurchases > 0).length;
  const totalSales = customers.reduce((acc, c) => acc + c.totalSpent, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Gestão de Clientes" description={`${totalCustomers} clientes cadastrados`}>
        <Button className="gradient-primary text-primary-foreground hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4 mr-2" />
          Novo Cliente
        </Button>
      </PageHeader>

      {/* Stats */}
      {loading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard title="Total de Clientes" value={totalCustomers.toString()} icon={Users} variant="primary" />
          <StatsCard title="Clientes Ativos" value={activeCustomers.toString()} icon={UserCheck} variant="success" />
          <StatsCard
            title="Vendas para Clientes"
            value={`R$ ${totalSales.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
            icon={ShoppingCart}
            variant="secondary"
          />
        </div>
      )}

      {/* Search */}
      <FilterBar
        onClearAll={() => setSearchTerm("")}
        hasActiveFilters={searchTerm.trim().length > 0}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, CPF, telefone, e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            aria-label="Buscar cliente"
          />
        </div>
      </FilterBar>

      {/* Customers List */}
      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <CardSkeleton key={idx} />
          ))}
        </div>
      ) : filteredCustomers.length === 0 ? (
        <EmptyState
          icon={Filter}
          title="Nenhum cliente encontrado"
          description="Tente ajustar a busca"
          action={
            <Button variant="outline" onClick={() => setSearchTerm("")}>
              Limpar Busca
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCustomers.map((customer, index) => {
            const animate = !isMobile && index < 24;
            return (
              <ListItemCard
                key={customer.id}
                title={customer.name}
                subtitle={`${customer.totalPurchases} compras`}
                meta={
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{customer.city}</span>
                  </div>
                }
                actions={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-primary/10 hover:text-primary"
                    aria-label="Ver detalhes do cliente"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                }
                className={cn(
                  "group",
                  animate && "animate-fade-in",
                  "hover:-translate-y-1"
                )}
                style={animate ? { animationDelay: `${index * 50}ms` } : undefined}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                    {customer.name.charAt(0)}
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{customer.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{customer.phone}</span>
                    </div>
                  </div>
                </div>
                <div className="pt-3 border-t border-border flex items-center justify-between text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Total gasto</p>
                    <p className="font-bold text-primary">
                      R$ {customer.totalSpent.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Última compra</p>
                    <p className="text-sm font-medium">{customer.lastPurchase}</p>
                  </div>
                </div>
              </ListItemCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
