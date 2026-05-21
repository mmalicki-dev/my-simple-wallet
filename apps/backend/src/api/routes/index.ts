import { Router } from "express";
import authRoutes from "./authRoutes.js";
import accountRoutes from "./accountRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import transactionRoutes from "./transactionRoutes.js";
import recurringPaymentRoutes from "./recurringPayment.js";
import exchangeRateRoutes from "./exchangeRateRoutes.js";
import mobileAuthRoutes from "./mobileAuthRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/mobile/auth", mobileAuthRoutes);
router.use("/account", accountRoutes);
router.use("/category", categoryRoutes);
router.use("/transaction", transactionRoutes);
router.use("/recurringPayment", recurringPaymentRoutes);
router.use("/exchange-rates", exchangeRateRoutes);

export default router;
