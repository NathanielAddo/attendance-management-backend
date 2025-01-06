import { Request } from "express";

// Define the structure of your JWT payload
export interface CustomJwtPayload {
  id: string; // Required ID property
  email?: string; // Example optional email property
}

// Extend the Express Request to include the `user` property
export interface AuthenticatedRequest extends Request {
  user: CustomJwtPayload; // Ensure `user` includes the required `id` property
}
