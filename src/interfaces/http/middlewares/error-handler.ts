import { Request, Response, NextFunction } from 'express';
import { Logger } from '../../../utils/logger';

interface ErrorWithCode extends Error {
  code?: string | number;
  statusCode?: number;
}

export class ErrorHandlerMiddleware {
  private logger = new Logger('ErrorHandler');

  public handle = (err: ErrorWithCode, req: Request, res: Response, next: NextFunction): void => {
    const statusCode = err.statusCode ||
      (err.code === 'VALIDATION_ERROR' ? 400 :
        err.code === 'NOT_FOUND' ? 404 :
          err.code === 'UNAUTHORIZED' ? 401 :
            err.code === 'FORBIDDEN' ? 403 : 500);

    const errorResponse = {
      status: 'error',
      statusCode,
      message: statusCode === 500 ? 'Internal server error' : err.message,
      path: req.originalUrl,
      timestamp: new Date().toISOString(),
      method: req.method,
      requestId: req.headers['x-request-id'] || `req-${Date.now()}`
    };

    this.logger.error(`[${errorResponse.requestId}] Error: ${err.message}`, {
      statusCode,
      path: req.originalUrl,
      method: req.method,
      stack: err.stack,
      body: req.body,
      params: req.params,
      query: req.query
    });

    res.status(statusCode).json(errorResponse);
  };
}