import jwt from "jsonwebtoken";
import type { JWTPayload } from "@dto/index.ts";

const JWT_SECRET = process.env.JWT_SECRET || "change-this-secret-in-production";
// 7 days in seconds
const JWT_EXPIRES_IN_SECONDS = 7 * 24 * 60 * 60;

export const signToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN_SECONDS,
  });
};

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch {
    return null;
  }
};

export const decodeToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.decode(token) as JWTPayload;
    return decoded;
  } catch {
    return null;
  }
};

// Cookie configuration
export const COOKIE_NAME = "auth_token";

export const getCookieOptions = (isProduction: boolean) => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? ("strict" as const) : ("lax" as const),
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  path: "/",
});
