import { type CSSProperties } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "primary" | "secondary" | "accent" | "success" | "warning" | "info";
  className?: string;
  style?: CSSProperties;
}

const variantStyles = {
  primary: {
    gradient: "gradient-primary",
    glow: "glow-primary",
    border: "border-l-primary",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  secondary: {
    gradient: "gradient-secondary",
    glow: "glow-secondary",
    border: "border-l-secondary",
    iconBg: "bg-secondary/10",
    iconColor: "text-secondary",
  },
  accent: {
    gradient: "gradient-accent",
    glow: "glow-accent",
    border: "border-l-accent",
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
  },
  success: {
    gradient: "gradient-success",
    glow: "",
    border: "border-l-success",
    iconBg: "bg-success/10",
    iconColor: "text-success",
  },
  warning: {
    gradient: "gradient-warning",
    glow: "",
    border: "border-l-warning",
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
  },
  info: {
    gradient: "",
    glow: "",
    border: "border-l-info",
    iconBg: "bg-info/10",
    iconColor: "text-info",
  },
};

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "primary",
  className,
  style,
}: StatsCardProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        "relative bg-card rounded-xl border border-border p-5 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group",
        `border-l-4 ${styles.border}`,
        className,
      )}
      style={style}
    >
      {/* Background decoration */}
      <div
        className={cn(
          "absolute top-0 right-0 w-32 h-32 rounded-full opacity-5 -translate-y-1/2 translate-x-1/2 transition-transform duration-500 group-hover:scale-150",
          styles.gradient,
        )}
      />

      <div className="flex items-start justify-between relative">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl lg:text-3xl font-bold text-foreground">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 mt-2 text-sm font-medium",
                trend.isPositive ? "text-success" : "text-destructive",
              )}
            >
              <span>{trend.isPositive ? "↑" : "↓"}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-muted-foreground font-normal">vs mês anterior</span>
            </div>
          )}
        </div>

        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
            styles.iconBg,
          )}
        >
          <Icon className={cn("w-6 h-6", styles.iconColor)} />
        </div>
      </div>
    </div>
  );
}
