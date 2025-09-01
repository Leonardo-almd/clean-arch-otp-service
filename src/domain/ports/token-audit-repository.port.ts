import { TokenAudit } from '../entities/token-audit';

export interface TokenAuditRepositoryPort {
  save(audit: TokenAudit): Promise<void>;
}