export interface Product {
  id: string;
  name: string;
  code?: string;
  active: boolean;
  category: string;
  stock: number;
  price: number;
  type?: 'Gel Construtor' | 'Capa Base Flex' | 'Capa Base Estrutural' | 'TopCoat' | 'TopCoat Shine' | 'Gel Gummy' | 'Banho de Fibra' | 'Gel Shine';
  batch_number?: string;
  manufacturing_date?: string;
  order_number?: string;
}
