import { ProductionRecord } from '../types/ProductionRecord'

export async function createProductionRecord(record: Partial<ProductionRecord>) {
  // TODO: Implementar chamada à API
  return { id: '1', ...record }
}

export async function updateProductionRecord(id: string, record: Partial<ProductionRecord>) {
  // TODO: Implementar chamada à API
  return { id, ...record }
}

export async function deleteProductionRecord(id: string) {
  // TODO: Implementar chamada à API
  console.log(`Deletando registro com ID: ${id}`);
  return true
}

export async function getProductionRecords(): Promise<ProductionRecord[]> {
  // TODO: Implementar chamada à API
  return []
}
