import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  children: ReactNode;
  className?: string;
  onClearAll?: () => void;
  hasActiveFilters?: boolean;
}

export function FilterBar({ children, className, onClearAll, hasActiveFilters }: FilterBarProps) {
  return (
    <div className={cn("bg-card rounded-xl border border-border p-4", className)}>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex flex-col sm:flex-row gap-4">{children}</div>
        {onClearAll && (
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              disabled={!hasActiveFilters}
              className="gap-2"
            >
              <X className="w-4 h-4" />
              Limpar filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
