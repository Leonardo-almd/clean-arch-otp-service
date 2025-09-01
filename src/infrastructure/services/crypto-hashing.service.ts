import * as crypto from 'crypto';
import { TokenHashingPort } from '../../domain/ports/token-hashing.port';

export class CryptoHashingService implements TokenHashingPort {
  hashToken(token: string): string {
    const salt = process.env.TOKEN_HASH_SALT || 'default-salt-for-token-hashing';
    return crypto
      .createHmac('sha256', salt)
      .update(token)
      .digest('hex');
  }

  verifyToken(token: string, hash: string): boolean {
    const calculatedHash = this.hashToken(token);
    
    try {
      return crypto.timingSafeEqual(
        Buffer.from(calculatedHash, 'hex'),
        Buffer.from(hash, 'hex')
      );
    } catch (error) {
      return false;
    }
  }
}