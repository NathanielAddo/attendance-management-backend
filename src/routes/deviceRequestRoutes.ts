import express, { Response, Request } from "express";
import { 
  submitDeviceRequest, 
  getDeviceRequestStatus, 
  cancelDeviceRequest 
} from "../controllers/deviceRequestController.js";
import { authenticate } from '../middlewares/auth.middleware';
import { AuthenticatedRequest } from "../types/express";

const router = express.Router();

router.post(
  "/request-approval",
  authenticate,
  (req, res) => {
    // Assert that `req` is an AuthenticatedRequest
    const authenticatedReq = req as AuthenticatedRequest;
    submitDeviceRequest(authenticatedReq, res);
  }
);

router.get(
  "/request-status",
  authenticate,
  (req, res) => {
    // Assert that `req` is an AuthenticatedRequest
    const authenticatedReq = req as AuthenticatedRequest;
    getDeviceRequestStatus(authenticatedReq, res);
  }
);

router.delete(
  "/request-approval/:requestId",
  authenticate,
  (req, res) => {
    // Assert that `req` is an AuthenticatedRequest
    const authenticatedReq = req as AuthenticatedRequest;
    cancelDeviceRequest(authenticatedReq, res);
  }
);

export default router;
