-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Criar tabela de produtos
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Criar tabela de registros de produção
CREATE TABLE IF NOT EXISTS production_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id),
  employee_id UUID REFERENCES employees(id),
  order_number TEXT NOT NULL,
  batch_number TEXT NOT NULL,
  production_date DATE NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL CHECK (status IN ('Em Andamento', 'Concluído', 'Pausado', 'Cancelado')),
  waiting_start_time TIMESTAMP WITH TIME ZONE,
  waiting_end_time TIMESTAMP WITH TIME ZONE,
  delay_start_time TIMESTAMP WITH TIME ZONE,
  delay_end_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Habilitar Row Level Security
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_records ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso para employees
CREATE POLICY "Permitir leitura para todos" ON employees FOR SELECT USING (true);
CREATE POLICY "Permitir inserção para todos" ON employees FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir atualização para todos" ON employees FOR UPDATE USING (true);
CREATE POLICY "Permitir exclusão para todos" ON employees FOR DELETE USING (true);

-- Políticas de acesso para products
CREATE POLICY "Permitir leitura para todos" ON products FOR SELECT USING (true);
CREATE POLICY "Permitir inserção para todos" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir atualização para todos" ON products FOR UPDATE USING (true);
CREATE POLICY "Permitir exclusão para todos" ON products FOR DELETE USING (true);

-- Políticas de acesso para production_records
CREATE POLICY "Permitir leitura para todos" ON production_records FOR SELECT USING (true);
CREATE POLICY "Permitir inserção para todos" ON production_records FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir atualização para todos" ON production_records FOR UPDATE USING (true);
CREATE POLICY "Permitir exclusão para todos" ON production_records FOR DELETE USING (true);