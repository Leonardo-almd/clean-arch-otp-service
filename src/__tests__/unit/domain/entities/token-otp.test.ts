import { TokenOtp } from '../../../../domain/entities/token-otp';
import { TokenHashingPort } from '../../../../domain/ports/token-hashing.port';

class MockTokenHashing implements TokenHashingPort {
  hashToken(token: string): string {
    return `hashed_${token}`;
  }
  
  verifyToken(token: string, hashedToken: string): boolean {
    return hashedToken === `hashed_${token}`;
  }
}

describe('TokenOtp Entity', () => {
  const mockHashing = new MockTokenHashing();
  
  it('should create a valid token', () => {
    const tokenOtp = TokenOtp.create(mockHashing, 'user123');
    
    expect(tokenOtp).toBeDefined();
    expect(tokenOtp.getUserId()).toBe('user123');
    expect(tokenOtp.isTokenValid()).toBe(true);
  });
  
  it('should validate a correct token', () => {
    // Arrange
    const token = '123456';
    const hashedToken = mockHashing.hashToken(token);
    const tokenOtp = new TokenOtp({
      token: '',
      tokenHashed: hashedToken,
      expiresAt: new Date(Date.now() + 60000), // 1 minute in the future
      userId: 'user123',
      isValid: true
    });
    
    // Act
    const result = tokenOtp.validateToken(mockHashing, token);
    
    // Assert
    expect(result.isValid).toBe(true);
  });
  
  it('should reject an invalid token', () => {
    // Arrange
    const tokenOtp = new TokenOtp({
      token: '',
      tokenHashed: 'hashed_123456',
      expiresAt: new Date(Date.now() + 60000),
      userId: 'user123',
      isValid: true
    });
    
    // Act
    const result = tokenOtp.validateToken(mockHashing, '654321'); // Wrong token
    
    // Assert
    expect(result.isValid).toBe(false);
  });
  
  it('should reject an expired token', () => {
    // Arrange
    const tokenOtp = new TokenOtp({
      token: '',
      tokenHashed: 'hashed_123456',
      expiresAt: new Date(Date.now() - 60000), // 1 minute in the past
      userId: 'user123',
      isValid: true
    });
    
    // Act
    const result = tokenOtp.validateToken(mockHashing, '123456');
    
    // Assert
    expect(result.isValid).toBe(false);
    expect(result.message).toContain('expirado');
  });
});