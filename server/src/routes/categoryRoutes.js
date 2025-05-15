import express from "express";
import {
  createCategory,
  getCategory,
  getCategoryById,
  deleteCategory,
  updateCategory,
} from "../controllers/categoryController.js";

import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateUser);

router.post("/", createCategory);
router.get("/", getCategory);
router.get("/:id", getCategoryById);
router.delete("/:id", deleteCategory);
router.put("/:id", updateCategory);

export default router;
