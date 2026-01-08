import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Download,
  Search,
  Package,
  AlertTriangle,
  DollarSign,
  Grid3x3,
  List,
  Filter,
  AlertCircle,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatsCard } from "@/components/common/StatsCard";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Product, useProducts } from "@/hooks/useProducts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import { FilterBar } from "@/components/common/FilterBar";
import { useCreateProduct } from "@/hooks/useSupabaseMutations";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type ProductCategory = "Óculos de Sol" | "Armações" | "Lentes" | "Acessórios";

const initialProductFormValues = {
  name: "",
  sku: "",
  category: "",
  brand: "",
  price: "",
  minStock: "",
};

const inventorySeed: Product[] = [
  {
    id: 1,
    name: "Óculos Ray-Ban Aviador",
    sku: "RB-3025",
    category: "Óculos de Sol",
    brand: "Ray-Ban",
    stock: 15,
    minStock: 5,
    price: 890.0,
    isActive: true,
  },
  {
    id: 2,
    name: "Armação Oakley Crosslink",
    sku: "OK-CL-01",
    category: "Armações",
    brand: "Oakley",
    stock: 8,
    minStock: 3,
    price: 650.0,
    isActive: true,
  },
  {
    id: 3,
    name: "Lente Transitions Gen 8",
    sku: "LT-G8-01",
    category: "Lentes",
    brand: "Transitions",
    stock: 3,
    minStock: 10,
    price: 420.0,
    isActive: true,
  },
  {
    id: 4,
    name: "Óculos Chilli Beans Sport",
    sku: "CB-SP-22",
    category: "Óculos de Sol",
    brand: "Chilli Beans",
    stock: 22,
    minStock: 8,
    price: 320.0,
    isActive: true,
  },
  {
    id: 5,
    name: "Estojo Premium Couro",
    sku: "EST-PR-01",
    category: "Acessórios",
    brand: "Genérico",
    stock: 45,
    minStock: 15,
    price: 85.0,
    isActive: true,
  },
  {
    id: 6,
    name: "Lente Varilux X Series",
    sku: "VX-XS-02",
    category: "Lentes",
    brand: "Varilux",
    stock: 2,
    minStock: 5,
    price: 1250.0,
    isActive: true,
  },
];

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Falha ao carregar estoque</AlertTitle>
      <AlertDescription className="flex items-center justify-between gap-3">
        Não foi possível carregar os produtos.
        <Button variant="outline" size="sm" onClick={onRetry}>
          Tentar novamente
        </Button>
      </AlertDescription>
    </Alert>
  );
}

