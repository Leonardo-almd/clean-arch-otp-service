import rateLimit, { ipKeyGenerator, RateLimitRequestHandler } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import type { RateLimiter, RateLimiterOptions } from '../../application/ports/infra/rate-limiter.port';
import type { DbConnection } from '../../application/ports/db/db-connection.port';
import { Logger } from '../../utils/logger';

export class RedisRateLimiterService implements RateLimiter {
  private limiters: Map<string, RateLimitRequestHandler> = new Map();
  private logger = new Logger('RedisRateLimiter');

  constructor(
    private readonly dbConnection: DbConnection,
    private readonly defaultOptions: RateLimiterOptions
  ) {
    this.logger.info('Redis rate limiter service initialized');
  }

  createLimiter(path: string, options?: Partial<RateLimiterOptions>) {
    if (!this.limiters.has(path)) {
      const limiterOptions = {
        ...this.defaultOptions,
        ...options
      };

      const limiter = rateLimit({
        windowMs: limiterOptions.windowMs,
        max: limiterOptions.max,
        standardHeaders: limiterOptions.standardHeaders ?? true,
        legacyHeaders: limiterOptions.legacyHeaders ?? false,
        message: limiterOptions.message ?? { message: 'Too many requests, please try again later.' },
        keyGenerator: (request: any, _response: any) => {
          const ip: string = request.ip ||
            (request.headers && request.headers['x-forwarded-for']) || ipKeyGenerator(request.ip);
          

          return ip;
        },
        store: new RedisStore({
          sendCommand: (...args: string[]) => this.dbConnection.getClient().sendCommand(args),
          prefix: `rl:${path}:`,
          resetExpiryOnChange: true
        }),
      });

      this.limiters.set(path, limiter);
      this.logger.info(`Rate limiter created for path: ${path}`);
    }

    return this.limiters.get(path);
  }

  middleware(path: string, options?: Partial<RateLimiterOptions>) {
    return this.createLimiter(path, options);
  }
}