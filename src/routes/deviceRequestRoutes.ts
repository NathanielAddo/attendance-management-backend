import express, { Response, Request } from "express";
import { 
  submitDeviceRequest, 
  getDeviceRequestStatus, 
  cancelDeviceRequest 
} from "../controllers/deviceRequestController.js";
import { verifyToken } from "../utils/verifyToken";
import { AuthenticatedRequest } from "../types/express";

const router = express.Router();

router.post(
  "/request-approval",
  verifyToken,
  (req, res) => {
    // Assert that `req` is an AuthenticatedRequest
    const authenticatedReq = req as AuthenticatedRequest;
    submitDeviceRequest(authenticatedReq, res);
  }
);

router.get(
  "/request-status",
  verifyToken,
  (req, res) => {
    // Assert that `req` is an AuthenticatedRequest
    const authenticatedReq = req as AuthenticatedRequest;
    getDeviceRequestStatus(authenticatedReq, res);
  }
);

router.delete(
  "/request-approval/:requestId",
  verifyToken,
  (req, res) => {
    // Assert that `req` is an AuthenticatedRequest
    const authenticatedReq = req as AuthenticatedRequest;
    cancelDeviceRequest(authenticatedReq, res);
  }
);

export default router;
