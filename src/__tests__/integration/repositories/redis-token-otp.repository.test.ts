import { RedisTokenOtpRepository } from '../../../infrastructure/repositories/redis-token-otp.repository';
import { TokenOtp } from '../../../domain/entities/token-otp';
import { CryptoHashingService } from '../../../infrastructure/services/crypto-hashing.service';

const mockDbConnection = {
  getClient: jest.fn().mockReturnValue({
    set: jest.fn().mockResolvedValue('OK'),
    get: jest.fn(),
    del: jest.fn().mockResolvedValue(1),
    flushAll: jest.fn().mockResolvedValue('OK')
  }),
  connect: jest.fn().mockResolvedValue(undefined),
  disconnect: jest.fn().mockResolvedValue(undefined)
};

describe('RedisTokenOtpRepository Integration', () => {
  let repository: RedisTokenOtpRepository;
  let hashingService: CryptoHashingService;
  const mockClient = mockDbConnection.getClient();
  
  beforeAll(() => {
    repository = new RedisTokenOtpRepository(mockDbConnection);
    hashingService = new CryptoHashingService();
  });
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should create and retrieve a token', async () => {
    // Arrange
    const userId = 'test-user-123';
    const token = TokenOtp.create(hashingService, userId);
    const mockTokenData = JSON.stringify({
      token: token.getTokenHashed(),
      userId,
      expiresAt: token.getExpiresAt().toISOString(),
      isValid: true
    });
    
    // Mock para simular o armazenamento e recuperação
    mockClient.set.mockResolvedValueOnce('OK');
    mockClient.get.mockResolvedValueOnce(mockTokenData);
    
    // Act
    await repository.create(token);
    const retrieved = await repository.findByUserId(userId);
    
    // Assert
    expect(mockClient.set).toHaveBeenCalled();
    expect(mockClient.get).toHaveBeenCalledWith(`user:${userId}`);
    expect(retrieved).not.toBeNull();
    expect(retrieved?.getUserId()).toBe(userId);
    expect(retrieved?.getTokenHashed()).toBe(token.getTokenHashed());
  });
  
  it('should delete a token', async () => {
    // Arrange
    const userId = 'test-user-123';
    
    // Act
    await repository.delete(userId);
    
    // Configurar o mock para retornar null após a exclusão
    mockClient.get.mockResolvedValueOnce(null);
    const retrieved = await repository.findByUserId(userId);
    
    // Assert
    expect(mockClient.del).toHaveBeenCalledWith(`user:${userId}`);
    expect(retrieved).toBeNull();
  });
  
  it('should handle token not found', async () => {
    // Arrange
    const userId = 'nonexistent-user';
    mockClient.get.mockResolvedValueOnce(null);
    
    // Act
    const retrieved = await repository.findByUserId(userId);
    
    // Assert
    expect(retrieved).toBeNull();
  });
  
  it('should handle invalid token data', async () => {
    // Arrange
    const userId = 'user-with-invalid-data';
    mockClient.get.mockResolvedValueOnce(JSON.stringify({ isValid: false }));
    
    // Act
    const retrieved = await repository.findByUserId(userId);
    
    // Assert
    expect(retrieved).toBeNull();
  });
});