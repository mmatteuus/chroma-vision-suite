import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface SalesOrder {
  id: number;
  customer_id: number | null;
  status: string;
  payment_method: string | null;
  total: number;
  notes?: string | null;
  created_at: string;
}

export function useSalesOrders() {
  return useQuery({
    queryKey: ["sales_orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from<SalesOrder>("sales_orders")
        .select("id, customer_id, status, payment_method, total, notes, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      return data ?? [];
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}
