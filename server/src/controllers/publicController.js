import { Portfolio } from "../models/Portfolio.js";

export async function getPublicPortfolio(_req, res) {
  const portfolio = await Portfolio.findOne().lean();
  return res.json(portfolio);
}
