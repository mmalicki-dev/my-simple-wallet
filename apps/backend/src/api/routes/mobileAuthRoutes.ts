import { login, refresh, logout } from "../controllers/mobileAuthController";
import { Router } from "express";

const router = Router();

router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;
