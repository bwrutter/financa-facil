import cors from "cors";
import express from "express";
import authRoutes from "./modules/auth/auth.router.js";
import accountRoutes from "./modules/accounts/account.routes.js";
import transactionRoutes from "./modules/transactions/transaction.routes.js";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import yaml from "js-yaml";

const swaggerDocument = yaml.load(fs.readFileSync("./src/docs/swagger.yml", "utf8"));

const app = express();

app.use(express.json())
app.use(cors());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/auth", authRoutes);
app.use("/accounts", accountRoutes);
app.use("/transactions", transactionRoutes);

export default app;