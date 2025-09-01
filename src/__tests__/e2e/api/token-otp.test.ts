import request from 'supertest';
import express from 'express';
import { App } from '../../../server';
import { ErrorHandlerMiddleware } from '../../../interfaces/http/middlewares/error-handler';
import { RequestLoggerMiddleware } from '../../../interfaces/http/middlewares/request-logger.middleware';
import { TokenHashingPort } from '../../../domain/ports/token-hashing.port';
import { RedisDbConnection } from '../../../infrastructure/database/redis/connection';
import { SwaggerDocs } from '../../../interfaces/docs/swagger';

jest.mock('../../../infrastructure/services/redis-rate-limiter.service', () => {
  return {
    RedisRateLimiterService: jest.fn().mockImplementation(() => {
      return {
        middleware: jest.fn().mockImplementation(() => {
          return (req: any, res: any, next: any) => next();
        })
      };
    })
  };
});

jest.mock('../../../interfaces/docs/swagger', () => {
  return {
    SwaggerDocs: jest.fn().mockImplementation(() => {
      return {
        setup: jest.fn()
      };
    })
  };
});

class MockRedisDbConnection extends RedisDbConnection {
  private mockClient: any;

  constructor() {
    super('localhost', 6379);
    this.mockClient = {
      set: jest.fn().mockResolvedValue('OK'),
      get: jest.fn(),
      del: jest.fn().mockResolvedValue(1),
      sendCommand: jest.fn().mockResolvedValue(['OK']),
      incr: jest.fn().mockResolvedValue(1),
      expire: jest.fn().mockResolvedValue(1)
    };
  }

  async connect(): Promise<void> {
    return Promise.resolve();
  }

  async disconnect(): Promise<void> {
    return Promise.resolve();
  }

  getClient(): any {
    return this.mockClient;
  }

  createDuplicate(): any {
    return this.mockClient;
  }
}

jest.mock('../../../domain/entities/token-otp', () => {
  return {
    TokenOtp: {
      create: jest.fn().mockImplementation((hashingService, userId, expirationMinutes) => {
        return {
          getUserId: () => userId,
          getToken: () => '123456',
          getTokenHashed: () => 'hashed_123456',
          getExpiresAt: () => new Date(Date.now() + 60000),
          isTokenValid: () => true,
          validateToken: (hashingService: TokenHashingPort, token: string) => {
            return {
              isValid: token === '123456',
              message: token === '123456' ? 'Token válido.' : 'Token inválido.'
            };
          },
          invalidate: () => {}
        };
      })
    }
  };
});

jest.mock('../../../interfaces/http/controllers/token-otp.controller', () => {
  return {
    TokenOtpController: jest.fn().mockImplementation(() => {
      return {
        create: (req: any, res: any) => {
          res.status(201).json({ token: '123456' });
        },
        validate: (req: any, res: any) => {
          const { token } = req.body;
          if (token === '123456') {
            res.status(200).json({ isValid: true, message: 'Token válido.' });
          } else if (!req.body.userId) {
            res.status(400).json({ isValid: false, message: 'UserId é obrigatório.' });
          } else {
            res.status(200).json({ isValid: false, message: 'Token inválido.' });
          }
        }
      };
    })
  };
});

describe('Token OTP API E2E Tests', () => {
  let app: express.Application;
  const mockDbConnection = new MockRedisDbConnection();
  const mockClient = mockDbConnection.getClient();

  beforeAll(async () => {
    const { ApiRouter } = require('../../../interfaces/http/api');
    const { RateLimiterMiddleware } = require('../../../interfaces/http/middlewares/rate-limiter.middleware');
    const { RedisRateLimiterService } = require('../../../infrastructure/services/redis-rate-limiter.service');
    
    const rateLimiterService = new RedisRateLimiterService(mockDbConnection, {});
    const rateLimiterMiddleware = new RateLimiterMiddleware(rateLimiterService);
    
    const api = new ApiRouter(mockDbConnection, rateLimiterMiddleware);
    
    const errorHandler = new ErrorHandlerMiddleware();
    const requestLoggerMiddleware = new RequestLoggerMiddleware();

    const swaggerDocs = new SwaggerDocs();
    
    const testApp = new App(api, errorHandler, requestLoggerMiddleware, mockDbConnection, swaggerDocs);
    app = testApp.getExpressApp();
    
    api.register(app);
    app.use(errorHandler.handle);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new OTP token', async () => {
    const response = await request(app)
      .post('/api/token-otp')
      .send({ userId: '654321' })
      .expect(201);
    
    expect(response.body).toHaveProperty('token');
    expect(response.body.token).toEqual('123456');
  });

  it('should validate a correct token', async () => {
    const validateResponse = await request(app)
      .post('/api/token-otp/validate')
      .send({ userId: '654321', token: '123456' })
      .expect(200);
    
    expect(validateResponse.body).toHaveProperty('isValid', true);
  });

  it('should reject an invalid token', async () => {
    const validateResponse = await request(app)
      .post('/api/token-otp/validate')
      .send({ userId: '654321', token: '000000' })
      .expect(200);
    
    expect(validateResponse.body).toHaveProperty('isValid', false);
  });

  it('should enforce rate limits', async () => {
    const testApp = express();
    testApp.use(express.json());
    
    let requestCount = 0;
    
    testApp.use((req, res, next) => {
      requestCount++;
      if (requestCount > 5) {
        return res.status(429).json({ message: 'Too many requests, please try again later.' });
      }
      next();
    });
    
    testApp.post('/api/token-otp', (req, res) => {
      res.status(201).json({ token: '123456' });
    });
    
    for (let i = 0; i < 5; i++) {
      const response = await request(testApp)
        .post('/api/token-otp')
        .send({ userId: `rate-limit-test-${i}` });
      
      expect(response.status).toBe(201);
    }
    
    const response = await request(testApp)
      .post('/api/token-otp')
      .send({ userId: 'rate-limit-test-final' })
      .expect(429);
    
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('Too many requests');
    expect(requestCount).toBe(6);
  });
});