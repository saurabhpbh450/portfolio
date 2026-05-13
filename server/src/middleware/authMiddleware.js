import { verifyAuthToken } from "../utils/jwt.js";
import { env } from "../config/env.js";

export function authenticate(req, res, next) {
  const cookieToken = req.cookies?.[env.authCookieName];
  const authHeader = req.headers.authorization || "";
  const headerToken = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : "";

  const token = cookieToken || headerToken;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const payload = verifyAuthToken(token);
    req.auth = {
      userId: payload.sub,
      role: payload.role,
      email: payload.email || ""
    };
    return next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}
