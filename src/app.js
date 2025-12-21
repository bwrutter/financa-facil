import express from "express";
import authRoutes from "./modules/auth/auth.router.js";
import accountRoutes from "./modules/accounts/account.routes.js";

const app = express();

app.use(express.json())
app.use("/auth", authRoutes);
app.use("/accounts", accountRoutes);

export default app;