import { Router } from 'express';
import { TokenOtpController } from '../controllers/token-otp.controller';
import { DbConnection } from '../../../application/ports/db/db-connection.port';
import { RedisTokenOtpRepository } from '../../../infrastructure/repositories/redis-token-otp.repository';
import { CryptoHashingService } from '../../../infrastructure/services/crypto-hashing.service';
import { RateLimiterMiddleware } from '../middlewares/rate-limiter.middleware';
import { RedisTokenAuditRepository } from '../../../infrastructure/repositories/redis-token-audit.repository';
import { ValidationMiddleware } from '../middlewares/validation.middleware';
import { CreateTokenOtpRequestDto } from '../dtos/create-token-otp.dto';
import { ValidateTokenOtpRequestDto } from '../dtos/validate-token-otp.dto';

export class TokenOtpRoutes {
  constructor(
    private readonly dbConnection: DbConnection,
    private readonly rateLimiterMiddleware: RateLimiterMiddleware
  ) {}

  public build(): Router {
    const router = Router();
    
    const tokenOtpRepository = new RedisTokenOtpRepository(this.dbConnection);
    const tokenAuditRepository = new RedisTokenAuditRepository(this.dbConnection);
    const tokenHashingService = new CryptoHashingService();
    const controller = new TokenOtpController(tokenOtpRepository, tokenAuditRepository, tokenHashingService);

    const validationMiddleware = new ValidationMiddleware();

    router.post('/', 
      [this.rateLimiterMiddleware.forPath('/api/token-otp', { max: 5, windowMs: 1 * 60 * 1000 }), validationMiddleware.validate(CreateTokenOtpRequestDto)],
      controller.create
    );
    
    router.post('/validate', 
      [this.rateLimiterMiddleware.forPath('/api/token-otp/validate', { max: 5, windowMs: 1 * 60 * 1000 }), validationMiddleware.validate(ValidateTokenOtpRequestDto)], 
      controller.validate
    );

    return router;
  }
}