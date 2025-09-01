import { TokenHashingPort } from '../../domain/ports/token-hashing.port';
import { TokenOtpRepositoryPort } from '../../domain/ports/token-otp-repository.port';
import { TokenAuditRepositoryPort } from '../../domain/ports/token-audit-repository.port';
import { TokenAudit } from '../../domain/entities/token-audit';
import { TokenOtpValidationResponseDto } from '../dtos/token-otp/token-otp-validation-response.dto';
import { ValidateTokenOtpUseCase } from '../ports/input/validate-token-otp.port';
import { Logger } from '../../utils/logger';

export class ValidateTokenOtpUseCaseImpl implements ValidateTokenOtpUseCase {
  private logger = new Logger('ValidateTokenOtpUseCase');

  constructor(
    private readonly tokenOtpRepository: TokenOtpRepositoryPort,
    private readonly tokenHashingService: TokenHashingPort,
    private readonly tokenAuditRepository: TokenAuditRepositoryPort
  ) {}

  async execute(token: string, userId: string): Promise<TokenOtpValidationResponseDto> {
    try {
      const tokenOtp = await this.tokenOtpRepository.findByUserId(userId);

      if (!tokenOtp) {
        return {
          isValid: false,
          message: 'Token não encontrado ou inválido.'
        };
      }
      
      const validationResult = tokenOtp.validateToken(this.tokenHashingService, token);
      
      if (validationResult.isValid) {
        if (this.tokenAuditRepository) {
          try {
            const audit = new TokenAudit({
              userId: tokenOtp.getUserId(),
              tokenReference: tokenOtp.getTokenHashed(),
              createdAt: new Date(),
              expiresAt: tokenOtp.getExpiresAt(),
              status: 'VALIDATED',
              validatedAt: new Date()
            });
            
            this.tokenAuditRepository.save(audit).catch(err => {
              this.logger.error(`Erro ao salvar auditoria de validação: ${err.message}`);
            });
          } catch (error: any) {
            this.logger.error(`Erro ao criar registro de auditoria: ${error.message}`);
          }
        }
        
        tokenOtp.invalidate();
        await this.tokenOtpRepository.delete(tokenOtp.getUserId());
      } else {
        try {
          const audit = new TokenAudit({
            userId: tokenOtp.getUserId(),
            tokenReference: tokenOtp.getTokenHashed(),
            createdAt: new Date(),
            expiresAt: tokenOtp.getExpiresAt(),
            status: 'INVALID',
          });
          this.tokenAuditRepository.save(audit).catch(err => {
            this.logger.error(`Erro ao salvar auditoria de validação: ${err.message}`);
          });
        } catch (error: any) {
          this.logger.error(`Erro ao criar registro de auditoria: ${error.message}`);
        }
      }
      
      return validationResult;
    } catch (error: any) {
      this.logger.error(`Erro ao validar token: ${error.message}`);
      return {
        isValid: false,
        message: 'Erro ao validar o token.'
      };
    }
  }
}