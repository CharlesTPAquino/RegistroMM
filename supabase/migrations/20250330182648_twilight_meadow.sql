/*
  # Production Tracking System Schema

  1. New Tables
    - `employees`
      - `id` (uuid, primary key)
      - `name` (text)
      - `created_at` (timestamp)
    
    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `created_at` (timestamp)
    
    - `production_records`
      - `id` (uuid, primary key)
      - `product_id` (uuid, foreign key)
      - `employee_id` (uuid, foreign key)
      - `order_number` (text) - OP number
      - `batch_number` (text) - Lot number
      - `production_date` (date)
      - `start_time` (timestamptz)
      - `end_time` (timestamptz)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all users to read employees"
  ON employees
  FOR SELECT
  TO authenticated
  USING (true);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all users to read products"
  ON products
  FOR SELECT
  TO authenticated
  USING (true);

-- Create production_records table
CREATE TABLE IF NOT EXISTS production_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) NOT NULL,
  employee_id uuid REFERENCES employees(id) NOT NULL,
  order_number text NOT NULL,
  batch_number text NOT NULL,
  production_date date NOT NULL DEFAULT CURRENT_DATE,
  start_time timestamptz,
  end_time timestamptz,
  status text NOT NULL DEFAULT 'Aguardando inicio',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE production_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to CRUD their records"
  ON production_records
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_production_records_updated_at
    BEFORE UPDATE ON production_records
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();