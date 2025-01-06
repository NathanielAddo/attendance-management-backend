import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest, CustomJwtPayload } from "../types/express";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export const verifyToken: RequestHandler = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Expecting "Bearer <token>"

  if (!token) {
    res.status(401).json({ message: "Authorization token is required" });
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as CustomJwtPayload;

    // Attach `user` to the request object
    (req as AuthenticatedRequest).user = decoded;

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
