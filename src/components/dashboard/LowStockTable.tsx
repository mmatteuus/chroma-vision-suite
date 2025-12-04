import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export interface LowStockItem {
  id: number;
  name: string;
  ref: string;
  stock: number;
  min: number;
}

interface LowStockTableProps {
  items: LowStockItem[];
}

export function LowStockTable({ items }: LowStockTableProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-border bg-card p-4 space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.ref}</p>
              </div>
              <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                <AlertTriangle className="w-3 h-3 mr-1" />
                {item.stock}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Mínimo: {item.min}</span>
              <Button asChild variant="link" className="px-0 text-primary">
                <Link to="/estoque">Detalhes</Link>
              </Button>
            </div>
          </div>
        ))}
        <Button asChild variant="outline" className="w-full">
          <Link to="/estoque">Ver Estoque Completo</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead className="text-center">Estoque</TableHead>
              <TableHead className="text-center">Mínimo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => {
              const animate = !isMobile && index < 12;
              return (
                <TableRow
                  key={item.id}
                  className={cn("hover:bg-muted/50 transition-colors", animate && "animate-fade-in")}
                  style={animate ? { animationDelay: `${index * 50}ms` } : undefined}
                >
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.ref}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      {item.stock}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">{item.min}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Button asChild variant="outline" className="w-full">
        <Link to="/estoque">Ver Estoque Completo</Link>
      </Button>
    </div>
  );
}
