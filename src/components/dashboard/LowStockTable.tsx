import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
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

const lowStockItems = [
  { id: 1, name: 'Óculos Ray-Ban Aviador', ref: 'RB-3025', stock: 2, min: 5 },
  { id: 2, name: 'Lente Transitions Gen 8', ref: 'LT-G8-01', stock: 3, min: 10 },
  { id: 3, name: 'Armação Oakley Sport', ref: 'OK-SP-22', stock: 1, min: 3 },
  { id: 4, name: 'Óculos de Sol Polarizado', ref: 'POL-UV-50', stock: 4, min: 8 },
];

export function LowStockTable() {
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
            {lowStockItems.map((item, index) => (
              <TableRow 
                key={item.id}
                className="animate-fade-in hover:bg-muted/50 transition-colors"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.ref}</p>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge 
                    variant="outline" 
                    className="bg-destructive/10 text-destructive border-destructive/20"
                  >
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {item.stock}
                  </Badge>
                </TableCell>
                <TableCell className="text-center text-muted-foreground">
                  {item.min}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <Button asChild variant="outline" className="w-full">
        <Link to="/estoque">Ver Estoque Completo</Link>
      </Button>
    </div>
  );
}
