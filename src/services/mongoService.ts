import connectDB from '../lib/mongodb';
import Employee from '../models/Employee';
import Product from '../models/Product';
import ProductionRecord from '../models/ProductionRecord';
import { ProductionStatus } from '../types';

export const mongoService = {
  // Funções para Employees
  async getEmployees() {
    await connectDB();
    return Employee.find({}).sort({ name: 1 });
  },

  async createEmployee(data: { name: string; email: string; role: string }) {
    await connectDB();
    return Employee.create(data);
  },

  async updateEmployee(id: string, data: Partial<{ name: string; email: string; role: string }>) {
    await connectDB();
    return Employee.findByIdAndUpdate(id, data, { new: true });
  },

  async deleteEmployee(id: string) {
    await connectDB();
    return Employee.findByIdAndDelete(id);
  },

  // Funções para Products
  async getProducts() {
    await connectDB();
    return Product.find({}).sort({ name: 1 });
  },

  async createProduct(data: { name: string }) {
    await connectDB();
    return Product.create(data);
  },

  async updateProduct(id: string, data: { name: string }) {
    await connectDB();
    return Product.findByIdAndUpdate(id, data, { new: true });
  },

  async deleteProduct(id: string) {
    await connectDB();
    return Product.findByIdAndDelete(id);
  },

  // Funções para ProductionRecord
  async getProductionRecords() {
    await connectDB();
    return ProductionRecord.find({})
      .populate('employee_id')
      .populate('product_id')
      .sort({ createdAt: -1 });
  },

  async startProduction(data: {
    employee_id: string;
    product_id: string;
    order_number: string;
    batch_number: string;
    production_date: string;
  }) {
    await connectDB();
    return ProductionRecord.create({
      ...data,
      status: 'Em andamento'
    });
  },

  async updateProductionStatus(
    id: string,
    status: ProductionStatus,
    completion_date?: string
  ) {
    await connectDB();
    return ProductionRecord.findByIdAndUpdate(
      id,
      {
        status,
        ...(completion_date && { completion_date: new Date(completion_date) })
      },
      { new: true }
    );
  }
};
