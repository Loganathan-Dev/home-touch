import { Request, Response, NextFunction, RequestHandler } from 'express';

// Wraps async controllers so we don't need try/catch blocks everywhere
export const asyncHandler = (fn: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};