import mongoose from "mongoose";

const linkSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    url: { type: String, required: true }
  },
  { _id: false }
);

const quickFactSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true }
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

const skillTagSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true }
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true },
    title: { type: String, required: true },
    tagline: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    bullets: { type: [String], default: [] },
    tech: { type: [String], default: [] },
    skillTagIds: { type: [String], default: [] },
    liveUrl: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    coverImageUrl: { type: String, default: "" },
    images: { type: [String], default: [] },
    details: { type: String, default: "" }
  },
  { _id: false }
);

const internshipSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, default: "" },
    startDate: { type: String, default: "" },
    endDate: { type: String, default: "" },
    isCurrent: { type: Boolean, default: false },
    period: { type: String, default: "" },
    duration: { type: String, default: "" },
    location: { type: String, default: "" },
    workType: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
    bullets: { type: [String], default: [] }
  },
  { _id: false }
);

const educationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    degree: { type: String, default: "" },
    school: { type: String, default: "" },
    universityBoard: { type: String, default: "" },
    duration: { type: String, default: "" },
    meta: { type: String, default: "" }
  },
  { _id: false }
);

const certificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    issuer: { type: String, default: "" },
    year: { type: String, default: "" },
    date: { type: Date, default: Date.now },
    url: { type: String, default: "" },
    imageUrl: { type: String, default: "" }
  },
  { _id: false }
);

const portfolioSchema = new mongoose.Schema(
  {
    name: { type: String, default: "Saurabh Mishra" },
    title: { type: String, default: "Software Developer" },
    profilePicUrl: { type: String, default: "" },

    tagline: { type: String, default: "Turning ideas into real-world applications" },
    availability: { type: String, default: "Immediate Joiner" },
    heroSubtext: { type: String, default: "" },
    heroFocus: { type: String, default: "MERN | Backend Logic | Clean UX" },
    heroStrength: { type: String, default: "APIs, Auth, Roles, Performance" },
    heroMindset: {
      type: String,
      default: "Product-first engineering and problem solving"
    },

    aboutHeading: {
      type: String,
      default: "Builder mindset. Production-ready execution."
    },
    aboutSubheading: {
      type: String,
      default: "A short story recruiters can scan in seconds."
    },
    aboutIntro: {
      type: String,
      default:
        "I am a developer who loves shipping real-world products. I build applications with strong backend logic, secure auth, and crisp UI."
    },
    aboutBullets: { type: [String], default: [] },
    quickFacts: { type: [quickFactSchema], default: [] },

    skillsHeading: { type: String, default: "Strong fundamentals. Modern stack." },
    skillsSubheading: {
      type: String,
      default: "Recruiter-friendly categories with production-ready technologies."
    },
    skills: { type: [skillCategorySchema], default: [] },

    skillTags: { type: [skillTagSchema], default: [] },

    projectsHeading: {
      type: String,
      default: "Mini case studies built for real impact"
    },
    projectsSubheading: {
      type: String,
      default: "Problem to solution to impact. Clear, scannable, product-focused."
    },
    projects: { type: [projectSchema], default: [] },

    internshipsHeading: { type: String, default: "Internships" },
    internshipsSubheading: {
      type: String,
      default: "Highlights focused on outcomes, not buzzwords."
    },
    internships: { type: [internshipSchema], default: [] },

    educationHeading: { type: String, default: "Strong foundation" },
    educationSubheading: { type: String, default: "A quick snapshot." },
    education: { type: [educationSchema], default: [] },

    certificationsHeading: { type: String, default: "Certifications" },
    certificationsSubheading: {
      type: String,
      default: "Credentials that back up the stack."
    },
    certifications: { type: [certificationSchema], default: [] },

    contactEmail: { type: String, default: "" },
    links: { type: [linkSchema], default: [] },
    resumeUrl: { type: String, default: "" }
  },
  { timestamps: true }
);

export const Portfolio = mongoose.model("Portfolio", portfolioSchema);
