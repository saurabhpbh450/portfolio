import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";

import { connectDb } from "./config/db.js";
import { initCloudinary } from "./config/cloudinary.js";
import { env } from "./config/env.js";

import { Portfolio } from "./models/Portfolio.js";
import { SiteContent } from "./models/SiteContent.js";

import { adminRoutes } from "./routes/adminRoutes.js";
import { authRoutes } from "./routes/authRoutes.js";
import { publicRoutes } from "./routes/publicRoutes.js";

import { defaultPortfolio } from "./seed/defaultPortfolio.js";

const app = express();

app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true
  })
);

app.use(cookieParser());

app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api", publicRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);

  res.status(500).json({
    error: "Internal server error"
  });
});

async function seedPortfolio() {
  const existing = await Portfolio.findOne();

  if (existing) return;

  const legacy = await SiteContent.findOne().lean();

  if (legacy) {
    await Portfolio.create({
      name: legacy.name,
      title: legacy.title,
      tagline: legacy.tagline,
      availability: legacy.availability,
      heroSubtext: legacy.heroSubtext,
      aboutBullets: legacy.aboutBullets,
      skills: legacy.skills,
      projects: legacy.projects,
      internships: legacy.experience,
      education: legacy.education,
      contactEmail: legacy.contactEmail,
      links: legacy.links,
      resumeUrl: legacy.resumeUrl
    });

    return;
  }

  await Portfolio.create(defaultPortfolio);
}

let initialized = false;

async function initialize() {
  if (initialized) return;

  await connectDb(env.mongodbUrl);

  initCloudinary();

  await seedPortfolio();

  initialized = true;
}

await initialize();

export default app;