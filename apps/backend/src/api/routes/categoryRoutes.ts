import { Router } from "express";
import {
  get,
  remove,
  update,
  create,
} from "../controllers/categoryController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/", protect, create);
router.get("/", protect, get);
router.put("/:id", protect, update);
router.delete("/:id", protect, remove);

export default router;
