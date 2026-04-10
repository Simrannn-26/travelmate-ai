import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { env } from '../config/env.js';
import { AppError } from '../middleware/errorHandler.js';

// Attach req.user if token is valid. Optional = won't throw if no token.
export function protect(optional = false) {
  return async (req, res, next) => {
    const header = req.headers.authorization;
    const token = header?.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      if (optional) return next();
      return next(new AppError('Authentication required', 401));
    }

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
      if (!req.user) throw new AppError('User no longer exists', 401);
      next();
    } catch (err) {
      next(new AppError('Invalid or expired token', 401));
    }
  };
}