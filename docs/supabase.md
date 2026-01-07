# Supabase Integration

## Variáveis de ambiente

Defina essas chaves no `.env.local` (local) e no painel da Vercel (Production/Preview):

```env
VITE_SUPABASE_URL=https://tiqoyulupyueblevefea.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_t1DWRba5trJPe-EkWAZ6QA_Q767RdTg
VITE_SUPABASE_SCHEMA=app
```

O backend Nest usa `backend/.env` com as URLs `DATABASE_URL`/`DIRECT_URL` e `SUPABASE_DB_PASSWORD`. Copie de `backend/.env.example` e preencha a senha rotacionada.

## CLI e migrations

1. Gere um token com privilégios de owner (Settings → Access Tokens).
2. Rotacione a senha do Postgres (Settings → Database).
3. No terminal:

```bash
npx supabase login --token <TOKEN_OWNER>
$env:SUPABASE_DB_PASSWORD="SUA_SENHA"
npx supabase link --project-ref tiqoyulupyueblevefea --password $env:SUPABASE_DB_PASSWORD
npx supabase db push
npx supabase migration list
```

Isso aplica o `supabase/migrations/<timestamp>_init_chroma_schema.sql` no banco remoto.

## Seeds

Execute o SQL abaixo no Editor do Supabase (schema `app`) para popular dados iniciais:

```sql
INSERT INTO app.products (sku, name, category, brand, min_stock, price, is_active) VALUES
  ('RB-3025', 'Óculos Ray-Ban Aviador', 'Óculos de Sol', 'Ray-Ban', 5, 890, TRUE),
  ('OK-CL-01', 'Armação Oakley Crosslink', 'Armações', 'Oakley', 3, 650, TRUE);

INSERT INTO app.customers (name, email, phone, city) VALUES
  ('Maria Silva', 'maria@cliente.com', '(11) 99999-0001', 'São Paulo');

INSERT INTO app.sales_orders (customer_id, status, payment_method, total)
VALUES ((SELECT id FROM app.customers WHERE name = 'Maria Silva'), 'pago', 'Cartão Crédito', 1250);

INSERT INTO app.payments (order_id, method, amount)
VALUES ((SELECT id FROM app.sales_orders WHERE customer_id = (SELECT id FROM app.customers WHERE name = 'Maria Silva')), 'Cartão Crédito', 1250);
```

## Deploy na Vercel

1. Configure as env vars no dashboard da Vercel.
2. Garanta que o `vercel.json` presente direciona `/.*` para `/index.html`.
3. Clique em “Redeploy” sempre que atualizar as env vars ou as migrations.

## Testes locais

- `npm install && npm run dev`
- `npm run build` para validar o bundle antes do deploy.

## Operações no front

- `Estoque` agora oferece um formulário para adicionar produtos com SKU, categoria, marca e preço reais.
- `Clientes` permite cadastrar manualmente novos clientes, com nome, e-mail, telefone e cidade.
- `Vendas` cria um novo pedido em segundos: selecione o cliente, status, total, forma de pagamento e observações.
- `Financeiro` registra entradas/saídas via formulário com tipo, status, categoria e valor.

Todos esses formulários usam os hooks de mutation (`useCreateProduct`, `useCreateCustomer`, `useCreateSale`, `useCreateTransaction`) e exibem toasts de sucesso ou erro.

Os hooks `useProducts`, `useCustomers`, `useSalesOrders` e `useFinancialTransactions` usam `react-query`. Os mutations ficam em `src/hooks/useSupabaseMutations.ts` e geram toasts nas alterações.
