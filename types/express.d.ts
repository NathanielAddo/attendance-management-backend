import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    // Add any other properties that might be present in the user object
  };
}

