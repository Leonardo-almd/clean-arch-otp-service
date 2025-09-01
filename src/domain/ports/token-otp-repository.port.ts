import { TokenOtp } from '../entities/token-otp';

export interface TokenOtpRepositoryPort {
  create(tokenOtp: TokenOtp): Promise<TokenOtp>;
  findByUserId(userId: string): Promise<TokenOtp | null>;
  delete(userId: string): Promise<void>;
}