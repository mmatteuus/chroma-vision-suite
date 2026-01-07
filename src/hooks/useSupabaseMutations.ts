import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/toast";

export type NewCustomer = {
  name: string;
  email: string;
  phone?: string;
  city?: string;
};

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: NewCustomer) => {
      const { data, error } = await supabase
        .from("customers")
        .insert(payload)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast({
        title: "Cliente cadastrado",
        description: "Seu cliente está pronto para novas vendas.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Falha ao cadastrar",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export type NewSale = {
  customer_id: number | null;
  status: string;
  payment_method: string;
  total: number;
  notes?: string;
};

export function useCreateSale() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: NewSale) => {
      const { data, error } = await supabase
        .from("sales_orders")
        .insert(payload)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales_orders"] });
      toast({
        title: "Venda iniciada",
        description: "Você pode adicionar itens e pagamentos em seguida.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar venda",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export type NewTransaction = {
  kind: "entrada" | "saida";
  category: string;
  amount: number;
  related_order_id?: number | null;
  status?: string;
  description?: string;
};

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: NewTransaction) => {
      const { data, error } = await supabase
        .from("financial_transactions")
        .insert(payload)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial_transactions"] });
      toast({
        title: "Movimentação registrada",
        description: "Fluxo financeiro atualizado.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao registrar",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export type NewProduct = {
  sku: string;
  name: string;
  category: string;
  brand: string;
  min_stock: number;
  price: number;
};

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: NewProduct) => {
      const { data, error } = await supabase
        .from("products")
        .insert(payload)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({
        title: "Produto adicionado",
        description: "Novo item disponível no estoque.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Falha ao adicionar produto",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
