import mongoose from 'mongoose';

const BillsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    value: { type: Number, required: true },
    installments: { type: Number, default: 1 },
    installmentsPayed: { type: Number, default: 0 },
    isRecurring: { type: Boolean, default: false },
    nextPaymentDate: {
      type: Date,
      required: function () {
        return this.isRecurring;
      },
    },
    description: { type: String },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    userId: {
      type: String,
      ref: 'User',
      required: true,
    },
  }, { timestamps: true });  

export default mongoose.model('Bills', BillsSchema);