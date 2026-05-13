import mongoose from "mongoose";

const linkSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    url: { type: String, required: true }
  },
  { _id: false }
);

const skillCategorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    items: { type: [String], default: [] }
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true },
    title: { type: String, required: true },
    tagline: { type: String, required: true },
    bullets: { type: [String], default: [] },
    tech: { type: [String], default: [] },
    liveUrl: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    coverImageUrl: { type: String, default: "" }
  },
  { _id: false }
);

const experienceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, default: "" },
    period: { type: String, default: "" },
    bullets: { type: [String], default: [] }
  },
  { _id: false }
);

const educationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    meta: { type: String, default: "" }
  },
  { _id: false }
);

const siteContentSchema = new mongoose.Schema(
  {
    name: { type: String, default: "Saurabh Mishra" },
    title: { type: String, default: "Software Developer" },
    tagline: {
      type: String,
      default: "Turning ideas into real-world applications"
    },
    availability: { type: String, default: "?? Immediate Joiner" },
    heroSubtext: { type: String, default: "" },
    aboutBullets: { type: [String], default: [] },
    skills: { type: [skillCategorySchema], default: [] },
    projects: { type: [projectSchema], default: [] },
    experience: { type: [experienceSchema], default: [] },
    education: { type: [educationSchema], default: [] },
    contactEmail: { type: String, default: "" },
    links: { type: [linkSchema], default: [] },
    resumeUrl: { type: String, default: "" }
  },
  { timestamps: true }
);

export const SiteContent = mongoose.model("SiteContent", siteContentSchema);
