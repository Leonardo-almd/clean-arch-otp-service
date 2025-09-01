import { NextFunction, Request, Response } from 'express';
import type { RateLimiter } from '../../../application/ports/infra/rate-limiter.port';
import { Logger } from '../../../utils/logger';

export class RateLimiterMiddleware {
  private logger = new Logger('RateLimiterMiddleware');

  constructor(private readonly rateLimiter: RateLimiter) {
    this.logger.info('Rate limiter middleware initialized');
  }

  public forPath(path: string, options?: any) {
    const limiter = this.rateLimiter.middleware(path, options);
    
    return (req: Request, res: Response, next: NextFunction) => {
      const originalSend = res.send;
      
      res.send = function(body: any): Response {
        res.send = originalSend;
        
        if (res.statusCode === 429) {
          const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
          const logger = new Logger('RateLimiter');
          logger.warn(`Rate limit exceeded: ${req.method} ${req.originalUrl} from ${ip}`);
        }
        
        return originalSend.call(this, body);
      };
      
      return limiter(req, res, next);
    };
  }
}