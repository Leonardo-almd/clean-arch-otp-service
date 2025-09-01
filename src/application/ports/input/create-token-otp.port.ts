import { TokenOtpResponseDto } from '../../dtos/token-otp/token-otp-response.dto';

export interface CreateTokenOtpUseCase {
  execute(userId: string, expirationMinutes?: number): Promise<TokenOtpResponseDto>;
}