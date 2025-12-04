import { Menu, Search, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

export function Header({ title, onMenuClick }: HeaderProps) {
  return (
    <header className="h-16 bg-card border-b border-border px-4 lg:px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="Abrir menu"
        >
          <Menu className="w-5 h-5" />
        </Button>
        <h1 className="text-lg sm:text-2xl font-bold text-foreground animate-fade-in">
          {title}
        </h1>
      </div>

      {/* Search bar - desktop only */}
      <div className="hidden lg:flex flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar produtos, vendas, clientes..."
            className="pl-10 bg-muted border-transparent focus:border-primary focus:bg-card transition-all duration-300"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative hidden sm:flex hover:bg-muted" aria-label="Notificações">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full animate-pulse-soft" />
        </Button>

        {/* User avatar */}
        <div className="relative group">
          <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-105">
            <User className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="absolute -inset-0.5 rounded-full gradient-primary opacity-0 group-hover:opacity-40 blur transition-opacity duration-300 -z-10" />
        </div>
      </div>
    </header>
  );
}
