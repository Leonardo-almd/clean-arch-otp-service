import { DbConnection } from '../../application/ports/db/db-connection.port';
import { TokenAudit, TokenAuditProps } from '../../domain/entities/token-audit';
import { TokenAuditRepositoryPort } from '../../domain/ports/token-audit-repository.port';
import { Logger } from '../../utils/logger';

export class RedisTokenAuditRepository implements TokenAuditRepositoryPort {
  private client: any;
  private readonly logger = new Logger('RedisTokenAuditRepository');
  private readonly AUDIT_TTL = 60 * 60 * 24 * 90; // 90 dias
  
  constructor(private readonly dbConnection: DbConnection) {
    this.client = this.dbConnection.getClient();
  }

  async save(audit: TokenAudit): Promise<void> {
    try {
      const timestamp = Date.now();
      const auditId = `audit:${audit.getUserId()}:${timestamp}`;
      
      await this.client.set(auditId, JSON.stringify({
        userId: audit.getUserId(),
        tokenReference: audit.getTokenReference(),
        createdAt: audit.getCreatedAt()?.toISOString(),
        expiresAt: audit.getExpiresAt().toISOString(),
        status: audit.getStatus(),
        validatedAt: audit.getValidatedAt()?.toISOString(),
        metadata: audit.getMetadata()
      }), { EX: this.AUDIT_TTL });
      
      await this.client.zAdd(`user:${audit.getUserId()}:audits`, {
        score: timestamp,
        value: auditId
      });
      
      await this.client.expire(`user:${audit.getUserId()}:audits`, this.AUDIT_TTL);
      
      this.logger.info(`Token audit saved for user ${audit.getUserId()} with status ${audit.getStatus()}`);
    } catch (error: any) {
      this.logger.error(`Error saving token audit: ${error.message}`);
      throw error;
    }
  }
}