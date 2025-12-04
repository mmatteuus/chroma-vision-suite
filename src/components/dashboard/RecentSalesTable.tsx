import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const recentSales = [
  { id: 1, date: '04/12/2024', customer: 'Maria Silva', channel: 'Loja Física', total: 1250.00, status: 'concluído' },
  { id: 2, date: '04/12/2024', customer: 'João Santos', channel: 'WhatsApp', total: 890.00, status: 'pendente' },
  { id: 3, date: '03/12/2024', customer: 'Ana Costa', channel: 'Loja Física', total: 2100.00, status: 'concluído' },
  { id: 4, date: '03/12/2024', customer: 'Pedro Lima', channel: 'Instagram', total: 450.00, status: 'cancelado' },
  { id: 5, date: '02/12/2024', customer: 'Carla Souza', channel: 'Loja Física', total: 1780.00, status: 'concluído' },
];

const statusColors = {
  concluído: 'bg-success/10 text-success border-success/20',
  pendente: 'bg-warning/10 text-warning border-warning/20',
  cancelado: 'bg-destructive/10 text-destructive border-destructive/20',
};

export function RecentSalesTable() {
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
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentSales.map((sale, index) => (
            <TableRow 
              key={sale.id} 
              className="animate-fade-in hover:bg-muted/50 transition-colors"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <TableCell className="font-medium">{sale.date}</TableCell>
              <TableCell>{sale.customer}</TableCell>
              <TableCell className="hidden sm:table-cell">
                <span className="text-muted-foreground">{sale.channel}</span>
              </TableCell>
              <TableCell className="font-semibold">
                R$ {sale.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={statusColors[sale.status as keyof typeof statusColors]}
                >
                  {sale.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
                  <Eye className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
