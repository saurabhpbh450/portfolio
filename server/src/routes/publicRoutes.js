import express from "express";
import { getPublicPortfolio } from "../controllers/publicController.js";

export const publicRoutes = express.Router();

publicRoutes.get("/portfolio", getPublicPortfolio);
