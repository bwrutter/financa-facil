import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  type: { type: String, enum: ["INCOME", "EXPENSE"], required: true },
  date: { type: Date, default: Date.now },
  category: { type: String, required: true },
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
