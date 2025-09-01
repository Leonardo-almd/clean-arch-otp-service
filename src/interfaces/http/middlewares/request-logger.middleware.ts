import { Request, Response, NextFunction } from 'express';
import { Logger } from '../../../utils/logger';

export class RequestLoggerMiddleware {
  private logger = new Logger('RequestLogger');

  constructor() {}

  public handle = (req: Request, res: Response, next: NextFunction): void => {
    const start = Date.now();

    const { method, originalUrl, ip, body, query, params } = req;
    const clientIp = ip || req.headers['x-forwarded-for'] || 'unknown';
    
    const requestData = {
      body,
      query,
      params,
      headers: this.sanitizeHeaders(req.headers)
    };
    
    this.logger.info(
      `Incoming request: ${method} ${originalUrl} from ${clientIp}`,
      requestData
    );
    
    const originalSend = res.send;
    let responseBody: any;
    
    res.send = function(body: any): Response {
      responseBody = body;
      res.send = originalSend;
      return originalSend.call(this, body);
    };
    
    res.on('finish', () => {
      const responseTime = Date.now() - start;
      const { statusCode } = res;
      
      let parsedResponseBody;
      if (typeof responseBody === 'string') {
        try {
          parsedResponseBody = JSON.parse(responseBody);
        } catch (e) {
          parsedResponseBody = responseBody;
        }
      } else {
        parsedResponseBody = responseBody;
      }
      
      const responseData = {
        statusCode,
        responseTime: `${responseTime}ms`,
        body: parsedResponseBody,
      };
      
      if (statusCode >= 400) {
        this.logger.error(
          `Response: ${method} ${originalUrl} ${statusCode} - ${responseTime}ms`,
          responseData
        );
      } else {
        this.logger.info(
          `Response: ${method} ${originalUrl} ${statusCode} - ${responseTime}ms`,
          responseData
        );
      }
    });
    
    next();
  };
  
  private sanitizeHeaders(headers: any): any {
    return {
      'content-type': headers['content-type'],
      'x-request-id': headers['x-request-id'],
      'host': headers['host']
    }
  }
}