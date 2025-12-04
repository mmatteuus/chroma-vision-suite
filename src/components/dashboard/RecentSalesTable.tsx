import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";

export interface RecentSale {
  id: number;
  date: string;
  customer: string;
  channel: string;
  total: number;
  status: "concluído" | "pendente" | "cancelado";
}

const statusColors: Record<RecentSale["status"], string> = {
  concluído: "bg-success/10 text-success border-success/20",
  pendente: "bg-warning/10 text-warning border-warning/20",
  cancelado: "bg-destructive/10 text-destructive border-destructive/20",
};

interface RecentSalesTableProps {
  sales: RecentSale[];
}

export function RecentSalesTable({ sales }: RecentSalesTableProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="space-y-3">
        {sales.map((sale) => (
          <div key={sale.id} className="rounded-xl border border-border bg-card p-4 space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">{sale.date}</p>
                <p className="font-semibold text-foreground">{sale.customer}</p>
                <p className="text-sm text-muted-foreground">{sale.channel}</p>
              </div>
              <Badge variant="outline" className={statusColors[sale.status]}>
                {sale.status}
              </Badge>
            </div>
            <div className="flex items-center justify-between gap-3">
              <p className="text-lg font-bold">R$ {sale.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
              <Button variant="ghost" size="icon" aria-label="Ver detalhes da venda">
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead className="hidden sm:table-cell">Canal</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale, index) => {
            const animate = !isMobile && index < 12;
            return (
              <TableRow
                key={sale.id}
                className={cn("hover:bg-muted/50 transition-colors", animate && "animate-fade-in")}
                style={animate ? { animationDelay: `${index * 50}ms` } : undefined}
              >
              <TableCell className="font-medium">{sale.date}</TableCell>
              <TableCell>{sale.customer}</TableCell>
              <TableCell className="hidden sm:table-cell">
                <span className="text-muted-foreground">{sale.channel}</span>
              </TableCell>
              <TableCell className="font-semibold">
                R$ {sale.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={statusColors[sale.status]}>
                  {sale.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary" aria-label="Ver detalhes da venda">
                  <Eye className="w-4 h-4" />
                </Button>
              </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
