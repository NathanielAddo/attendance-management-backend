import { Response } from "express";
import { toCustomError } from "../utils/to_custom_error";

export const handleError = (res: Response, error: unknown): void => {
  const { message, statusCode } = toCustomError(error);

  // Set the response status and send the JSON error response
  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
};
