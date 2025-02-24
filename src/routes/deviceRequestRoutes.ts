import uWS from 'uWebSockets.js';
import { 
  submitDeviceRequest, 
  getDeviceRequestStatus, 
  cancelDeviceRequest 
} from "../controllers/deviceRequestController.js";
import { authenticate } from '../middlewares/auth.middleware';
import { AuthenticatedRequest } from "../types/express";

const app = uWS.App();

app.post('/request-approval', (res, req) => {
  authenticate(req, res, () => {
    const authenticatedReq = req as AuthenticatedRequest;
    submitDeviceRequest(authenticatedReq, res);
  });
});

app.get('/request-status', (res, req) => {
  authenticate(req, res, () => {
    const authenticatedReq = req as AuthenticatedRequest;
    getDeviceRequestStatus(authenticatedReq, res);
  });
});

app.del('/request-approval/:requestId', (res, req) => {
  authenticate(req, res, () => {
    const authenticatedReq = req as AuthenticatedRequest;
    cancelDeviceRequest(authenticatedReq, res);
  });
});

app.listen(9001, (token) => {
  if (token) {
    console.log('Listening to port 9001');
  } else {
    console.log('Failed to listen to port 9001');
  }
});
