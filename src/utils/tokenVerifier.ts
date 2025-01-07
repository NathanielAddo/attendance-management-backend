import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export const verifyToken = (token: string): string | JwtPayload => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined in the environment variables.");
  }

  try {
    // Verify and decode the token
    return jwt.verify(token, jwtSecret);
  } catch (error) {
    throw new Error("Invalid or expired token.");
  }
};
