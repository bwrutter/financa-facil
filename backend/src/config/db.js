import mongoose from "mongoose";

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error("MONGO_URI não definida no .env");
}

mongoose.connect(uri)
  .then(() => console.log("MongoDB conectado"))
  .catch(err => {
    console.error("Erro ao conectar no Mongo", err);
    process.exit(1);
  });
