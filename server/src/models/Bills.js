import mongoose from "mongoose";

const BillsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "O nome é obrigatório"],
      trim: true,
    },
    value: {
      type: Number,
      required: [true, "O valor é obrigatório"],
      min: [0, "O valor não pode ser negativo"],
    },
    installments: {
      type: Number,
      default: 1,
      min: [1, "Parcelas devem ser pelo menos 1"],
    },
    installmentsPayed: {
      type: Number,
      default: 0,
      min: [0, "Parcelas pagas não podem ser negativas"],
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurrenceType: {
      type: String,
      enum: ['monthly', 'yearly', 'weekly', 'daily'],
      required: function () {
        return this.isRecurring;
      }
    },
    recurrenceDay: {
      type: Number,
      min: [1, "Dia deve ser entre 1 e 31"],
      max: [31, "Dia deve ser entre 1 e 31"],
      required: function () {
        return this.isRecurring && this.recurrenceType === 'monthly';
      }
    },
    nextPaymentDate: {
      type: Date,
      required: function () {
        return this.isRecurring;
      },
    },
    lastPaymentDate: {
      type: Date,
      default: null,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "A categoria é obrigatória"],
    },
    userId: {
      type: String,
      required: [true, "O userId é obrigatório"],
      index: true,
    },
  },
  { timestamps: true }
);

// Método para calcular a próxima data de pagamento
BillsSchema.methods.calculateNextPaymentDate = function () {
  if (!this.isRecurring) return null;

  const currentDate = this.lastPaymentDate || new Date();
  let nextDate = new Date(currentDate);

  switch (this.recurrenceType) {
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      nextDate.setDate(this.recurrenceDay);
      break;
    case 'yearly':
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case 'daily':
      nextDate.setDate(nextDate.getDate() + 1);
      break;
  }

  return nextDate;
};

// Middleware para atualizar nextPaymentDate antes de salvar
BillsSchema.pre('save', function (next) {
  if (this.isRecurring && (!this.nextPaymentDate || this.isModified('recurrenceType') || this.isModified('recurrenceDay'))) {
    this.nextPaymentDate = this.calculateNextPaymentDate();
  }
  next();
});

export default mongoose.model("Bills", BillsSchema);