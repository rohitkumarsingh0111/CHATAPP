import jwt from "jsonwebtoken";
import { ENV } from "../lib/env.js";

export const generateToken = (userId, res) => {
  if (!ENV.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  const token = jwt.sign({ userId }, ENV.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
  httpOnly: true,
  sameSite: "lax",   // ✅ REQUIRED for Vercel + Render
  secure: true,       // ✅ REQUIRED when sameSite = none
  maxAge: 7 * 24 * 60 * 60 * 1000,
});


  return token;
};
