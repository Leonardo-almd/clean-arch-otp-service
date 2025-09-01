export interface TokenHashingPort {
    hashToken(token: string): string;
    verifyToken(token: string, hash: string): boolean;
  }