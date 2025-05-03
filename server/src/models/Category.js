import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String, //exemplo: Alimentação, Transporte, Saúde, Streaming, Outros
      required: true,
    },
    userId: {
      type: String,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Category", CategorySchema);
