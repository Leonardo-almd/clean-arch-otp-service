export interface DbConnection {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    getClient(): any;
    createDuplicate?(): any;
  }