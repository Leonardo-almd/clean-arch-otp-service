import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger-config';
import { Logger } from '../../utils/logger';

export class SwaggerDocs {
  private logger = new Logger('SwaggerDocs');

  constructor() {
    require('./routes/token-otp.docs');
    require('./routes/health.docs');
  }

  public setup(app: Express): void {
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    
    app.get('/api/docs.json', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerSpec);
    });

    this.logger.info('Swagger documentation initialized at /api/docs');
  }
}