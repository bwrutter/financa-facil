import { Router } from "express";
import { addTransaction, listTransactions, accountBalance } from "./transaction.controller.js";
import { authMiddleware } from "../auth/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/", addTransaction);
router.get("/", listTransactions);
router.get("/balance/:accountId", accountBalance);

export default router;
