import { Logger } from '../../utils/logger';
import { TokenAuditRepositoryPort } from '../../domain/ports/token-audit-repository.port';
import { TokenAudit } from '../../domain/entities/token-audit';
import { DbConnection } from '../../application/ports/db/db-connection.port';

export class RedisExpirationListener {
  private subscriber: any;
  private configClient: any;
  private logger = new Logger('RedisExpirationListener');
  private isRunning = false;

  constructor(
    private readonly dbConnection: DbConnection,
    private readonly tokenAuditRepository: TokenAuditRepositoryPort
  ) {
  }

  async start(): Promise<void> {
    if (this.isRunning) return;
    const isProduction = process.env.NODE_ENV === 'production' || 
                          process.env.REDIS_HOST !== 'localhost' && 
                          process.env.REDIS_HOST !== '127.0.0.1' &&
                          process.env.REDIS_HOST !== 'redis';

    if(!isProduction){
      try {
        this.subscriber = this.dbConnection.getClient().duplicate();
        
        this.subscriber.on('error', (err: Error) => {
          this.logger.error(`Redis subscriber error: ${err.message}`);
        });
  
        await this.subscriber.connect();
        
        this.configClient = this.dbConnection.getClient().duplicate();
        await this.configClient.connect();
        await this.configClient.configSet('notify-keyspace-events', 'Ex');
        await this.configClient.disconnect();
        
        this.logger.info('Redis configured for keyspace notifications');
  
        await this.subscriber.pSubscribe('__keyevent@0__:expired', async (message: string) => {
          if (message.startsWith('user:') && !message.includes(':audits')) {
            const userId = message.split(':')[1];
            this.logger.info(`Token expired event received for user ${userId}`);
            
            try {
              
              const audit = new TokenAudit({
                userId,
                tokenReference: `expired:${userId}:${Date.now()}`,
                expiresAt: new Date(),
                status: 'EXPIRED'
              });
              
              await this.tokenAuditRepository.save(audit);
              this.logger.info(`Audit record created for expired token of user ${userId}`);
            } catch (error: any) {
              this.logger.error(`Failed to create audit record for expired token: ${error.message}`);
            }
          }
        });
        
        this.isRunning = true;
        this.logger.info('Redis expiration listener started successfully');
      } catch (error: any) {
        this.logger.error(`Failed to start Redis expiration listener: ${error.message}`);
        await this.stop();
        throw error;
      }

    }
  }

  async stop(): Promise<void> {
    if (this.subscriber) {
      try {
        await this.subscriber.unsubscribe();
        await this.subscriber.disconnect();
        this.logger.info('Redis expiration listener stopped');
      } catch (error: any) {
        this.logger.error(`Error stopping Redis expiration listener: ${error.message}`);
      } finally {
        this.isRunning = false;
      }
    }
  }
}