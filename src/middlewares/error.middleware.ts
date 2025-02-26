import { toCustomError } from "../utils/to_custom_error";
import { HttpResponse } from "uWebSockets.js";

type UWSHttpResponse = any; // Replace 'any' with a proper type if available
type UWSHttpRequest = any;

export const handleError = (res: UWSHttpResponse, error: unknown): void => {
  const { message, statusCode } = toCustomError(error);

  // Set the response status and send the JSON error response
  res.writeStatus(statusCode.toString()).end(JSON.stringify({
    success: false,
    message,
    statusCode,
  }));
};
