-- Enable Row Level Security
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_records ENABLE ROW LEVEL SECURITY;

-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS public.employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.production_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES public.employees(id),
    product_id UUID REFERENCES public.products(id),
    order_number TEXT NOT NULL,
    batch_number TEXT NOT NULL,
    production_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'Em Andamento',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create policies
CREATE POLICY "employees_read_all" ON public.employees
    FOR SELECT USING (true);

CREATE POLICY "products_read_all" ON public.products
    FOR SELECT USING (true);

CREATE POLICY "products_insert_all" ON public.products
    FOR INSERT WITH CHECK (true);

CREATE POLICY "production_records_read_all" ON public.production_records
    FOR SELECT USING (true);

CREATE POLICY "production_records_insert_all" ON public.production_records
    FOR INSERT WITH CHECK (true);

CREATE POLICY "production_records_update_all" ON public.production_records
    FOR UPDATE USING (true) WITH CHECK (true);

-- Function to handle production record updates
CREATE OR REPLACE FUNCTION public.handle_production_record_update()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for production record updates
CREATE TRIGGER production_record_update
    BEFORE UPDATE ON public.production_records
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_production_record_update();

-- Insert sample data
INSERT INTO public.employees (name) VALUES
    ('Luan Damasceno'),
    ('Maria Silva'),
    ('João Santos')
ON CONFLICT DO NOTHING;

INSERT INTO public.products (name) VALUES
    ('Capa Base Flex Natural Pink'),
    ('Gel Construtor Universal Bege'),
    ('Test')
ON CONFLICT DO NOTHING;
