import { useState } from "react";
import { Plus, Search, ShoppingCart, DollarSign, TrendingUp, Eye, Filter, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatsCard } from "@/components/common/StatsCard";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useSalesOrders } from "@/hooks/useSalesOrders";
import { useCreateSale } from "@/hooks/useSupabaseMutations";
import { useCustomers } from "@/hooks/useCustomers";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import { FilterBar } from "@/components/common/FilterBar";
import { ListItemCard } from "@/components/common/ListItemCard";

type SaleStatus = "pago" | "pendente" | "cancelado" | "rascunho";

interface Sale {
  id: number;
  date: string;
  customer: string;
  items: number;
  total: number;
  status: SaleStatus;
  channel: string;
}

const salesSeed: Sale[] = [
  { id: 1, date: "04/12/2024", customer: "Maria Silva", items: 2, total: 1250.0, status: "pago", channel: "Loja Física" },
  { id: 2, date: "04/12/2024", customer: "João Santos", items: 1, total: 890.0, status: "pendente", channel: "WhatsApp" },
  { id: 3, date: "03/12/2024", customer: "Ana Costa", items: 3, total: 2100.0, status: "pago", channel: "Loja Física" },
  { id: 4, date: "03/12/2024", customer: "Pedro Lima", items: 1, total: 450.0, status: "cancelado", channel: "Instagram" },
  { id: 5, date: "02/12/2024", customer: "Carla Souza", items: 2, total: 1780.0, status: "pago", channel: "Loja Física" },
  { id: 6, date: "02/12/2024", customer: "Roberto Alves", items: 1, total: 650.0, status: "pago", channel: "WhatsApp" },
];

const statusStyles: Record<SaleStatus, string> = {
  pago: "bg-success/10 text-success border-success/20",
  pendente: "bg-warning/10 text-warning border-warning/20",
  cancelado: "bg-destructive/10 text-destructive border-destructive/20",
  rascunho: "bg-info/10 text-info border-info/20",
};

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Falha ao carregar vendas</AlertTitle>
      <AlertDescription className="flex items-center justify-between gap-3">
        Não foi possível carregar os dados.
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

function ListSkeleton() {
  return (
    <div className="grid gap-4">
      {Array.from({ length: 3 }).map((_, idx) => (
        <div key={idx} className="bg-card rounded-xl border border-border p-4 space-y-2 animate-pulse">
          <Skeleton className="h-4 w-52" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  );
}

export default function Vendas() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<SaleStatus | "all">("all");
  const [saleForm, setSaleForm] = useState({
    customerId: "",
    total: "",
    paymentMethod: "",
    status: "pago" as SaleStatus,
    notes: "",
  });

  const { data, isLoading, isFetching, isError, refetch } = useSalesOrders();
  const sales = data ?? salesSeed;
  const loading = isLoading || isFetching;
  const isMobile = useIsMobile();

  const filteredSales = sales.filter((sale) => {
    const matchesSearch = sale.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || sale.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalSales = sales.filter((s) => s.status === "concluído").length;
  const totalRevenue = sales.filter((s) => s.status === "concluído").reduce((acc, s) => acc + s.total, 0);
  const avgTicket = totalSales > 0 ? totalRevenue / totalSales : 0;

  return (
    <div className="space-y-6">
      <PageHeader title="Gestão de Vendas" description={`${sales.length} vendas registradas`}>
        <Button className="gradient-primary text-primary-foreground hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4 mr-2" />
          Nova Venda
        </Button>
      </PageHeader>

      {/* Stats */}
      {loading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard title="Vendas Concluídas" value={totalSales.toString()} icon={ShoppingCart} variant="primary" />
          <StatsCard
            title="Receita Total"
            value={`R$ ${totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
            icon={DollarSign}
            variant="success"
          />
          <StatsCard
            title="Ticket Médio"
            value={`R$ ${avgTicket.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
            icon={TrendingUp}
            variant="secondary"
          />
        </div>
      )}

      {/* Filters */}
      <FilterBar
        onClearAll={() => {
          setSearchTerm("");
          setStatusFilter("all");
        }}
        hasActiveFilters={statusFilter !== "all" || searchTerm.trim().length > 0}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            aria-label="Buscar por cliente"
          />
        </div>

        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as SaleStatus | "all")}>
          <SelectTrigger className="w-[150px]" aria-label="Filtrar por status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="concluído">Concluído</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="cancelado">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </FilterBar>

      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
        <p className="text-sm font-medium text-muted-foreground">Registrar nova venda</p>
        <form
          className="grid gap-3 sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            if (createSale.isLoading) return;
            createSale.mutate({
              customer_id: saleForm.customerId ? Number(saleForm.customerId) : null,
              status: saleForm.status,
              payment_method: saleForm.paymentMethod,
              total: Number(saleForm.total),
              notes: saleForm.notes || null,
            });
          }}
        >
          <div className="space-y-1">
            <Label htmlFor="saleCustomer">Cliente</Label>
            <Select
              value={saleForm.customerId}
              onValueChange={(value) => setSaleForm((prev) => ({ ...prev, customerId: value }))}
            >
              <SelectTrigger id="saleCustomer" className="w-full">
                <SelectValue placeholder="Selecione o cliente" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id.toString()}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="saleStatus">Status</Label>
            <Select
              value={saleForm.status}
              onValueChange={(value) => setSaleForm((prev) => ({ ...prev, status: value as SaleStatus }))}
            >
              <SelectTrigger id="saleStatus" className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {["rascunho", "pendente", "pago", "cancelado"].map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="saleTotal">Total</Label>
            <Input
              id="saleTotal"
              type="number"
              step="0.01"
              value={saleForm.total}
              onChange={(event) => setSaleForm((prev) => ({ ...prev, total: event.target.value }))}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="saleMethod">Forma de pagamento</Label>
            <Input
              id="saleMethod"
              value={saleForm.paymentMethod}
              onChange={(event) => setSaleForm((prev) => ({ ...prev, paymentMethod: event.target.value }))}
              required
            />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <Label htmlFor="saleNotes">Observações</Label>
            <Input
              id="saleNotes"
              value={saleForm.notes}
              onChange={(event) => setSaleForm((prev) => ({ ...prev, notes: event.target.value }))}
            />
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <Button type="submit" disabled={createSale.isLoading}>
              {createSale.isLoading ? "Registrando..." : "Criar venda"}
            </Button>
          </div>
        </form>
      </div>

      {/* Sales List */}
      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : loading ? (
        <ListSkeleton />
      ) : filteredSales.length === 0 ? (
        <EmptyState
          icon={Filter}
          title="Nenhuma venda encontrada"
          description="Tente ajustar os filtros de busca"
          action={
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
              }}
            >
              Limpar Filtros
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4">
          {filteredSales.map((sale, index) => {
            const animate = !isMobile && index < 20;
            return (
              <ListItemCard
                key={sale.id}
                title={sale.customer}
                subtitle={`${sale.date} • ${sale.channel} • ${sale.items} ${sale.items === 1 ? "item" : "itens"}`}
                meta={
                  <Badge variant="outline" className={statusStyles[sale.status]}>
                    {sale.status}
                  </Badge>
                }
                actions={
                  <>
                    <span className="font-bold text-lg text-foreground">
                      R$ {sale.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-primary/10 hover:text-primary"
                      aria-label="Ver detalhes da venda"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </>
                }
                className={cn(
                  "group",
                  animate && "animate-fade-in",
                  "hover:-translate-y-1"
                )}
                style={animate ? { animationDelay: `${index * 50}ms` } : undefined}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
