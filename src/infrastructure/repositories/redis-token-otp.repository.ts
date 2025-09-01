import { TokenOtp } from '../../domain/entities/token-otp';
import { TokenOtpRepositoryPort } from '../../domain/ports/token-otp-repository.port';
import { DbConnection } from '../../application/ports/db/db-connection.port';
import { Logger } from '../../utils/logger';

export class RedisTokenOtpRepository implements TokenOtpRepositoryPort {
  private client: any;
  private readonly logger = new Logger('RedisTokenOtpRepository');
  
  constructor(private readonly dbConnection: DbConnection) {
    this.client = this.dbConnection.getClient();
  }

  async create(otp: TokenOtp): Promise<TokenOtp> {
    const key = `user:${otp.getUserId()}`;
    const ttlInSeconds = this.calculateTtlInSeconds(otp.getExpiresAt());
    
    await this.client.set(key, JSON.stringify({
      token: otp.getTokenHashed(),
      userId: otp.getUserId(),
      expiresAt: otp.getExpiresAt().toISOString(),
      isValid: true,
    }), { EX: ttlInSeconds });
    
    return otp;
  }

  async findByUserId(userId: string): Promise<TokenOtp | null> {
    try {
      const key = `user:${userId}`;
      const data = await this.client.get(key);
      
      if (!data) {
        return null;
      }
      
      const tokenData = JSON.parse(data);
      
      if (!tokenData.isValid) {
        return null;
      }
      
      return new TokenOtp({
        token: '',
        tokenHashed: tokenData.token,
        expiresAt: new Date(tokenData.expiresAt),
        isValid: tokenData.isValid,
        userId: tokenData.userId
      });
    } catch (error: any) {
      this.logger.error(`Erro ao buscar token para usuário ${userId}: ${error.message}`);
      return null;
    }
  }

  async delete(userId: string): Promise<void> {
    try {
      await this.client.del(`user:${userId}`);
    } catch (error: any) {
      this.logger.error(`Erro ao atualizar token para usuário ${userId}: ${error.message}`);
      throw error;
    }
  }

  private calculateTtlInSeconds(expiresAt: Date): number {
    const now = new Date();
    const diffMs = expiresAt.getTime() - now.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    
    return Math.max(1, diffSeconds);
  }
}