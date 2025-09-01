import { CreateTokenOtpUseCaseImpl } from '../../../../application/usecases/create-token-otp.usecase';
import { TokenOtpRepositoryPort } from '../../../../domain/ports/token-otp-repository.port';
import { TokenHashingPort } from '../../../../domain/ports/token-hashing.port';
import { TokenOtp } from '../../../../domain/entities/token-otp';

const mockRepository: jest.Mocked<TokenOtpRepositoryPort> = {
  create: jest.fn(),
  findByUserId: jest.fn(),
  delete: jest.fn()
};

const mockHashingService: jest.Mocked<TokenHashingPort> = {
  hashToken: jest.fn().mockImplementation(token => `hashed_${token}`),
  verifyToken: jest.fn().mockImplementation((token, hashedToken) => hashedToken === `hashed_${token}`)
};

describe('CreateTokenOtpUseCase', () => {
  let useCase: CreateTokenOtpUseCaseImpl;
  
  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CreateTokenOtpUseCaseImpl(mockRepository, mockHashingService);
  });
  
  it('should create a new token successfully', async () => {
    // Arrange
    const userId = 'user123';
    const token = '123456';
    
    // Mock TokenOtp.create to return a predictable token
    jest.spyOn(TokenOtp, 'create').mockImplementation(() => {
      return new TokenOtp({
        token,
        tokenHashed: `hashed_${token}`,
        expiresAt: new Date(Date.now() + 60000),
        userId,
        isValid: true
      });
    });
    
    mockRepository.create.mockResolvedValue(new TokenOtp({
      token,
      tokenHashed: `hashed_${token}`,
      expiresAt: new Date(Date.now() + 60000),
      userId,
      isValid: true
    }));
    
    // Act
    const result = await useCase.execute(userId);
    
    // Assert
    expect(result).toBeDefined();
    expect(result.token).toBe(token);
    expect(mockRepository.create).toHaveBeenCalledTimes(1);
  });
  
  it('should handle errors gracefully', async () => {
    // Arrange
    mockRepository.create.mockRejectedValue(new Error('Database error'));
    
    // Act & Assert
    await expect(useCase.execute('user123')).rejects.toThrow('Database error');
  });
});