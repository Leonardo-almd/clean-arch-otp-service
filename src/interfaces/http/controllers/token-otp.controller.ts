import { CreateTokenOtpDto } from "../../../application/dtos/token-otp/create-token-otp.dto";
import { ValidateTokenOtpDto } from "../../../application/dtos/token-otp/validate-token-otp.dto";
import { DbConnection } from "../../../application/ports/db/db-connection.port";
import { CreateTokenOtpUseCaseImpl } from "../../../application/usecases/create-token-otp.usecase";
import { ValidateTokenOtpUseCaseImpl } from "../../../application/usecases/validate-token-otp.usecase";
import { TokenAuditRepositoryPort } from "../../../domain/ports/token-audit-repository.port";
import { TokenHashingPort } from "../../../domain/ports/token-hashing.port";
import { TokenOtpRepositoryPort } from "../../../domain/ports/token-otp-repository.port";
import { Logger } from "../../../utils/logger";
import { Request, Response } from 'express';

export class TokenOtpController {
    private readonly logger = new Logger('TokenOtpController');

    constructor(
        private readonly repository: TokenOtpRepositoryPort,
        private readonly tokenAuditRepository: TokenAuditRepositoryPort,
        private readonly tokenHashingService: TokenHashingPort
    ) {}

    public create = async (req: Request, res: Response): Promise<void> => {
        try {
          const useCase = new CreateTokenOtpUseCaseImpl(this.repository, this.tokenHashingService);
          const createOtpDto: CreateTokenOtpDto = req.validatedBody;
          const tokenOtp = await useCase.execute(createOtpDto.userId, createOtpDto.expirationMinutes);
          res.status(201).json(tokenOtp);
        } catch (error: any) {
          this.logger.error(`Error creating OTP token: ${error.message}`);
          res.status(500).json({ message: 'Internal server error' });
        }
      };

      public validate = async (req: Request, res: Response): Promise<void> => {
        try {
          const validateOtpDto: ValidateTokenOtpDto = req.validatedBody;
          const useCase = new ValidateTokenOtpUseCaseImpl(this.repository, this.tokenHashingService, this.tokenAuditRepository);
          const validationResult = await useCase.execute(validateOtpDto.token, validateOtpDto.userId);
          res.status(200).json(validationResult);
        } catch (error: any) {
          this.logger.error(`Error validating OTP token: ${error.message}`);
          res.status(500).json({ message: 'Internal server error' });
        }
      };
}