import { Router } from "express";
import { login } from "../controllers/authControllers";

const router = Router();

// Google OAuth Login Route
router.post("/login", login);

export default router;
