import express from "express";
import {
  createBills,
  getBills,
  getBillById,
  deleteBill,
  updateBill,
} from "../controllers/billsController.js";

const router = express.Router();

router.post("/", createBills);
router.get("/", getBills);
router.get("/:id", getBillById);
router.delete("/:id", deleteBill);
router.put("/:id", updateBill);

export default router;
