import { NextFunction, Request, Response } from 'express';
import AuthService from '@src/util/AuthService';

export function authMiddleware(
  req: Partial<Request>,
  res: Partial<Response>,
  next: NextFunction
): void {
  const token = req.headers?.authorization;
  try {
    const decoded = AuthService.decodeToken(token as string);
    req.decoded = decoded;
    next();
  } catch (err) {
    res.status?.(401).send({ code: 401, error: err.message });
  }
}
