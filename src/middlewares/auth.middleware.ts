// import { Request, Response, NextFunction } from "express";
// import { verifyToken } from "../utils/tokenVerifier";
// import { handleError } from "./error.middleware";

// export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     console.log("=== Authenticating Request ===");

//     let token: string | undefined;

//     // Step 1: Check for token in cookies
//     const cookies = req.cookies || {};
//     token = cookies.authToken;
//     console.log("Token from Cookie:", token || "No token found in cookies");

//     // Step 2: Fallback to Authorization header if no token in cookies
//     if (!token) {
//       const authHeader = req.headers.authorization;
//       console.log("Authorization Header:", authHeader || "No authorization header found");

//       if (authHeader && authHeader.startsWith("Bearer ")) {
//         token = authHeader.split(" ")[1]; // Extract token after Bearer
//         console.log("Token from Authorization Header:", token);
//       }
//     }

//     // Step 3: Reject if no token is found
//     if (!token) {
//       res.status(401).json({
//         success: false,
//         message: "Authentication token missing or invalid",
//       });
//       return;
//     }

//     // Step 4: Verify the token
//     const decoded = verifyToken(token);
//     console.log("Decoded Token:", decoded);

//     // Step 5: Attach decoded user info to the request object
//     (req as any).user = decoded;

//     // Step 6: Proceed to the next middleware or route handler
//     next();
//   } catch (error) {
//     console.error("Authentication error:", (error as Error).message);

//     // Step 7: Handle the error
//     handleError(res, error);
//     return;
//   }
// };
