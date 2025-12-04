import { useState } from "react";
import { Store, CreditCard, Bell, Palette, Save } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { maskCEP, maskPhone } from "@/lib/masks";
import { useToast } from "@/components/ui/use-toast";

type FieldErrors = Partial<Record<"email" | "phone" | "cep", string>>;

export default function Configuracoes() {
  const [storeName, setStoreName] = useState("Ótica Policromático");
  const [storePhone, setStorePhone] = useState("(11) 3333-4444");
  const [storeEmail, setStoreEmail] = useState("contato@policromatico.com");
  const [storeAddress, setStoreAddress] = useState("Rua das Óticas, 123 - Centro");
  const [storeCep, setStoreCep] = useState("01000-000");
  const [errors, setErrors] = useState<FieldErrors>({});
  const { toast } = useToast();

  const validate = (): boolean => {
    const newErrors: FieldErrors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(storeEmail)) {
      newErrors.email = "E-mail inválido";
    }
    const phoneDigits = storePhone.replace(/\D/g, "");
    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
      newErrors.phone = "Telefone deve ter DDD + 8 ou 9 dígitos";
    }
    const cepDigits = storeCep.replace(/\D/g, "");
    if (cepDigits.length !== 8) {
      newErrors.cep = "CEP deve ter 8 dígitos";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      toast({
        title: "Revise os campos",
        description: "Alguns dados precisam de correção.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Configurações salvas",
      description: "Suas preferências foram atualizadas.",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Configurações" description="Personalize as configurações da sua ótica" />

      <Tabs defaultValue="store" className="space-y-6">
        <TabsList className="bg-card border border-border p-1 h-auto flex-wrap">
          <TabsTrigger
            value="store"
            className="gap-2 data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground"
          >
            <Store className="w-4 h-4" />
            <span className="hidden sm:inline">Informações da Loja</span>
            <span className="sm:hidden">Loja</span>
          </TabsTrigger>
          <TabsTrigger
            value="sales"
            className="gap-2 data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground"
          >
            <CreditCard className="w-4 h-4" />
            <span className="hidden sm:inline">Configurações de Venda</span>
            <span className="sm:hidden">Vendas</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="gap-2 data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground"
          >
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notificações</span>
            <span className="sm:hidden">Avisos</span>
          </TabsTrigger>
          <TabsTrigger
            value="appearance"
            className="gap-2 data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground"
          >
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">Aparência</span>
            <span className="sm:hidden">Tema</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="store" className="space-y-6 animate-fade-in">
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold mb-4">Informações da Loja</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="storeName">Nome da Loja</Label>
                <Input id="storeName" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storePhone">Telefone</Label>
                <Input
                  id="storePhone"
                  value={storePhone}
                  onChange={(e) => setStorePhone(maskPhone(e.target.value))}
                  aria-invalid={!!errors.phone}
                />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeEmail">E-mail</Label>
                <Input
                  id="storeEmail"
                  type="email"
                  value={storeEmail}
                  onChange={(e) => setStoreEmail(e.target.value)}
                  aria-invalid={!!errors.email}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeAddress">Endereço</Label>
                <Input id="storeAddress" value={storeAddress} onChange={(e) => setStoreAddress(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeCep">CEP</Label>
                <Input
                  id="storeCep"
                  value={storeCep}
                  onChange={(e) => setStoreCep(maskCEP(e.target.value))}
                  aria-invalid={!!errors.cep}
                />
                {errors.cep && <p className="text-xs text-destructive">{errors.cep}</p>}
              </div>
            </div>
            <Button
              className="mt-6 gradient-primary text-primary-foreground hover:opacity-90"
              onClick={handleSave}
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-6 animate-fade-in">
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold mb-4">Configurações de Venda</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Exigir CPF na venda</p>
                  <p className="text-sm text-muted-foreground">Obrigar preenchimento do CPF do cliente</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Emitir NFC-e automaticamente</p>
                  <p className="text-sm text-muted-foreground">Gerar nota fiscal após cada venda</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Permitir desconto manual</p>
                  <p className="text-sm text-muted-foreground">Vendedores podem aplicar descontos</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
            <Button className="mt-6 gradient-primary text-primary-foreground hover:opacity-90" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 animate-fade-in">
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold mb-4">Notificações</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Alertas de estoque baixo</p>
                  <p className="text-sm text-muted-foreground">Notificar quando produtos atingirem estoque mínimo</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Resumo diário de vendas</p>
                  <p className="text-sm text-muted-foreground">Receber relatório por e-mail ao final do dia</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Novas vendas</p>
                  <p className="text-sm text-muted-foreground">Notificar a cada nova venda realizada</p>
                </div>
                <Switch />
              </div>
            </div>
            <Button className="mt-6 gradient-primary text-primary-foreground hover:opacity-90" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6 animate-fade-in">
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold mb-4">Aparência</h3>
            <div className="space-y-6">
              <div>
                <p className="font-medium mb-3">Tema de Cores</p>
                <div className="flex gap-3">
                  {["Roxo", "Azul", "Verde", "Rosa"].map((color, index) => (
                    <button
                      key={color}
                      className={cn(
                        "w-12 h-12 rounded-xl transition-all hover:scale-110",
                        index === 0 && "gradient-primary ring-2 ring-primary ring-offset-2 ring-offset-background",
                        index === 1 && "bg-info",
                        index === 2 && "bg-success",
                        index === 3 && "bg-accent",
                      )}
                      title={color}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Modo escuro</p>
                  <p className="text-sm text-muted-foreground">Alternar entre tema claro e escuro</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Animações</p>
                  <p className="text-sm text-muted-foreground">Ativar animações e transições</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
            <Button className="mt-6 gradient-primary text-primary-foreground hover:opacity-90" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
