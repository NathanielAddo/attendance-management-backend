import { verifyToken } from "../utils/tokenVerifier";
import { handleError } from "./error.middleware";
import { HttpRequest, HttpResponse } from "uWebSockets.js";

type UWSHttpResponse = any; // Replace 'any' with a proper type if available
type UWSHttpRequest = any;

export const authenticate = async (res: UWSHttpResponse, req: UWSHttpRequest): Promise<void> => {
  try {
    console.log("=== Authenticating Request ===");

    let token: string | undefined;

    // Step 1: Check for token in cookies
    const cookies = req.getHeader("cookie") || "";
    const cookieMatch = cookies.match(/authToken=([^;]+)/);
    token = cookieMatch ? cookieMatch[1] : undefined;
    console.log("Token from Cookie:", token || "No token found in cookies");

    // Step 2: Fallback to Authorization header if no token in cookies
    if (!token) {
      const authHeader = req.getHeader("authorization");
      console.log("Authorization Header:", authHeader || "No authorization header found");

      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
        console.log("Token from Authorization Header:", token);
      }
    }

    // Step 3: Reject if no token is found
    if (!token) {
      res.writeStatus("401 Unauthorized").end(JSON.stringify({
        success: false,
        message: "Authentication token missing or invalid",
      }));
      return; // Ensure the function exits
    }

    // Step 4: Verify the token
    const decoded = verifyToken(token);
    console.log("Decoded Token:", decoded);

    // Step 5: Attach decoded user info to the request object
    (req as any).user = decoded;

    // Step 6: Proceed to the next middleware or route handler
    res.writeStatus("200 OK").end();
  } catch (error) {
    console.error("Authentication error:", (error as Error).message);

    // Step 7: Handle the error
    handleError(res, error);
    return; // Ensure the function exits after handling the error
  }
};
