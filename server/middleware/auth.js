import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  try {
    const token = req.cookies[process.env.COOKIE_NAME];
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}