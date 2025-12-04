import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
  style?: React.CSSProperties;
}

export function ChartCard({ title, subtitle, children, className, action, style }: ChartCardProps) {
  return (
    <div 
      className={cn(
        'bg-card rounded-xl border border-border p-5 transition-all duration-300 hover:shadow-md',
        className
      )}
      style={style}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}
