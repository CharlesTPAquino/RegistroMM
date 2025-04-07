import mongoose from 'mongoose';

const productionRecordSchema = new mongoose.Schema({
  employee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: [true, 'ID do funcionário é obrigatório'],
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'ID do produto é obrigatório'],
  },
  order_number: {
    type: String,
    required: [true, 'Número do pedido é obrigatório'],
    trim: true,
  },
  batch_number: {
    type: String,
    required: [true, 'Número do lote é obrigatório'],
    trim: true,
  },
  production_date: {
    type: Date,
    required: [true, 'Data de produção é obrigatória'],
  },
  status: {
    type: String,
    enum: ['Em andamento', 'Pausado', 'Concluído', 'Cancelado'],
    default: 'Em andamento',
  },
  completion_date: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware para atualizar o updatedAt antes de salvar
productionRecordSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.ProductionRecord || mongoose.model('ProductionRecord', productionRecordSchema);
