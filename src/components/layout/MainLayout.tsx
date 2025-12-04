import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/estoque': 'Gestão de Estoque',
  '/vendas': 'Gestão de Vendas',
  '/financeiro': 'Controle Financeiro',
  '/clientes': 'Gestão de Clientes',
  '/configuracoes': 'Configurações',
};

export function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const pageTitle = pageTitles[location.pathname] || 'Policromático';

  return (
    <div className="min-h-screen flex w-full bg-background">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Header
          title={pageTitle}
          onMenuClick={() => setMobileMenuOpen(true)}
        />

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="animate-fade-in-up">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
