-- Chroma Vision Suite - schema inicial
-- Schema-alvo: app

-- 1) Criar schema dedicado
CREATE SCHEMA IF NOT EXISTS app;

-- Opcional: garantir search_path nesta migration apenas
SET search_path = app, public;

-- 2) Tabelas principais
CREATE TABLE IF NOT EXISTS customers (
  id            BIGSERIAL PRIMARY KEY,
  name          TEXT        NOT NULL,
  email         TEXT UNIQUE,
  phone         TEXT,
  city          TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id            BIGSERIAL PRIMARY KEY,
  sku           TEXT        NOT NULL UNIQUE,
  name          TEXT        NOT NULL,
  category      TEXT        NOT NULL,
  brand         TEXT        NOT NULL,
  min_stock     INTEGER     NOT NULL DEFAULT 0 CHECK (min_stock >= 0),
  price         NUMERIC(12,2) NOT NULL CHECK (price >= 0),
  is_active     BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS inventory_levels (
  product_id    BIGINT NOT NULL PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
  quantity      INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sales_orders (
  id              BIGSERIAL PRIMARY KEY,
  customer_id     BIGINT REFERENCES customers(id),
  status          TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','pending','paid','cancelled')),
  payment_method  TEXT,
  total           NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (total >= 0),
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sale_items (
  order_id     BIGINT NOT NULL REFERENCES sales_orders(id) ON DELETE CASCADE,
  product_id   BIGINT NOT NULL REFERENCES products(id),
  quantity     INTEGER NOT NULL CHECK (quantity > 0),
  unit_price   NUMERIC(12,2) NOT NULL CHECK (unit_price >= 0),
  discount     NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
  PRIMARY KEY (order_id, product_id)
);

CREATE TABLE IF NOT EXISTS payments (
  id            BIGSERIAL PRIMARY KEY,
  order_id      BIGINT NOT NULL REFERENCES sales_orders(id) ON DELETE CASCADE,
  method        TEXT NOT NULL,
  amount        NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
  recorded_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS financial_transactions (
  id               BIGSERIAL PRIMARY KEY,
  kind             TEXT NOT NULL CHECK (kind IN ('entrada','saida')),
  category         TEXT NOT NULL,
  amount           NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
  related_order_id BIGINT REFERENCES sales_orders(id) ON DELETE SET NULL,
  status           TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','completed','cancelled')),
  description      TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3) Índices úteis
CREATE INDEX IF NOT EXISTS idx_sales_orders_customer ON sales_orders (customer_id);
CREATE INDEX IF NOT EXISTS idx_sales_orders_status_created ON sales_orders (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_order ON payments (order_id);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_kind ON financial_transactions (kind, status);

-- 4) Grants para schema app (conforme orientação Supabase)
GRANT USAGE ON SCHEMA app TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES    IN SCHEMA app TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES  IN SCHEMA app TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA app TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA app GRANT ALL ON TABLES    TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA app GRANT ALL ON ROUTINES  TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA app GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- 5) RLS (habilitar + políticas básicas para authenticated)
ALTER TABLE customers             ENABLE ROW LEVEL SECURITY;
ALTER TABLE products              ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_levels      ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_orders          ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items            ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments              ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;

-- Políticas: authenticated pode ler/escrever. (Ajuste para regras por tenant/auth.uid() quando a app definir tenants)
CREATE POLICY "customers_authenticated_all"
  ON customers
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "products_authenticated_all"
  ON products
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "inventory_authenticated_all"
  ON inventory_levels
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "orders_authenticated_all"
  ON sales_orders
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "items_authenticated_all"
  ON sale_items
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "payments_authenticated_all"
  ON payments
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "finance_authenticated_all"
  ON financial_transactions
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
