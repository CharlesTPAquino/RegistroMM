-- Criar tabela de produtos
CREATE TABLE IF NOT EXISTS public.products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de registros de produção
CREATE TABLE IF NOT EXISTS public.production_records (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  order_number VARCHAR(50) NOT NULL,
  batch_number VARCHAR(50) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  status VARCHAR(20) NOT NULL DEFAULT 'produzindo',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_status CHECK (status IN ('produzindo', 'sendo separado', 'parado', 'finalizado'))
);

-- Adicionar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_production_employee ON public.production_records(employee_id);
CREATE INDEX IF NOT EXISTS idx_production_product ON public.production_records(product_id);
CREATE INDEX IF NOT EXISTS idx_production_created_at ON public.production_records(created_at);

-- Adicionar políticas de segurança (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_records ENABLE ROW LEVEL SECURITY;

-- Criar políticas para permitir acesso a todos os usuários autenticados
CREATE POLICY products_policy ON public.products
  FOR ALL USING (true);

CREATE POLICY production_records_policy ON public.production_records
  FOR ALL USING (true);

-- Inserir alguns produtos de exemplo
INSERT INTO public.products (name, description)
VALUES 
  ('Produto A', 'Descrição do Produto A'),
  ('Produto B', 'Descrição do Produto B'),
  ('Produto C', 'Descrição do Produto C')
ON CONFLICT (id) DO NOTHING;
