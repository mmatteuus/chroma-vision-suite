import { useState } from "react";
import {
  Plus,
  Search,
  TrendingUp,
  TrendingDown,
  Wallet,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  AlertCircle,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatsCard } from "@/components/common/StatsCard";
import { ChartCard } from "@/components/common/ChartCard";
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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import { useMockQuery } from "@/hooks/useMockQuery";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import { FilterBar } from "@/components/common/FilterBar";
import { ListItemCard } from "@/components/common/ListItemCard";

type TransactionType = "entrada" | "saida";
type TransactionStatus = "concluído" | "pendente";

interface Transaction {
  id: number;
  date: string;
  description: string;
  category: string;
  type: TransactionType;
  value: number;
  status: TransactionStatus;
}

interface FinanceData {
  transactions: Transaction[];
  chartData: { name: string; entradas: number; saidas: number }[];
}

const financeSeed: FinanceData = {
  transactions: [
    { id: 1, date: "04/12/2024", description: "Venda - Maria Silva", category: "Vendas", type: "entrada", value: 1250.0, status: "concluído" },
    { id: 2, date: "04/12/2024", description: "Fornecedor - Luxottica", category: "Compras", type: "saida", value: 3500.0, status: "concluído" },
    { id: 3, date: "03/12/2024", description: "Venda - Ana Costa", category: "Vendas", type: "entrada", value: 2100.0, status: "concluído" },
    { id: 4, date: "03/12/2024", description: "Aluguel Dezembro", category: "Despesas Fixas", type: "saida", value: 2800.0, status: "pendente" },
    { id: 5, date: "02/12/2024", description: "Venda - Carla Souza", category: "Vendas", type: "entrada", value: 1780.0, status: "concluído" },
  ],
  chartData: [
    { name: "Jul", entradas: 18000, saidas: 12000 },
    { name: "Ago", entradas: 22000, saidas: 14000 },
    { name: "Set", entradas: 19500, saidas: 11000 },
    { name: "Out", entradas: 25000, saidas: 15000 },
    { name: "Nov", entradas: 28000, saidas: 16000 },
    { name: "Dez", entradas: 24000, saidas: 13000 },
  ],
};

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Falha ao carregar financeiro</AlertTitle>
      <AlertDescription className="flex items-center justify-between gap-3">
        Não foi possível carregar as movimentações.
        <Button variant="outline" size="sm" onClick={onRetry}>
          Tentar novamente
        </Button>
      </AlertDescription>
    </Alert>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={idx} className="bg-card rounded-xl border border-border p-5 space-y-3 animate-pulse">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  );
}

function ChartSkeleton() {
  return <Skeleton className="h-[280px] w-full" />;
}

export default function Financeiro() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<TransactionType | "all">("all");

  const { data, isLoading, isFetching, isError, refetch } = useMockQuery(["finance"], financeSeed);
  const loading = isLoading || isFetching;
  const transactions = data?.transactions ?? [];
  const chartData = data?.chartData ?? [];
  const isMobile = useIsMobile();

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || t.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalEntradas = transactions
    .filter((t) => t.type === "entrada" && t.status === "concluído")
    .reduce((acc, t) => acc + t.value, 0);
  const totalSaidas = transactions
    .filter((t) => t.type === "saida" && t.status === "concluído")
    .reduce((acc, t) => acc + t.value, 0);
  const saldo = totalEntradas - totalSaidas;
  const pendentes = transactions.filter((t) => t.status === "pendente").reduce((acc, t) => acc + t.value, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Controle Financeiro" description="Gerencie entradas, saídas e fluxo de caixa">
        <Button className="gradient-primary text-primary-foreground hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4 mr-2" />
          Novo Lançamento
        </Button>
      </PageHeader>

      {/* Stats */}
      {loading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Entradas"
            value={`R$ ${totalEntradas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
            icon={TrendingUp}
            variant="success"
          />
          <StatsCard
            title="Saídas"
            value={`R$ ${totalSaidas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
            icon={TrendingDown}
            variant="accent"
          />
          <StatsCard
            title="Saldo"
            value={`R$ ${saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
            icon={Wallet}
            variant="primary"
          />
          <StatsCard
            title="A Pagar/Receber"
            value={`R$ ${pendentes.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
            icon={Clock}
            variant="warning"
          />
        </div>
      )}

      {/* Chart */}
      <ChartCard title="Fluxo de Caixa" subtitle="Últimos 6 meses">
        {loading && <ChartSkeleton />}
        {isError && <ErrorState onRetry={() => refetch()} />}
        {!loading && !isError && (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(v) => `R$${v / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                formatter={(value: number) => [`R$ ${value.toLocaleString("pt-BR")}`, ""]}
              />
              <Bar dataKey="entradas" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} name="Entradas" />
              <Bar dataKey="saidas" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} name="Saídas" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      {/* Filters */}
      <FilterBar
        onClearAll={() => {
          setSearchTerm("");
          setTypeFilter("all");
        }}
        hasActiveFilters={typeFilter !== "all" || searchTerm.trim().length > 0}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar lançamentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            aria-label="Buscar lançamentos"
          />
        </div>

        <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as TransactionType | "all")}>
          <SelectTrigger className="w-[150px]" aria-label="Filtrar por tipo de lançamento">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="entrada">Entradas</SelectItem>
            <SelectItem value="saida">Saídas</SelectItem>
          </SelectContent>
        </Select>
      </FilterBar>

      {/* Transactions List */}
      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : loading ? (
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="bg-card rounded-xl border border-border p-4 animate-pulse space-y-2">
              <Skeleton className="h-4 w-60" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      ) : filteredTransactions.length === 0 ? (
        <EmptyState
          icon={Filter}
          title="Nenhum lançamento encontrado"
          description="Tente ajustar os filtros de busca"
        />
      ) : (
        <div className="grid gap-4">
          {filteredTransactions.map((transaction, index) => {
            const animate = !isMobile && index < 20;
            return (
              <ListItemCard
                key={transaction.id}
                title={transaction.description}
                subtitle={`${transaction.date} • ${transaction.category}`}
                meta={
                  <Badge
                    variant="outline"
                    className={
                      transaction.status === "concluído"
                        ? "bg-success/10 text-success border-success/20"
                        : "bg-warning/10 text-warning border-warning/20"
                    }
                  >
                    {transaction.status}
                  </Badge>
                }
                actions={
                  <span
                    className={cn(
                      "font-bold text-lg",
                      transaction.type === "entrada" ? "text-success" : "text-accent",
                    )}
                  >
                    {transaction.type === "entrada" ? "+" : "-"} R${" "}
                    {transaction.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                }
                className={cn(
                  "group",
                  animate && "animate-fade-in",
                  "hover:-translate-y-1",
                  "flex flex-col gap-3"
                )}
                style={animate ? { animationDelay: `${index * 50}ms` } : undefined}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      transaction.type === "entrada" ? "bg-success/10" : "bg-accent/10",
                    )}
                  >
                    {transaction.type === "entrada" ? (
                      <ArrowUpRight className="w-6 h-6 text-success" />
                    ) : (
                      <ArrowDownRight className="w-6 h-6 text-accent" />
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {transaction.type === "entrada" ? "Entrada" : "Saída"}
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
