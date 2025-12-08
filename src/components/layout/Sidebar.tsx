import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Glasses,
  LayoutDashboard,
  Package,
  ShoppingCart,
  DollarSign,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Package, label: "Estoque", path: "/estoque" },
  { icon: ShoppingCart, label: "Vendas", path: "/vendas" },
  { icon: DollarSign, label: "Financeiro", path: "/financeiro" },
  { icon: Users, label: "Clientes", path: "/clientes" },
  { icon: Settings, label: "Configurações", path: "/configuracoes" },
];

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const location = useLocation();

  const sidebarContent = (
    <div className="flex flex-col h-full min-h-screen">
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center animate-glow">
              <Glasses className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="absolute -inset-1 rounded-xl gradient-primary opacity-30 blur-sm -z-10" />
          </div>
          {!collapsed && (
            <span className="text-xl font-bold text-sidebar-foreground animate-fade-in">
              Policromático
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={onMobileClose}
          aria-label="Fechar menu"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          const linkContent = (
            <NavLink
              to={item.path}
              onClick={onMobileClose}
              aria-label={item.label}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group",
                isActive
                  ? "gradient-primary text-primary-foreground shadow-lg glow-primary"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent",
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Icon
                className={cn("w-5 h-5 transition-transform duration-300", !isActive && "group-hover:scale-110")}
              />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </NavLink>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.path} delayDuration={0}>
                <TooltipTrigger asChild>
                  <div onClick={onMobileClose}>{linkContent}</div>
                </TooltipTrigger>
                <TooltipContent side="right" className="font-medium">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          }

          return <div key={item.path}>{linkContent}</div>;
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="w-full justify-center text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent hidden lg:flex"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 mr-2" />
              <span>Recolher</span>
            </>
          )}
        </Button>
        {!collapsed && (
          <p className="text-xs text-sidebar-foreground/40 text-center mt-2 animate-fade-in">v1.0.0</p>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 gradient-sidebar border-r border-sidebar-border lg:hidden transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {sidebarContent}
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col gradient-sidebar border-r border-sidebar-border transition-all duration-300",
          "lg:sticky lg:top-0 lg:left-0 lg:h-screen lg:min-h-screen",
          "lg:overflow-hidden",
          collapsed ? "w-20" : "w-64",
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
