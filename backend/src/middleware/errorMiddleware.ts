import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';

export const errorHandler = (
  err: Error | AppError,
  _req: Request, // <-- Added underscore to tell TS we don't use it
  res: Response,
  _next: NextFunction // <-- Added underscore
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let isOperational = false;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational; // We actually use it here now!
  } else {
    // Log unexpected errors for debugging
    console.error('💥 UNHANDLED ERROR:', err);
  }

  // In production, don't leak stack traces
  const response = {
    success: false,
    message,
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  // Optional: We can log non-operational errors to a file/datadog here
  if (!isOperational) {
    console.log('Sending 500 error to client.');
  }

  res.status(statusCode).json(response);
};

// Handles undefined routes
export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
};