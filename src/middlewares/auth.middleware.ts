import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/tokenVerifier";
import { handleError } from "./error.middleware";

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Extract the authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Authorization token missing or invalid",
      });
      return; // Ensure early exit after response
    }

    // Extract the token
    const token = authHeader.split(" ")[1];

    // Verify the token
    const decoded = verifyToken(token);

    // Attach decoded user info to the request object
    (req as any).user = decoded;

    // Proceed to the next middleware or route handler
    next(); // Explicit return for clarity
  } catch (error) {
    console.error("Authentication error:", (error as Error).message);

    // Handle the error and explicitly return void
    handleError(res, error);
    return; // Ensure the function exits after handling the error
  }
};
