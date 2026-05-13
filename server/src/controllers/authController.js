import bcrypt from "bcrypt";
import { z } from "zod";
import { User } from "../models/User.js";
import { env } from "../config/env.js";
import { getCookieOptions, signAuthToken } from "../utils/jwt.js";

const signupSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(128)
});

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128)
});

function setAuthCookie(res, token) {
  res.cookie(env.authCookieName, token, getCookieOptions());
}

export async function signup(req, res) {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid signup payload" });
  }

  const { name, email, password } = parsed.data;
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(409).json({ error: "Email already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase(),
    password: passwordHash,
    role: "user"
  });

  return res.status(201).json({
    message: "Signup successful. Your role is user. Admin role must be set manually in DB.",
    user: {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    }
  });
}

export async function signin(req, res) {
  const parsed = signinSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid login payload" });
  }

  const { email, password } = parsed.data;
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const passwordOk = await bcrypt.compare(password, user.password);
  if (!passwordOk) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = signAuthToken({
    sub: String(user._id),
    role: user.role,
    email: user.email
  });

  setAuthCookie(res, token);

  return res.json({
    message: user.role === "admin" ? "Login successful" : "Logged in, but admin access required",
    user: {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    }
  });
}

export async function me(req, res) {
  const user = await User.findById(req.auth.userId).select("name email role createdAt");
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  return res.json({ user });
}

export function signout(_req, res) {
  const opts = getCookieOptions();
  res.clearCookie(env.authCookieName, opts);
  return res.json({ message: "Signed out" });
}
