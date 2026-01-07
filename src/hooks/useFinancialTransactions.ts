import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface FinancialTransaction {
  id: number;
  kind: "entrada" | "saida";
  category: string;
  amount: number;
  related_order_id: number | null;
  status: string;
  description: string | null;
  created_at: string;
}

export function useFinancialTransactions() {
  return useQuery({
    queryKey: ["financial_transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from<FinancialTransaction>("financial_transactions")
        .select("id, kind, category, amount, related_order_id, status, description, created_at")
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
