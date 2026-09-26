[🇧🇷 Português](#-clean-architecture-otp-service) | [🇦🇺 English](#-clean-architecture-otp-service-1)

---

# 🇧🇷 Clean Architecture OTP Service

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
│   ├── ports/             # Interfaces para a camada de aplicação
│   └── usecases/         # Implementação dos casos de uso
├── domain/               # Regras de negócio e entidades
│   ├── entities/         # Entidades do domínio
│   └── ports/             # Interfaces para a camada de domínio
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

---

[⬆️ Back to top / Voltar ao topo](#-clean-architecture-otp-service)

---

# 🇦🇺 Clean Architecture OTP Service

An OTP (One-Time Password) token service built following Clean Architecture principles. This service provides an API for generating and validating OTP tokens, with rate limiting, auditing, and a web interface for interaction.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture-1)
- [Technologies](#technologies-1)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Tests](#tests-1)
- [API Documentation](#api-documentation-1)
- [Project Structure](#project-structure)
- [Features](#features)
- [Security](#security-1)
- [License](#license)

## 🔍 Overview

The Clean Architecture OTP Service is an application that enables the generation and validation of OTP (One-Time Password) tokens for two-factor authentication or identity verification. The service is built following Clean Architecture principles, ensuring separation of concerns, testability, and maintainability.

### Key Features

- Generation of 6-digit OTP tokens
- OTP token validation
- Token auditing
- Rate limiting to prevent abuse
- Web interface for interacting with the service
- API documentation with Swagger

## 🏛️ Architecture

The project follows Clean Architecture principles, organizing the code into concentric layers:

1. **Entities (Domain)**: Contains the core business rules and domain entities.
2. **Use Cases (Application)**: Implements the application's specific use cases.
3. **Interface Adapters**: Converts data between the formats most convenient for the use cases and entities.
4. **Frameworks & Drivers (Infrastructure)**: Contains frameworks, tools, and drivers such as the database, web frameworks, etc.

### Architecture Diagram

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

## 🛠️ Technologies

- **Backend**:
  - **Node.js**: Runtime environment
  - **TypeScript**: Programming language
  - **Express**: Web framework
  - **Redis**: Data storage and session management
  - **Jest**: Testing framework
  - **Swagger**: API documentation

- **Frontend**:
  - **React**: Library for building interfaces
  - **Axios**: HTTP client for communicating with the API

- **DevOps**:
  - **Docker**: Containerization
  - **Trivy**: Vulnerability scanning
  - **AWS ECR/ECS**: Cloud container services (deployment-ready)

## 📋 Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- Redis (for local development)

## 🔧 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/seu-usuario/clean-arch-otp-service.git
   cd clean-arch-otp-service
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (optional):
   ```bash
   cp .env.example .env
   ```

## 🚀 Running the Project

### Local Development

To run the project in development mode:

```bash
npm run dev
```

### Docker (Recommended for Production)

To run the project with Docker:

```bash
docker compose up -d
```

This will start:
- 1 backend instance
- 1 Redis instance
- 1 React frontend instance

Access the application at:
- Frontend: http://localhost:3000
- API: http://localhost:3001/api

### Environment Variables

| Variable | Description | Default Value |
|----------|-------------|----------------|
| PORT | Application port | 3000 |
| REDIS_HOST | Redis host | localhost |
| REDIS_PORT | Redis port | 6379 |
| RATE_LIMIT_WINDOW | Rate-limiting time window (minutes) | 1 |
| RATE_LIMIT_MAX | Maximum number of requests per window | 5 |
| REACT_APP_API_URL | API URL for the frontend | http://localhost:3001 |

## 🧪 Tests

The project includes unit, integration, and end-to-end tests.

### Running All Tests

```bash
npm test
```

### Running Specific Tests

```bash
npm run test:unit       # Unit tests
npm run test:integration # Integration tests
npm run test:e2e        # End-to-end tests
```

### Test Coverage

```bash
npm run test:coverage
```

## 📖 API Documentation

The API documentation is available via Swagger UI:

- **Local**: http://localhost:3000/api/docs
- **Docker**: http://localhost:3001/api/docs

### Main Endpoints

#### Create OTP Token

```
POST /api/token-otp
```

Request Body:
```json
{
  "userId": "123456",
  "expirationMinutes": 3
}
```

Response:
```json
{
  "token": "123456",
  "expiresAt": "2023-05-25T10:30:00Z"
}
```

#### Validate OTP Token

```
POST /api/token-otp/validate
```

Request Body:
```json
{
  "userId": "123456",
  "token": "123456"
}
```

Response:
```json
{
  "isValid": true,
  "message": "Valid token."
}
```

#### Check API Health

```
GET /api/health
```

Response:
```json
{
  "ok": true
}
```

## 📁 Project Structure

```
src/
├── __tests__/            # Tests
│   ├── e2e/              # End-to-end tests
│   ├── integration/      # Integration tests
│   └── unit/             # Unit tests
├── application/          # Use cases and DTOs
│   ├── dtos/             # Data Transfer Objects
│   ├── ports/             # Interfaces for the application layer
│   └── usecases/         # Use case implementations
├── domain/               # Business rules and entities
│   ├── entities/         # Domain entities
│   └── ports/             # Interfaces for the domain layer
├── infrastructure/       # Concrete implementations
│   ├── database/         # Database connections
│   ├── repositories/     # Repository implementations
│   └── services/         # Infrastructure services
├── interfaces/           # Interface adapters
│   ├── docs/             # Swagger documentation
│   └── http/             # HTTP controllers, routes, and middlewares
└── utils/                # Utilities
frontend/             # React application
├── public/           # Static files
├── src/              # Frontend source code
│   ├── components/   # React components
│   └── services/     # Services for API communication
├── Dockerfile        # Docker configuration for the frontend
└── package.json      # Frontend dependencies
docker-compose.yml    # Docker Compose configuration
```

## 🌟 Features

- **Token Generation**: Creation of 6-digit OTP tokens
- **Token Validation**: Verification of token validity
- **Auditing**: Token history logging
- **Rate Limiting**: Protection against abuse
- **Web Interface**: User-friendly interface for interacting with the service
- **Swagger Documentation**: Interactive API documentation

## 🔒 Security

The project has been scanned with Trivy to identify potential vulnerabilities in the Docker images. This analysis helps ensure the images used are free of known vulnerabilities and follow security best practices.

To run a security scan with Trivy:

```bash
# Scan the backend image
trivy image clean-arch-opt-service-backend

# Scan the frontend image
trivy image clean-arch-opt-service-frontend
```

## 📄 License

This project is licensed under the ISC license — see the [LICENSE](LICENSE) file for details.

---

[⬆️ Back to top / Voltar ao topo](#-clean-architecture-otp-service)
