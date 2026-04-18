import { Router } from "express";
import authRoutes from "./authRoutes";
import accountRoutes from "./accountRoutes";
import categoryRoutes from "./categoryRoutes";
import transactionRoutes from "./transactionRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/account", accountRoutes);
router.use("/category", categoryRoutes);
router.use("/transaction", transactionRoutes);

export default router;