function ProductSkeleton({ view }: { view: "grid" | "list" }) {
  return (
    <div
      className={cn(
        "bg-card rounded-xl border border-border p-4 animate-pulse",
        view === "list" && "flex items-center gap-4",
      )}
    >
      <Skeleton className={cn(view === "grid" ? "w-full aspect-square" : "w-16 h-16 flex-shrink-0", "rounded-lg")} />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}

export default function Estoque() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | "all">("all");
  const [stockFilter, setStockFilter] = useState<"all" | "low" | "normal">("all");

  const { data: productsData, isLoading, isFetching, isError, refetch } = useProducts();
  const products = productsData ?? inventorySeed;
  const loading = isLoading || isFetching;
  const isMobile = useIsMobile();
  const createProduct = useCreateProduct();
  const [formValues, setFormValues] = useState(initialProductFormValues);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  const handleProductInput = (field: keyof typeof formValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddProduct = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (createProduct.isLoading) return;
    const payload = {
      name: formValues.name,
      sku: formValues.sku,
      category: formValues.category,
      brand: formValues.brand,
      price: Number(formValues.price),
      min_stock: Number(formValues.minStock),
    };
    createProduct.mutate(payload);
  };

  useEffect(() => {
    if (createProduct.isSuccess) {
      setFormValues(initialProductFormValues);
      setIsAddProductOpen(false);
    }
  }, [createProduct.isSuccess]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "low" && product.stock <= product.minStock) ||
        (stockFilter === "normal" && product.stock > product.minStock);
      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchTerm, categoryFilter, stockFilter]);

  const totalProducts = products.length;
  const lowStockCount = products.filter((p) => p.stock <= p.minStock).length;
  const totalValue = products.reduce((acc, p) => acc + p.price * p.stock, 0);

  const handleExportInventory = () => {
    if (filteredProducts.length === 0 || typeof window === "undefined") {
      return;
    }

    const headers = ["SKU", "Nome", "Categoria", "Marca", "Estoque atual", "Estoque mínimo", "Preço (R$)"];
    const rows = filteredProducts.map((product) => [
      product.sku,
      product.name,
      product.category,
      product.brand,
      product.stock,
      product.minStock,
      product.price.toFixed(2),
    ]);

    const escapeCell = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;
    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => escapeCell(cell)).join(","))
      .join("\r\n");

    const blob = new Blob([`\uFEFF${csvContent}`], { type: "text/csv;charset=utf-8;" });
    const fileName = `estoque-${new Date().toISOString().slice(0, 10)}.csv`;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Gestão de Estoque" description={`${totalProducts} produtos • ${lowStockCount} com estoque baixo`}>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Exportar estoque"
          onClick={handleExportInventory}
          disabled={loading || filteredProducts.length === 0}
        >
          <Download className="w-4 h-4" />
        </Button>
        <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              className="gradient-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="space-y-6">
            <DialogHeader>
              <DialogTitle>Adicionar produto</DialogTitle>
              <DialogDescription>Preencha os dados abaixo para registrar o item no estoque.</DialogDescription>
            </DialogHeader>
            <form className="grid gap-3 sm:grid-cols-2" onSubmit={handleAddProduct}>
              <div className="space-y-1">
                <Label htmlFor="productName">Nome</Label>
                <Input
                  id="productName"
                  value={formValues.name}
                  onChange={(event) => handleProductInput("name", event.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="productSku">SKU</Label>
                <Input
                  id="productSku"
                  value={formValues.sku}
                  onChange={(event) => handleProductInput("sku", event.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="productCategory">Categoria</Label>
                <Input
                  id="productCategory"
                  value={formValues.category}
                  onChange={(event) => handleProductInput("category", event.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="productBrand">Marca</Label>
                <Input
                  id="productBrand"
                  value={formValues.brand}
                  onChange={(event) => handleProductInput("brand", event.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="productPrice">Preço</Label>
                <Input
                  id="productPrice"
                  type="number"
                  step="0.01"
                  value={formValues.price}
                  onChange={(event) => handleProductInput("price", event.target.value)}
                  inputMode="decimal"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="productMinStock">Estoque mínimo</Label>
                <Input
                  id="productMinStock"
                  type="number"
                  step="1"
                  value={formValues.minStock}
                  onChange={(event) => handleProductInput("minStock", event.target.value)}
                  inputMode="numeric"
                  required
                />
              </div>
              <DialogFooter className="mt-3 gap-2">
                <DialogClose asChild>
                  <Button variant="outline" type="button" disabled={createProduct.isLoading}>
                    Cancelar
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={createProduct.isLoading}>
                  {createProduct.isLoading ? "Adicionando..." : "Adicionar ao estoque"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="bg-card rounded-xl border border-border p-5 space-y-3 animate-pulse">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard title="Total de Produtos" value={totalProducts.toString()} icon={Package} variant="primary" />
          <StatsCard title="Estoque Baixo" value={lowStockCount.toString()} icon={AlertTriangle} variant="warning" />
          <StatsCard
            title="Valor em Estoque"
            value={`R$ ${totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
            icon={DollarSign}
            variant="success"
          />
        </div>
      )}

      {/* Filters */}
      <FilterBar
        onClearAll={() => {
          setSearchTerm("");
          setCategoryFilter("all");
          setStockFilter("all");
        }}
        hasActiveFilters={
          searchTerm.trim().length > 0 || categoryFilter !== "all" || stockFilter !== "all"
        }
      >
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, referência ou código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            aria-label="Buscar produto"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as ProductCategory | "all")}>
            <SelectTrigger className="w-[150px]" aria-label="Filtrar por categoria">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="Óculos de Sol">Óculos de Sol</SelectItem>
              <SelectItem value="Armações">Armações</SelectItem>
              <SelectItem value="Lentes">Lentes</SelectItem>
              <SelectItem value="Acessórios">Acessórios</SelectItem>
            </SelectContent>
          </Select>

          <Select value={stockFilter} onValueChange={(value) => setStockFilter(value as typeof stockFilter)}>
            <SelectTrigger className="w-[140px]" aria-label="Filtrar por estoque">
              <SelectValue placeholder="Estoque" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="low">Baixo</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex border border-border rounded-lg overflow-hidden w-fit">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "gradient-primary text-primary-foreground" : ""}
              aria-label="Exibir em grade"
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "gradient-primary text-primary-foreground" : ""}
              aria-label="Exibir em lista"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </FilterBar>

      {/* Products */}
      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : loading ? (
        <div
          className={cn(
            "grid gap-4",
            viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1",
          )}
        >
          {Array.from({ length: 6 }).map((_, idx) => (
            <ProductSkeleton key={idx} view={viewMode} />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          icon={Filter}
          title="Nenhum produto encontrado"
          description="Tente ajustar os filtros de busca"
          action={
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("all");
                setStockFilter("all");
              }}
            >
              Limpar Filtros
            </Button>
          }
        />
      ) : (
        <div
          className={cn(
            "grid gap-4",
            viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1",
          )}
        >
          {filteredProducts.map((product, index) => {
            const animate = !isMobile && index < 24;
            return (
              <div
                key={product.id}
                className={cn(
                  "bg-card rounded-xl border border-border p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group",
                  viewMode === "list" && "flex items-center gap-4",
                  animate && "animate-fade-in",
                )}
                style={animate ? { animationDelay: `${index * 50}ms` } : undefined}
              >
              {/* Product Image Placeholder */}
              <div
                className={cn(
                  "bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center overflow-hidden",
                  viewMode === "grid" ? "aspect-square mb-3" : "w-16 h-16 flex-shrink-0",
                )}
              >
                <Package className="w-8 h-8 text-muted-foreground/50" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">{product.sku}</p>
                  </div>
                  {product.stock <= product.minStock && (
                    <Badge
                      variant="outline"
                      className="bg-destructive/10 text-destructive border-destructive/20 flex-shrink-0"
                    >
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Baixo
                    </Badge>
                  )}
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <div>
                    <span className="text-sm text-muted-foreground">Estoque: </span>
                    <span
                      className={cn(
                        "font-medium",
                        product.stock <= product.minStock ? "text-destructive" : "text-foreground",
                      )}
                    >
                      {product.stock}
                    </span>
                  </div>
                  <span className="font-bold text-primary">
                    R$ {product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
