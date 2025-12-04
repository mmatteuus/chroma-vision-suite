import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Users,
  Package,
  ArrowUpRight,
} from 'lucide-react';
import { StatsCard } from '@/components/common/StatsCard';
import { ChartCard } from '@/components/common/ChartCard';
import { RecentSalesTable } from '@/components/dashboard/RecentSalesTable';
import { LowStockTable } from '@/components/dashboard/LowStockTable';
import { SalesChart } from '@/components/dashboard/SalesChart';
import { PaymentChart } from '@/components/dashboard/PaymentChart';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Vendas Hoje"
          value="R$ 4.850,00"
          icon={DollarSign}
          trend={{ value: 12.5, isPositive: true }}
          variant="primary"
          className="animate-fade-in"
        />
        <StatsCard
          title="Lucro do Mês"
          value="R$ 28.420,00"
          icon={TrendingUp}
          trend={{ value: 8.2, isPositive: true }}
          variant="success"
          className="animate-fade-in"
          style={{ animationDelay: '100ms' } as React.CSSProperties}
        />
        <StatsCard
          title="Ticket Médio"
          value="R$ 385,00"
          icon={ShoppingCart}
          trend={{ value: 3.1, isPositive: false }}
          variant="secondary"
          className="animate-fade-in"
          style={{ animationDelay: '200ms' } as React.CSSProperties}
        />
        <StatsCard
          title="Novos Clientes"
          value="24"
          subtitle="este mês"
          icon={Users}
          variant="accent"
          className="animate-fade-in"
          style={{ animationDelay: '300ms' } as React.CSSProperties}
        />
      </div>

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
          <SalesChart />
        </ChartCard>

        <ChartCard
          title="Meios de Pagamento"
          subtitle="Distribuição %"
          className="animate-fade-in-up"
          style={{ animationDelay: '100ms' } as React.CSSProperties}
        >
          <PaymentChart />
        </ChartCard>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard
          title="Vendas Recentes"
          subtitle="Últimas transações"
          className="lg:col-span-2 animate-fade-in-up"
          style={{ animationDelay: '200ms' } as React.CSSProperties}
          action={
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
              Ver Todas
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Button>
          }
        >
          <RecentSalesTable />
        </ChartCard>

        <ChartCard
          title="Estoque Baixo"
          subtitle="Produtos que precisam reposição"
          className="animate-fade-in-up"
          style={{ animationDelay: '300ms' } as React.CSSProperties}
        >
          <LowStockTable />
        </ChartCard>
      </div>
    </div>
  );
}
