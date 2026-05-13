import { z } from "zod";
import { Portfolio } from "../models/Portfolio.js";
import { cloudinary } from "../config/cloudinary.js";
import { hasCloudinaryConfig } from "../config/env.js";

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

const optionalHttpUrl = z
  .string()
  .trim()
  .refine((value) => value === "" || isHttpUrl(value), {
    message: "Must be empty or a valid http/https URL"
  });

const optionalAssetUrl = z
  .string()
  .trim()
  .refine((value) => value === "" || value.startsWith("/") || isHttpUrl(value), {
    message: "Must be empty, a relative asset path, or a valid http/https URL"
  });

const nonEmptyString = z.string().trim().min(1);

const quickFactSchema = z.object({
  label: nonEmptyString,
  value: nonEmptyString
});

const skillCategorySchema = z.object({
  title: nonEmptyString,
  items: z.array(z.string().trim()).default([])
});

const skillTagSchema = z.object({
  id: z.string().trim().min(1),
  name: nonEmptyString
});

const projectSchema = z.object({
  slug: nonEmptyString,
  title: nonEmptyString,
  tagline: nonEmptyString,
  createdAt: z.union([z.string(), z.date()]).optional(),
  bullets: z.array(z.string().trim()).default([]),
  tech: z.array(z.string().trim()).default([]),
  skillTagIds: z.array(z.string().trim()).default([]),
  liveUrl: optionalHttpUrl.default(""),
  githubUrl: optionalHttpUrl.default(""),
  coverImageUrl: optionalAssetUrl.default(""),
  images: z.array(optionalAssetUrl).default([]),
  details: z.string().default("")
});

const internshipSchema = z.object({
  title: nonEmptyString,
  company: z.string().trim().default(""),
  period: z.string().trim().default(""),
  duration: z.string().trim().default(""),
  location: z.string().trim().default(""),
  bullets: z.array(z.string().trim()).default([])
});

const educationSchema = z.object({
  title: nonEmptyString,
  degree: z.string().trim().default(""),
  school: z.string().trim().default(""),
  universityBoard: z.string().trim().default(""),
  duration: z.string().trim().default(""),
  meta: z.string().trim().default("")
});

const certificationSchema = z.object({
  title: nonEmptyString,
  issuer: z.string().trim().default(""),
  year: z.string().trim().default(""),
  date: z.union([z.string(), z.date()]).optional(),
  url: optionalHttpUrl.default("")
});

const linkSchema = z.object({
  label: nonEmptyString,
  url: optionalHttpUrl
});

const portfolioSchema = z
  .object({
    name: nonEmptyString,
    title: nonEmptyString,
    profilePicUrl: optionalAssetUrl.default(""),

    tagline: nonEmptyString,
    availability: nonEmptyString,
    heroSubtext: z.string().default(""),
    heroFocus: z.string().default(""),
    heroStrength: z.string().default(""),
    heroMindset: z.string().default(""),

    aboutHeading: z.string().default(""),
    aboutSubheading: z.string().default(""),
    aboutIntro: z.string().default(""),
    aboutBullets: z.array(z.string().trim()).default([]),
    quickFacts: z.array(quickFactSchema).default([]),

    skillsHeading: z.string().default(""),
    skillsSubheading: z.string().default(""),
    skills: z.array(skillCategorySchema).default([]),

    skillTags: z.array(skillTagSchema).default([]),

    projectsHeading: z.string().default(""),
    projectsSubheading: z.string().default(""),
    projects: z.array(projectSchema).default([]),

    internshipsHeading: z.string().default(""),
    internshipsSubheading: z.string().default(""),
    internships: z.array(internshipSchema).default([]),

    educationHeading: z.string().default(""),
    educationSubheading: z.string().default(""),
    education: z.array(educationSchema).default([]),

    certificationsHeading: z.string().default(""),
    certificationsSubheading: z.string().default(""),
    certifications: z.array(certificationSchema).default([]),

    contactEmail: z.string().email(),
    links: z.array(linkSchema).default([]),
    resumeUrl: optionalHttpUrl.default("")
  });

function normalizePortfolio(input) {
  const links = (input?.links || [])
    .map((link) => ({
      label: String(link?.label || "").trim(),
      url: String(link?.url || "").trim()
    }))
    .filter((link) => link.label && link.url && isHttpUrl(link.url));

  const quickFacts = (input?.quickFacts || [])
    .map((fact) => ({
      label: String(fact?.label || "").trim(),
      value: String(fact?.value || "").trim()
    }))
    .filter((fact) => fact.label && fact.value);

  return {
    ...input,
    links,
    quickFacts
  };
}

export async function getAdminPortfolio(_req, res) {
  const portfolio = await Portfolio.findOne().lean();
  return res.json(portfolio);
}

export async function updatePortfolio(req, res) {
  const parsed = portfolioSchema.safeParse(normalizePortfolio(req.body));
  if (!parsed.success) {
    console.error("Validation failed:", JSON.stringify(parsed.error.issues, null, 2));
    return res.status(400).json({
      error: "Invalid portfolio payload",
      details: parsed.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message
      }))
    });
  }

  const updated = await Portfolio.findOneAndUpdate({}, parsed.data, {
    new: true,
    upsert: true
  }).lean();

  return res.json(updated);
}

export async function uploadImage(req, res) {
  if (!hasCloudinaryConfig()) {
    return res.status(400).json({ error: "Cloudinary is not configured" });
  }

  if (!req.file) {
    return res.status(400).json({ error: "Image file is required" });
  }

  try {
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "portfolio",
          resource_type: "image"
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      stream.end(req.file.buffer);
    });

    return res.json({ url: uploadResult.secure_url });
  } catch (error) {
    return res.status(502).json({
      error:
        error?.message ||
        "Cloudinary upload failed. Check API key/secret/cloud name and account permissions."
    });
  }
}
