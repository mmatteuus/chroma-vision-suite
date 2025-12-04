import React from "react";
import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Users,
  Package,
  ArrowUpRight,
  AlertCircle,
} from "lucide-react";
import { StatsCard } from "@/components/common/StatsCard";
import { ChartCard } from "@/components/common/ChartCard";
import { RecentSalesTable } from "@/components/dashboard/RecentSalesTable";
import { LowStockTable } from "@/components/dashboard/LowStockTable";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { PaymentChart } from "@/components/dashboard/PaymentChart";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useMockQuery } from "@/hooks/useMockQuery";

const dashboardMock = {
  stats: [
    {
      title: "Vendas Hoje",
      value: "R$ 4.850,00",
      icon: DollarSign,
      trend: { value: 12.5, isPositive: true },
      variant: "primary",
    },
    {
      title: "Lucro do Mês",
      value: "R$ 28.420,00",
      icon: TrendingUp,
      trend: { value: 8.2, isPositive: true },
      variant: "success",
    },
    {
      title: "Ticket Médio",
      value: "R$ 385,00",
      icon: ShoppingCart,
      trend: { value: 3.1, isPositive: false },
      variant: "secondary",
    },
    {
      title: "Novos Clientes",
      value: "24",
      subtitle: "este mês",
      icon: Users,
      variant: "accent",
    },
  ],
  salesChart: [
    { name: "Seg", vendas: 2400 },
    { name: "Ter", vendas: 1398 },
    { name: "Qua", vendas: 3800 },
    { name: "Qui", vendas: 3908 },
    { name: "Sex", vendas: 4800 },
    { name: "Sáb", vendas: 3800 },
    { name: "Dom", vendas: 1200 },
  ],
  paymentChart: [
    { name: "Cartão Crédito", value: 45, color: "hsl(var(--chart-1))" },
    { name: "Cartão Débito", value: 25, color: "hsl(var(--chart-2))" },
    { name: "PIX", value: 20, color: "hsl(var(--chart-3))" },
    { name: "Dinheiro", value: 10, color: "hsl(var(--chart-4))" },
  ],
  recentSales: [
    {
      id: 1,
      date: "04/12/2024",
      customer: "Maria Silva",
      channel: "Loja Física",
      total: 1250.0,
      status: "concluído",
    },
    {
      id: 2,
      date: "04/12/2024",
      customer: "João Santos",
      channel: "WhatsApp",
      total: 890.0,
      status: "pendente",
    },
    {
      id: 3,
      date: "03/12/2024",
      customer: "Ana Costa",
      channel: "Loja Física",
      total: 2100.0,
      status: "concluído",
    },
    {
      id: 4,
      date: "03/12/2024",
      customer: "Pedro Lima",
      channel: "Instagram",
      total: 450.0,
      status: "cancelado",
    },
    {
      id: 5,
      date: "02/12/2024",
      customer: "Carla Souza",
      channel: "Loja Física",
      total: 1780.0,
      status: "concluído",
    },
  ],
  lowStock: [
    { id: 1, name: 'Óculos Ray-Ban Aviador', ref: 'RB-3025', stock: 2, min: 5 },
    { id: 2, name: 'Lente Transitions Gen 8', ref: 'LT-G8-01', stock: 3, min: 10 },
    { id: 3, name: 'Armação Oakley Sport', ref: 'OK-SP-22', stock: 1, min: 3 },
    { id: 4, name: 'Óculos de Sol Polarizado', ref: 'POL-UV-50', stock: 4, min: 8 },
  ],
} as const;

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Falha ao carregar dados</AlertTitle>
      <AlertDescription className="flex items-center justify-between gap-3">
        Não foi possível carregar os dados do painel.
        <Button variant="outline" size="sm" onClick={onRetry}>
          Tentar novamente
        </Button>
      </AlertDescription>
    </Alert>
  );
}

function ChartSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-36" />
      <Skeleton className="h-48 w-full" />
    </div>
  );
}

