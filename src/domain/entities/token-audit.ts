export interface TokenAuditProps {
    id?: string;
    userId: string;
    tokenReference: string;
    createdAt?: Date;
    expiresAt: Date;
    status: 'VALIDATED' | 'EXPIRED' | 'INVALID';
    validatedAt?: Date;
    metadata?: Record<string, any>;
  }
  
  export class TokenAudit {
    private readonly id?: string;
    private readonly userId: string;
    private readonly tokenReference: string;
    private readonly createdAt?: Date;
    private readonly expiresAt: Date;
    private readonly status: 'VALIDATED' | 'EXPIRED' | 'INVALID';
    private readonly validatedAt?: Date;
    private readonly metadata?: Record<string, any>;
  
    constructor(props: TokenAuditProps) {
      this.id = props.id;
      this.userId = props.userId;
      this.tokenReference = props.tokenReference;
      this.createdAt = props.createdAt;
      this.expiresAt = props.expiresAt;
      this.status = props.status;
      this.validatedAt = props.validatedAt;
      this.metadata = props.metadata;
    }
  
    public getId(): string | undefined {
      return this.id;
    }
  
    public getUserId(): string {
      return this.userId;
    }
  
    public getTokenReference(): string {
      return this.tokenReference;
    }
  
    public getCreatedAt(): Date | undefined {
      return this.createdAt;
    }
  
    public getExpiresAt(): Date {
      return this.expiresAt;
    }
  
    public getStatus(): 'VALIDATED' | 'EXPIRED' | 'INVALID' {
      return this.status;
    }
  
    public getValidatedAt(): Date | undefined {
      return this.validatedAt;
    }
  
    public getMetadata(): Record<string, any> | undefined {
      return this.metadata;
    }
  }