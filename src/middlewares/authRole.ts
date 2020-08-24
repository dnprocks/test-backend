import { NextFunction, Request, Response } from 'express';
import { ROLE } from '@src/entities/user';

export function authRoleAdminMiddleware(
  req: Partial<Request>,
  res: Partial<Response>,
  next: NextFunction
): void {
  if (!(req.decoded?.role == ROLE.ADMIN)) {
    res.status?.(401).send({ code: 401, error: 'Unauthorized operation!' });
  }
  next();
}
