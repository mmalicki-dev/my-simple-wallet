import { Router } from "express";
import authRoutes from "./authRoutes.js";
import accountRoutes from "./accountRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import transactionRoutes from "./transactionRoutes.js";
import recurringPaymentRoutes from "./recurringPayment.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/account", accountRoutes);
router.use("/category", categoryRoutes);
router.use("/transaction", transactionRoutes);
router.use("/recurringPayment", recurringPaymentRoutes);

export default router;
