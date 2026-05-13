import express from "express";
import multer from "multer";
import {
  getAdminPortfolio,
  updatePortfolio,
  uploadImage
} from "../controllers/adminController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/roleMiddleware.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 7 * 1024 * 1024 }
});

export const adminRoutes = express.Router();

adminRoutes.use(authenticate, requireAdmin);
adminRoutes.get("/portfolio", getAdminPortfolio);
adminRoutes.put("/portfolio", updatePortfolio);
adminRoutes.post("/upload/image", upload.single("image"), uploadImage);
