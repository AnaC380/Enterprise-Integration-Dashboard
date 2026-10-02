# Enterprise Integration Dashboard (EID)

Dashboard corporativo para integração e visualização de dados entre **Oracle** e **SQL Server** em tempo real, com autenticação JWT, arquitetura limpa e infraestrutura containerizada.

---

## Visão Geral

O EID simula um cenário corporativo real onde uma empresa possui dois sistemas legados em bancos distintos:

- **Oracle DB** — dados financeiros e contratuais (fornecedores e contratos)
- **SQL Server** — dados operacionais e de segurança (usuários e auditoria)

O dashboard integra essas duas fontes de dados em uma única interface React, demonstrando domínio de integração de sistemas, arquitetura de software e boas práticas de desenvolvimento.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 19 + Vite 8 (JavaScript) |
| Backend | ASP.NET Core 10 (C#) |
| ORM | Entity Framework Core 10 |
| Banco 1 | SQL Server 2022 (Docker) |
| Banco 2 | Oracle Free 23 (Docker) |
| Auth | JWT Bearer + BCrypt 4.2 |
| Documentação | Swagger / OpenAPI 3 |
| Infra | Docker Compose |
| Testes | xUnit + Moq + FluentAssertions |

---

## Arquitetura

O projeto segue **Clean Architecture** com separação estrita de responsabilidades.


    EnterpriseIntegrationDashboard/
    |-- EID.Api/                          # Camada de apresentacao
    |   |-- Controllers/
    |   |   |-- AuthController.cs
    |   |   |-- SupplierController.cs
    |   |   `-- ContractController.cs
    |   |-- Middlewares/
    |   |   `-- ExceptionMiddleware.cs
    |   `-- Program.cs
    |
    |-- EID.Application/                  # Regras de aplicacao
    |   |-- DTOs/
    |   |-- Interfaces/
    |   |-- Services/
    |   |   `-- AuthService.cs
    |   `-- Validators/
    |
    |-- EID.Domain/                       # Entidades de negocio
    |   |-- Entities/
    |   |   |-- User.cs          (SQL Server)
    |   |   |-- AuditLog.cs      (SQL Server)
    |   |   |-- Supplier.cs      (Oracle)
    |   |   `-- Contract.cs      (Oracle)
    |   `-- Enums/
    |       `-- ContractStatus.cs
    |
    |-- EID.Infrastructure/               # Persistencia
    |   `-- Persistence/
    |       |-- Contexts/
    |       |   |-- SqlServerContext.cs
    |       |   `-- OracleContext.cs
    |       |-- Migrations/
    |       |   |-- SqlServer/
    |       |   `-- Oracle/
    |       `-- Repositories/
    |
    |-- EID.Tests/                        # Testes unitarios (12 testes)
    |
    |-- EID.Web/                          # React App (Vite)
    |   `-- src/
    |       |-- components/
    |       |   |-- Navbar.jsx
    |       |   `-- PrivateRoute.jsx
    |       |-- contexts/
    |       |   |-- AuthContext.js
    |       |   |-- AuthContextDefinition.js
    |       |   |-- AuthProvider.jsx
    |       |   `-- useAuth.js
    |       |-- pages/
    |       |   |-- Login/
    |       |   |-- Dashboard/
    |       |   |-- Suppliers/
    |       |   `-- Contracts/
    |       `-- services/
    |           |-- api.js
    |           |-- authService.js
    |           |-- supplierService.js
    |           `-- contractService.js
    |
    |-- docker-compose.yml
    |-- .env.example
    `-- EnterpriseIntegrationDashboard.sln


---

## Modelo de Dados

### SQL Server — Dados Operacionais

**Users**

| Coluna | Tipo | Observação |
|--------|------|-----------|
| Id | GUID (PK) | |
| Name | nvarchar(150) | |
| Email | nvarchar(200) | unique |
| PasswordHash | nvarchar | BCrypt hash |
| Role | nvarchar(50) | Sempre "Viewer" — atribuído pelo servidor |
| IsActive | bit | |
| CreatedAt | datetime2 | |
| LastLoginAt | datetime2 | nullable |

**AuditLogs**

| Coluna | Tipo | Observação |
|--------|------|-----------|
| Id | GUID (PK) | |
| UserId | GUID (FK) | → Users, cascade delete |
| Action | nvarchar(100) | |
| Resource | nvarchar(100) | |
| Details | nvarchar(1000) | nullable |
| IpAddress | nvarchar(50) | |
| CreatedAt | datetime2 | |

### Oracle — Dados Corporativos

**SUPPLIERS**

| Coluna | Tipo | Observação |
|--------|------|-----------|
| Id | NUMBER (PK) | identity |
| CompanyName | VARCHAR2(200) | |
| TaxId | VARCHAR2(20) | unique |
| ContactEmail | VARCHAR2(200) | |
| ContactPhone | VARCHAR2(20) | |
| IsActive | NUMBER(1) | |
| CreatedAt | TIMESTAMP | |

**CONTRACTS**

| Coluna | Tipo | Observação |
|--------|------|-----------|
| Id | NUMBER (PK) | identity |
| SupplierId | NUMBER (FK) | → SUPPLIERS |
| Title | VARCHAR2(300) | |
| Value | NUMBER(18,2) | |
| StartDate | TIMESTAMP | |
| EndDate | TIMESTAMP | |
| Status | NUMBER | 0=Draft, 1=Active, 2=Expired, 3=Cancelled |
| Description | VARCHAR2(1000) | nullable |
| CreatedAt | TIMESTAMP | |

---

## Segurança

- Senhas armazenadas com hash BCrypt (nunca em texto plano)
- Autenticação stateless via JWT com expiração de 8 horas
- **Role sempre atribuída pelo servidor** como "Viewer" — o cliente não controla permissões
- Claims: `NameIdentifier`, `Email`, `Name`, `Role`
- CORS restrito ao frontend (`http://localhost:3001`)
- Secrets nunca versionados — `.env` e `appsettings.Development.json` no `.gitignore`
- Tratamento global de exceções sem exposição de stack trace
- Variáveis sensíveis via Docker environment variables

---

## Pré-requisitos

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10)
- [Node.js 18+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [dotnet-ef tool](https://learn.microsoft.com/pt-br/ef/core/cli/dotnet)

```bash
dotnet tool install --global dotnet-ef
```

---

## Como Rodar

### 1. Clone o repositório

```bash
git clone https://github.com/AnaC380/Enterprise-Integration-Dashboard.git
cd "Enterprise Integration Dashboard (EID)"
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` com suas senhas:

```env
SQLSERVER_PASSWORD=sua_senha_aqui
ORACLE_PASSWORD=sua_senha_aqui
```

### 3. Configure os secrets locais da API

Crie o arquivo `EID.Api/appsettings.Development.json` (não versionado):

```json
{
  "ConnectionStrings": {
    "SqlServer": "Server=localhost,1434;Database=EID_DB;User Id=sa;Password=SUA_SENHA;TrustServerCertificate=True",
    "Oracle": "User Id=system;Password=SUA_SENHA;Data Source=localhost:1521/FREEPDB1"
  },
  "Jwt": {
    "Key": "SUA_CHAVE_SECRETA_MINIMO_32_CARACTERES"
  }
}
```

### 4. Suba os containers

```bash
docker-compose up -d
```

Aguarde os containers iniciarem (o Oracle pode levar 2-3 minutos na primeira execução):

```bash
docker ps
```

### 5. Aplique as migrations

```bash
dotnet ef database update --project EID.Infrastructure --startup-project EID.Api --context SqlServerContext

dotnet ef database update --project EID.Infrastructure --startup-project EID.Api --context OracleContext
```

### 6. Rode o backend

```bash
dotnet run --project EID.Api --launch-profile http
```

- API: `http://localhost:5004`
- Swagger: `http://localhost:5004/swagger`

### 7. Rode o frontend

```bash
cd EID.Web
npm install
npm start
```

- Frontend: `http://localhost:3001`

---

## Endpoints da API

### Auth

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/Auth/register` | Registra novo usuário | Não |
| POST | `/api/Auth/login` | Autentica e retorna JWT | Não |

Exemplo de body para registro (o campo `role` não existe — o servidor sempre atribui "Viewer"):

```json
{
  "name": "Ana Carolina",
  "email": "ana@exemplo.com",
  "password": "Senha@123"
}
```

### Suppliers (Oracle)

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/Supplier` | Lista todos os fornecedores | JWT |
| GET | `/api/Supplier/{id}` | Busca fornecedor por ID | JWT |

### Contracts (Oracle)

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/Contract` | Lista todos os contratos | JWT |
| GET | `/api/Contract/supplier/{supplierId}` | Contratos por fornecedor | JWT |

---

## Testes

O projeto possui 12 testes unitários cobrindo:

| Suite | Cenários |
|-------|---------|
| `AuthServiceTests` | Registro (role=Viewer, hash BCrypt, email duplicado, geração de token), Login (credenciais válidas, senha errada, usuário inativo, não encontrado) |
| `AuthControllerTests` | Respostas HTTP 201 (registro) e 200 (login) |
| `AuthServiceSecurityTests` | Segurança do fluxo de autenticação |

```bash
dotnet test
```

---

## Boas Práticas

**Arquitetura**
- Clean Architecture com separação estrita de responsabilidades
- DDD — entidades sem dependência de infraestrutura
- Repository Pattern com interfaces no Application e implementações no Infrastructure
- Injeção de dependência em todas as camadas

**Qualidade**
- Middleware global de tratamento de exceções
- Validação de entrada com FluentValidation
- Documentação automática via Swagger/OpenAPI

**Segurança**
- JWT com roles atribuídas pelo servidor
- BCrypt para hash de senhas
- Secrets fora do repositório
- CORS configurado por ambiente

**Processo**
- Commits semânticos (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`)
- `.gitignore` sem binários, secrets ou node_modules
- `.gitattributes` com regras LF/CRLF por extensão
- Ambiente reproduzível com Docker Compose

---

## Diferencial Técnico

Este projeto demonstra integração **Oracle + SQL Server side-by-side** em uma única aplicação ASP.NET Core 10, com dois DbContexts independentes, migrations separadas e repositórios distintos — simulando um cenário corporativo real onde sistemas legados (Oracle) coexistem com sistemas modernos (SQL Server).

---

## Autora

**Ana Carolina**
[GitHub](https://github.com/AnaC380)
