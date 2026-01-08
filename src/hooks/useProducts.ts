import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface InventoryLevel {
  quantity: number;
}

interface ProductRow {
  id: number;
  sku: string;
  name: string;
  category: string;
  brand: string;
  min_stock: number;
  price: number;
  is_active: boolean;
  inventory_levels?: InventoryLevel[];
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  category: string;
  brand: string;
  minStock: number;
  price: number;
  stock: number;
  isActive: boolean;
}

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from<ProductRow>("products")
        .select("id, sku, name, category, brand, min_stock, price, is_active, inventory_levels(quantity)")
        .order("name");

      if (error) {
        throw error;
      }

      return (data ?? []).map((item) => ({
        id: item.id,
        sku: item.sku,
        name: item.name,
        category: item.category,
        brand: item.brand,
        minStock: item.min_stock,
        price: Number(item.price),
        stock: item.inventory_levels?.[0]?.quantity ?? 0,
        isActive: item.is_active,
      }));
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}
