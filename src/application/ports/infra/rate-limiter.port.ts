export interface RateLimiterOptions {
  windowMs: number; // Janela de tempo em milissegundos
  max: number; // Número máximo de requisições por janela
  standardHeaders?: boolean; // Enviar cabeçalhos padrão de rate limit
  legacyHeaders?: boolean; // Enviar cabeçalhos legados de rate limit
  message?: string | object; // Mensagem de erro quando o limite é atingido
  keyGenerator?: (req: any) => string; // Função para gerar chave única por cliente
}

export interface RateLimiter {
  middleware(path: string, options?: Partial<RateLimiterOptions>): any;
}