import express from "express";
import { me, signin, signout, signup } from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";

export const authRoutes = express.Router();

authRoutes.post("/signup", signup);
authRoutes.post("/signin", signin);
authRoutes.post("/signout", signout);
authRoutes.get("/me", authenticate, me);
