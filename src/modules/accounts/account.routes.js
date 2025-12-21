import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware.js";
import { store, index, remove } from "./account.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/", store);
router.get("/", index);
router.delete("/:id", remove);

export default router;
