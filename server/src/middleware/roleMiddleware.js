export function requireAdmin(req, res, next) {
  if (!req.auth) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.auth.role !== "admin") {
    return res.status(403).json({ error: "Access denied" });
  }

  return next();
}
