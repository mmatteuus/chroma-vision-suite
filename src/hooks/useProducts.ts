import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface ProductItem {
  id: number;
  sku: string;
  name: string;
  category: string;
  brand: string;
  min_stock: number;
  price: number;
  stock?: number;
  image?: string | null;
  is_active: boolean;
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from<ProductItem>("products")
        .select("id, sku, name, category, brand, min_stock, price, is_active")
        .order("name");

      if (error) {
        throw error;
      }

      return data ?? [];
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}
