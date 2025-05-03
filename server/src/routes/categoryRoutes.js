import express from "express";
import {
  createCategory,
  getCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/", createCategory);
router.get("/", getCategory);

export default router;
