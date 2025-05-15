import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "O nome da categoria é obrigatório"],
      trim: true,
      minlength: [2, "O nome da categoria deve ter pelo menos 2 caracteres"],
    },
    userId: {
      type: String,
      required: [true, "O userId é obrigatório"],
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Category", CategorySchema);