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
    nextPaymentDate: {
      type: Date,
      required: function () {
        return this.isRecurring;
      },
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

export default mongoose.model("Bills", BillsSchema);