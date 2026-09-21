import { Request, Response, NextFunction } from 'express';
import { db } from '../db';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Admin authentication required.' });
  }

  const token = authHeader.split(' ')[1];
  const user = db.getUserByToken(token);
  if (!user) {
    return res.status(401).json({ error: 'Session expired or invalid token. Please log in again.' });
  }

  req.user = user;
  next();
};
