import type { Express } from 'express';
import express, { Router } from 'express';
import { TokenOtpRoutes } from './token-otp.routes';
import type { DbConnection } from '../../../application/ports/db/db-connection.port';
import { RateLimiterMiddleware } from '../middlewares/rate-limiter.middleware';

export class ApiRouter {
    private readonly router: Router;

    constructor(
        private readonly dbConnection: DbConnection,
        private readonly rateLimiterMiddleware: RateLimiterMiddleware
    ) {
        this.router = express.Router();
        this.router.get('/health', 
            this.rateLimiterMiddleware.forPath('/api/health', { max: 5, windowMs: 1 * 60 * 1000 }),
            (_req, res) => res.json({ ok: true })
          );

        const tokenRoutes = new TokenOtpRoutes(this.dbConnection, this.rateLimiterMiddleware);
        this.router.use('/token-otp', tokenRoutes.build());
    }

    public register(app: Express): void {
        app.use('/api', this.router);
    }
}