export default function Dashboard() {
  const { data, isLoading, isError, refetch, isFetching } = useMockQuery(["dashboard"], dashboardMock);
  const loading = isLoading || isFetching;
  const salesData = data?.salesChart ?? [];
  const paymentData = data?.paymentChart ?? [];

  const totalReceita = salesData.reduce((acc, item) => acc + item.vendas, 0);
  const pico = salesData.reduce(
    (acc, item) => (item.vendas > acc.vendas ? item : acc),
    salesData[0] ?? { name: "", vendas: 0 },
  );
  const media = salesData.length ? totalReceita / salesData.length : 0;

  const totalPagamentos = paymentData.reduce((acc, item) => acc + item.value, 0);
  const destaquePagamento = paymentData.reduce(
    (acc, item) => (item.value > acc.value ? item : acc),
    paymentData[0] ?? { name: "", value: 0, color: "" },
  );

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-card rounded-xl border border-border p-5 animate-pulse space-y-3"
            >
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data?.stats.map((stat, index) => (
            <StatsCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              subtitle={stat.subtitle}
              icon={stat.icon}
              trend={stat.trend}
              variant={stat.variant}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard
          title="Receita Diária"
          subtitle="Últimos 7 dias"
          className="lg:col-span-2 animate-fade-in-up"
          action={
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
              Ver Detalhes
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Button>
          }
        >
          {loading && <ChartSkeleton />}
          {isError && <ErrorState onRetry={() => refetch()} />}
          {!loading && !isError && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-sm">
                <div className="rounded-lg bg-muted/40 px-3 py-2">
                  <p className="text-muted-foreground">Receita total (7d)</p>
                  <p className="font-semibold">
                    R$ {totalReceita.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="rounded-lg bg-muted/40 px-3 py-2">
                  <p className="text-muted-foreground">Pico</p>
                  <p className="font-semibold">
                    {pico.name ? `${pico.name} • R$ ${pico.vendas.toLocaleString("pt-BR")}` : "—"}
                  </p>
                </div>
                <div className="rounded-lg bg-muted/40 px-3 py-2">
                  <p className="text-muted-foreground">Média diária</p>
                  <p className="font-semibold">R$ {media.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
              <SalesChart data={salesData} />
            </>
          )}
        </ChartCard>

        <ChartCard
          title="Meios de Pagamento"
          subtitle="Distribuição %"
          className="animate-fade-in-up"
          style={{ animationDelay: "100ms" } as React.CSSProperties}
        >
          {loading && <ChartSkeleton />}
          {isError && <ErrorState onRetry={() => refetch()} />}
          {!loading && !isError && (
            <>
              <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                <div className="rounded-lg bg-muted/40 px-3 py-2">
                  <p className="text-muted-foreground">Total (amostra)</p>
                  <p className="font-semibold">
                    {totalPagamentos.toLocaleString("pt-BR")} transações
                  </p>
                </div>
                <div className="rounded-lg bg-muted/40 px-3 py-2">
                  <p className="text-muted-foreground">Mais usado</p>
                  <p className="font-semibold">
                    {destaquePagamento.name
                      ? `${destaquePagamento.name} • ${(
                          (destaquePagamento.value / (totalPagamentos || 1)) *
                          100
                        ).toFixed(0)}%`
                      : "—"}
                  </p>
                </div>
              </div>
              <PaymentChart data={paymentData} />
            </>
          )}
        </ChartCard>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard
          title="Vendas Recentes"
          subtitle="Últimas transações"
          className="lg:col-span-2 animate-fade-in-up"
          style={{ animationDelay: "200ms" } as React.CSSProperties}
          action={
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
              Ver Todas
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Button>
          }
        >
          {loading && <ChartSkeleton />}
          {isError && <ErrorState onRetry={() => refetch()} />}
          {!loading && !isError && <RecentSalesTable sales={data?.recentSales ?? []} />}
        </ChartCard>

        <ChartCard
          title="Estoque Baixo"
          subtitle="Produtos que precisam reposição"
          className="animate-fade-in-up"
          style={{ animationDelay: "300ms" } as React.CSSProperties}
        >
          {loading && <ChartSkeleton />}
          {isError && <ErrorState onRetry={() => refetch()} />}
          {!loading && !isError && <LowStockTable items={data?.lowStock ?? []} />}
        </ChartCard>
      </div>
    </div>
  );
}
