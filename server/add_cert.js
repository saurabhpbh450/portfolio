import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { Portfolio } from "./src/models/Portfolio.js";

async function main() {
  await mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost:27017/portfolio12");
  const portfolio = await Portfolio.findOne();
  if (portfolio) {
    if (!portfolio.certifications) {
        portfolio.certifications = [];
    }
    portfolio.certifications.push({
      title: "Temporary Demo Certificate (Remove Me)",
      issuer: "Example Org",
      year: "2026",
      date: new Date().toISOString(),
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjas-EmCpF6tBoqBFVeFA67mM5dyaFe9cArQ&s",
      imageUrl: ""
    });
    await portfolio.save();
    console.log("Successfully added temporary certificate.");
  } else {
    console.log("No portfolio document found dynamically in database.");
  }
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
