import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import { JWT_SECRET } from '../config/env.js';

/** Shape of the payload we sign in authController. */
export interface JwtPayload {
  userId: string;
}

/**
 * A Request that has passed through `auth` — userId is guaranteed present.
 * Handlers behind the middleware type their req as this to avoid
 * re-checking a value the middleware already validated.
 */
export type AuthedRequest = Request & { userId: string };

const auth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.userId = decoded.userId; // attach to the request — this IS CurrentUserId
    next(); // pass control to the route handler
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export default auth;
