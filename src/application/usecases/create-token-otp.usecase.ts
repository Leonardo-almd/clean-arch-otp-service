import { TokenOtp } from '../../domain/entities/token-otp';
import { TokenHashingPort } from '../../domain/ports/token-hashing.port';
import { TokenOtpRepositoryPort } from '../../domain/ports/token-otp-repository.port';
import { TokenOtpResponseDto } from '../dtos/token-otp/token-otp-response.dto';
import { CreateTokenOtpUseCase } from '../ports/input/create-token-otp.port';

export class CreateTokenOtpUseCaseImpl implements CreateTokenOtpUseCase {
  constructor(
    private readonly tokenOtpRepository: TokenOtpRepositoryPort,
    private readonly tokenHashingService: TokenHashingPort
  ) {}

  async execute(userId: string, expirationMinutes?: number): Promise<TokenOtpResponseDto> {
    const tokenOtp = TokenOtp.create(this.tokenHashingService, userId, expirationMinutes);
    const tokenOtpResponse = await this.tokenOtpRepository.create(tokenOtp);
    return {
      token: tokenOtpResponse.getToken(),
      expiresAt: tokenOtpResponse.getExpiresAt()
    };
  }
}