import "dotenv/config";
import express from "express";
import cors from "cors";
import dbConnect from "./config/db.js";
import billsRoutes from "./routes/billsRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import setupSwagger from "./config/swaggerConfig.js";

const app = express();
app.use(express.json());
app.use(cors());

dbConnect();

setupSwagger(app);

app.use("/api/bills", billsRoutes);
app.use("/api/category", categoryRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
