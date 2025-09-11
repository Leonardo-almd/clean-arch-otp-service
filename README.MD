# Clean Architecture OTP Service

Um serviço de tokens OTP (One-Time Password) construído seguindo os princípios de Clean Architecture. Este serviço fornece uma API para geração e validação de tokens OTP com recursos de limitação de taxa, auditoria e interface web para interação.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Executando o Projeto](#executando-o-projeto)
- [Testes](#testes)
- [API Documentation](#api-documentation)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Recursos](#recursos)
- [Segurança](#segurança)
- [Licença](#licença)

## 🔍 Visão Geral

O Clean Architecture OTP Service é uma aplicação que permite a geração e validação de tokens OTP (senhas de uso único) para autenticação de dois fatores ou verificação de identidade. O serviço é construído seguindo os princípios de Clean Architecture, garantindo separação de responsabilidades, testabilidade e manutenibilidade.

### Principais Funcionalidades

- Geração de tokens OTP de 6 dígitos
- Validação de tokens OTP
- Auditoria de tokens
- Limitação de taxa para evitar abusos
- Interface web para interação com o serviço
- Documentação da API com Swagger

## 🏛️ Arquitetura

O projeto segue os princípios da Clean Architecture, organizando o código em camadas concêntricas:

1. **Entidades (Domain)**: Contém as regras de negócio centrais e entidades do domínio.
2. **Use Cases (Application)**: Implementa casos de uso específicos da aplicação.
3. **Interface Adapters**: Converte dados entre os formatos mais convenientes para os casos de uso e entidades.
4. **Frameworks & Drivers (Infrastructure)**: Contém frameworks, ferramentas e drivers como banco de dados, web frameworks, etc.

### Diagrama de Arquitetura

```
┌───────────────────────────────────┐
│            Interfaces             │
│  (Controllers, Routes, Swagger)   │
├───────────────────────────────────┤
│            Application            │
│            (Use Cases)            │
├───────────────────────────────────┤
│              Domain               │
│         (Entities, Ports)         │
├───────────────────────────────────┤
│          Infrastructure           │
│ (Repositories, Services, Redis)   │
└───────────────────────────────────┘
```

## 🛠️ Tecnologias

- **Backend**:
  - **Node.js**: Ambiente de execução
  - **TypeScript**: Linguagem de programação
  - **Express**: Framework web
  - **Redis**: Armazenamento de dados e gerenciamento de sessão
  - **Jest**: Framework de testes
  - **Swagger**: Documentação da API

- **Frontend**:
  - **React**: Biblioteca para construção de interfaces
  - **Axios**: Cliente HTTP para comunicação com a API

- **DevOps**:
  - **Docker**: Containerização
  - **Trivy**: Análise de vulnerabilidades
  - **AWS ECR/ECS**: Serviços de container na nuvem (preparado para deploy)

## 📋 Pré-requisitos

- Node.js (v18 ou superior)
- Docker e Docker Compose
- Redis (para desenvolvimento local)

## 🔧 Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/clean-arch-otp-service.git
   cd clean-arch-otp-service
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente (opcional):
   ```bash
   cp .env.example .env
   ```

## 🚀 Executando o Projeto

### Desenvolvimento Local

Para executar o projeto em modo de desenvolvimento:

```bash
npm run dev
```

### Docker (Recomendado para Produção)

Para executar o projeto com Docker:

```bash
docker compose up -d
```

Isso iniciará:
- 1 instância do backend
- 1 instância do Redis
- 1 instância do frontend React

Acesse a aplicação em:
- Frontend: http://localhost:3000
- API: http://localhost:3001/api

### Variáveis de Ambiente

| Variável | Descrição | Valor Padrão |
|----------|-----------|--------------|
| PORT | Porta da aplicação | 3000 |
| REDIS_HOST | Host do Redis | localhost |
| REDIS_PORT | Porta do Redis | 6379 |
| RATE_LIMIT_WINDOW | Janela de tempo para limitação de taxa (minutos) | 1 |
| RATE_LIMIT_MAX | Número máximo de requisições por janela | 5 |
| REACT_APP_API_URL | URL da API para o frontend | http://localhost:3001 |

## 🧪 Testes

O projeto inclui testes unitários, de integração e end-to-end.

### Executando Todos os Testes

```bash
npm test
```

### Executando Testes Específicos

```bash
npm run test:unit       # Testes unitários
npm run test:integration # Testes de integração
npm run test:e2e        # Testes end-to-end
```

### Cobertura de Testes

```bash
npm run test:coverage
```

## 📖 API Documentation

A documentação da API está disponível via Swagger UI:

- **Local**: http://localhost:3000/api/docs
- **Docker**: http://localhost:3001/api/docs

### Endpoints Principais

#### Criar Token OTP

```
POST /api/token-otp
```

Corpo da Requisição:
```json
{
  "userId": "123456",
  "expirationMinutes": 3
}
```

Resposta:
```json
{
  "token": "123456",
  "expiresAt": "2023-05-25T10:30:00Z"
}
```

#### Validar Token OTP

```
POST /api/token-otp/validate
```

Corpo da Requisição:
```json
{
  "userId": "123456",
  "token": "123456"
}
```

Resposta:
```json
{
  "isValid": true,
  "message": "Token válido."
}
```

#### Verificar Saúde da API

```
GET /api/health
```

Resposta:
```json
{
  "ok": true
}
```

## 📁 Estrutura do Projeto

```
src/
├── __tests__/            # Testes
│   ├── e2e/              # Testes end-to-end
│   ├── integration/      # Testes de integração
│   └── unit/             # Testes unitários
├── application/          # Casos de uso e DTOs
│   ├── dtos/             # Data Transfer Objects
│   ├── ports/            # Interfaces para a camada de aplicação
│   └── usecases/         # Implementação dos casos de uso
├── domain/               # Regras de negócio e entidades
│   ├── entities/         # Entidades do domínio
│   └── ports/            # Interfaces para a camada de domínio
├── infrastructure/       # Implementações concretas
│   ├── database/         # Conexões com banco de dados
│   ├── repositories/     # Implementações de repositórios
│   └── services/         # Serviços de infraestrutura
├── interfaces/           # Adaptadores de interface
│   ├── docs/             # Documentação Swagger
│   └── http/             # Controladores, rotas e middlewares HTTP
└── utils/                # Utilitários
frontend/             # Aplicação React
├── public/           # Arquivos estáticos
├── src/              # Código fonte do frontend
│   ├── components/   # Componentes React
│   └── services/     # Serviços para comunicação com a API
├── Dockerfile        # Configuração Docker para o frontend
└── package.json      # Dependências do frontend
docker-compose.yml    # Configuração Docker Compose
```

## 🌟 Recursos

- **Geração de Tokens**: Criação de tokens OTP de 6 dígitos
- **Validação de Tokens**: Verificação da validade dos tokens
- **Auditoria**: Registro do histórico de tokens
- **Limitação de Taxa**: Proteção contra abusos
- **Interface Web**: Interface amigável para interação com o serviço
- **Documentação Swagger**: Documentação interativa da API

## 🔒 Segurança

O projeto foi analisado com a ferramenta Trivy para identificar possíveis vulnerabilidades nas imagens Docker. Esta análise ajuda a garantir que as imagens utilizadas estejam livres de vulnerabilidades conhecidas e seguindo as melhores práticas de segurança.

Para executar uma análise de segurança com Trivy:

```bash
# Analisar a imagem do backend
trivy image clean-arch-opt-service-backend

# Analisar a imagem do frontend
trivy image clean-arch-opt-service-frontend
```

## 📄 Licença

Este projeto está licenciado sob a licença ISC - veja o arquivo [LICENSE](LICENSE) para detalhes.