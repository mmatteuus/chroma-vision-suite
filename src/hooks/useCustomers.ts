import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface CustomerRecord {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  total_purchases?: number | null;
}

export function useCustomers() {
  return useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from<CustomerRecord>("customers")
        .select("id, name, email, phone, city, total_purchases")
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
