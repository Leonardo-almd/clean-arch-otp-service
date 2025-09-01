import { DbConnection } from '../../../application/ports/db/db-connection.port';
import { createClient } from 'redis';
import { Logger } from '../../../utils/logger';

export class RedisDbConnection implements DbConnection {
  private client: any;
  private logger = new Logger('RedisDbConnection');

  constructor(host: string = 'localhost', port: number = 6379) {
    this.client = createClient({
      url: `redis://${host}:${port}`,
    });

    this.client.on('error', (err: any) => {
      this.logger.error(`Redis Client Error: ${err.message}`);
    });
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
      this.logger.info('Redis client connected');
    } catch (error: any) {
      this.logger.error(`Failed to connect to Redis: ${error.message}`);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    await this.client.disconnect();
    this.logger.info('Redis client disconnected');
  }

  getClient(): any {
    return this.client;
  }

  createDuplicate(): any {
    return this.client.duplicate();
  }
}