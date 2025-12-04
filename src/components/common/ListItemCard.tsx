import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ListItemCardProps {
  title: string;
  subtitle?: string;
  meta?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function ListItemCard({ title, subtitle, meta, actions, children, className, style }: ListItemCardProps) {
  return (
    <div
      className={cn(
        "bg-card rounded-xl border border-border p-4 transition-all duration-300 hover:shadow-lg hover:border-primary/30",
        className,
      )}
      style={style}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{subtitle}</p>
          <h3 className="font-semibold text-foreground">{title}</h3>
          {meta}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}
