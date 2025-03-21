// src/middlewares/error.middleware.ts
import { Response } from "express";

export const handleError = (res: Response, error: unknown): void => {
  console.error("Error:", (error as Error).message);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: (error as Error).message,
  });
};
