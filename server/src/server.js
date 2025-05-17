import "dotenv/config";
import express from "express";
import cors from "cors";
import dbConnect from "./config/db.js";
import billsRoutes from "./routes/billsRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import setupSwagger from "./config/swaggerConfig.js";

const allowedOrigins = [ //TODO: Ajustar
  'https://financa-facil-6ff1e.firebaseapp.com',
  'http://localhost:5173'
];

const app = express();
app.options('*', cors());
app.use(express.json());
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

dbConnect();

setupSwagger(app);

app.use("/api/bills", billsRoutes);
app.use("/api/category", categoryRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
