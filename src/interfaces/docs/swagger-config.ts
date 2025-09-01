import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Tokens OTP',
      version: '1.0.0',
      description: 'API para gerenciamento de tokens OTP (One-Time Password)',
    },
    servers: [
      {
        url: '/api',
        description: 'API Server',
      },
    ],
    components: {
      schemas: {
        CreateTokenOtpRequest: {
          type: 'object',
          required: ['userId'],
          properties: {
            userId: {
              type: 'string',
              description: 'ID do usuário (apenas números)',
              example: '123456',
              maxLength: 10,
              pattern: '^[0-9]+$',
            },
            expirationMinutes: {
              type: 'number',
              description: 'Tempo de expiração em minutos (entre 1 e 5)',
              example: 3,
              minimum: 1,
              maximum: 5,
            },
          },
        },
        TokenOtpResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              description: 'Token OTP gerado (6 dígitos)',
              example: '123456',
            },
            expiresAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data e hora de expiração do token',
              example: '2023-05-25T10:30:00Z',
            },
          },
        },
        ValidateTokenOtpRequest: {
          type: 'object',
          required: ['userId', 'token'],
          properties: {
            userId: {
              type: 'string',
              description: 'ID do usuário (apenas números)',
              example: '123456',
              maxLength: 10,
              pattern: '^[0-9]+$',
            },
            token: {
              type: 'string',
              description: 'Token OTP a ser validado (6 dígitos)',
              example: '123456',
              pattern: '^\\d{6}$',
            },
          },
        },
        TokenOtpValidationResponse: {
          type: 'object',
          properties: {
            isValid: {
              type: 'boolean',
              description: 'Indica se o token é válido',
              example: true,
            },
            message: {
              type: 'string',
              description: 'Mensagem de resultado da validação',
              example: 'Token válido',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Mensagem de erro',
            },
            statusCode: {
              type: 'number',
              description: 'Código de status HTTP',
            },
          },
        },
      },
      responses: {
        BadRequest: {
          description: 'Requisição inválida',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        TooManyRequests: {
          description: 'Muitas requisições',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'Too many requests, please try again later.',
                  },
                },
              },
            },
          },
        },
        InternalServerError: {
          description: 'Erro interno do servidor',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Token OTP',
        description: 'Operações relacionadas a tokens OTP',
      },
      {
        name: 'Health',
        description: 'Verificação de saúde da API',
      },
    ],
  },
  apis: ['./src/interfaces/docs/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);