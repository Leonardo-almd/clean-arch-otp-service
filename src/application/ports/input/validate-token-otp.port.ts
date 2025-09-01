export interface TokenValidationResult {
    isValid: boolean;
    userId?: string;
    message: string;
  }
  
  export interface ValidateTokenOtpUseCase {
    execute(token: string, userId: string): Promise<TokenValidationResult>;
  }
  