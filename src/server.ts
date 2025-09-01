import express, { Express } from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { ApiRouter } from './interfaces/http/api';
import { ErrorHandlerMiddleware } from './interfaces/http/middlewares/error-handler';
import { RedisDbConnection } from './infrastructure/database/redis/connection';
import { Logger } from './utils/logger';
import { RateLimiterMiddleware } from './interfaces/http/middlewares/rate-limiter.middleware';
import { RedisRateLimiterService } from './infrastructure/services/redis-rate-limiter.service';
import { RequestLoggerMiddleware } from './interfaces/http/middlewares/request-logger.middleware';
import { RedisExpirationListener } from './infrastructure/services/redis-expiration-listener.service';
import { RedisTokenAuditRepository } from './infrastructure/repositories/redis-token-audit.repository';
import { SwaggerDocs } from './interfaces/docs/swagger';

export class App {
  private readonly app: Express;
  private readonly logger = new Logger('App');
  private expirationListener: RedisExpirationListener | null = null;

  constructor(
    private readonly api: ApiRouter,
    private readonly errorHandler: ErrorHandlerMiddleware,
    private readonly requestLoggerMiddleware: RequestLoggerMiddleware,
    private readonly dbConnection: RedisDbConnection,
    private readonly swaggerDocs: SwaggerDocs
  ) {
    this.app = express();

    this.app.use((req, res, next) => {
      req.headers['x-request-id'] = req.headers['x-request-id'] || uuidv4();
      next();
    });
    this.app.use(cors());
    this.app.use(express.json());

    this.app.use(this.requestLoggerMiddleware.handle);
  }

  public getExpressApp(): Express {
    return this.app;
  }

  public async start(port: number): Promise<void> {
    try {
      await this.setupAuditService();

      this.api.register(this.app);
      this.app.use(this.errorHandler.handle);

      this.swaggerDocs.setup(this.app);

      this.app.listen(port, () => {
        this.logger.info(`HTTP server running on http://localhost:${port}`);
      });
    } catch (error: any) {
      this.logger.error(`Failed to start server: ${error.message}`);
      process.exit(1);
    }
  }

  public async stop(): Promise<void> {
    await this.dbConnection.disconnect();
  }

  private async setupAuditService(): Promise<void> {
    try {
      const tokenAuditRepository = new RedisTokenAuditRepository(this.dbConnection);
      
      this.expirationListener = new RedisExpirationListener(
        this.dbConnection,
        tokenAuditRepository
      );
      
      await this.expirationListener.start();
      this.logger.info('Token audit service initialized successfully');
    } catch (error: any) {
      this.logger.error(`Failed to initialize audit service: ${error.message}`);
      throw error;
    }
  }
}

const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = Number(process.env.REDIS_PORT) || 6379;

const dbConnection = new RedisDbConnection(redisHost, redisPort);

dbConnection.connect();

const rateLimiter = new RedisRateLimiterService(dbConnection, {
  windowMs: (Number(process.env.RATE_LIMIT_WINDOW) || 1) * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX) || 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' }
})
const rateLimiterMiddleware = new RateLimiterMiddleware(rateLimiter);

const api = new ApiRouter(dbConnection, rateLimiterMiddleware);

const errorHandler = new ErrorHandlerMiddleware();
const requestLoggerMiddleware = new RequestLoggerMiddleware();
const swaggerDocs = new SwaggerDocs();

const app = new App(api, errorHandler, requestLoggerMiddleware, dbConnection, swaggerDocs);
const PORT = Number(process.env.PORT) || 3000;

app.start(PORT).catch((error) => {
  console.error(`Failed to start application: ${error.message}`);
  process.exit(1);
});

process.on('SIGINT', async () => {
  await app.stop();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await app.stop();
  process.exit(0);
});
