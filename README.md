# Enterprise Integration Dashboard (EID)

Painel web que consulta, por uma única API autenticada, dados de dois bancos corporativos distintos: **fornecedores e contratos no Oracle** e **usuários e auditoria no SQL Server**.

O projeto simula um cenário comum em empresas, em que um sistema legado (Oracle) convive com um sistema mais novo (SQL Server), e demonstra a integração dos dois em uma aplicação ASP.NET Core com Clean Architecture, autenticação JWT e frontend React.

> Projeto pessoal de portfólio, desenvolvido para estudo e demonstração técnica.

---

## Funcionalidades

- **Login e cadastro** com JWT. Toda conta nova recebe o perfil `Viewer`, atribuído pelo servidor.
- **Visão geral** com indicadores calculados a partir da API: fornecedores ativos, contratos ativos, valor em contratos ativos, contratos que vencem em até 30 dias, próximos vencimentos e contratos por status.
- **Fornecedores** (Oracle) com busca por empresa, CNPJ ou e-mail.
- **Contratos** (Oracle) com filtro por fornecedor, que usa o endpoint dedicado da API, e filtro por status.
- **Sessão**: o painel encerra a sessão quando o JWT expira ou quando a API responde 401.
- **Mensagens de erro distintas** para validação (400), credenciais (401) e API indisponível.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 19 + Vite 8 (JavaScript), React Router 7, Axios |
| Backend | ASP.NET Core 10 (C#) |
| Validação | FluentValidation 12 |
| ORM | Entity Framework Core 10 (dois DbContexts) |
| Banco 1 | SQL Server 2022 (Docker) |
| Banco 2 | Oracle Database Free 23 (Docker) |
| Autenticação | JWT Bearer (HMAC-SHA256) + BCrypt |
| Documentação da API | Swagger / OpenAPI |
| Infraestrutura | Docker Compose |
| Testes | xUnit, Moq, FluentAssertions |
| CI | GitHub Actions |

---

## Arquitetura

O backend é dividido em camadas com dependências apontando para dentro: `Api → Application → Domain`, e `Infrastructure` implementa as interfaces definidas em `Application`.

```text
Navegador (EID.Web)
   │  /api/...  (mesma origem)
   ▼
EID.Api ─────────── Controllers, validação, JWT, tratamento global de erros
   │
EID.Application ─── Serviços, DTOs, validadores, interfaces de repositório
   │
EID.Infrastructure ─ Repositórios EF Core, emissão de token
   ├── SqlServerContext → SQL Server (Users, AuditLogs)
   └── OracleContext    → Oracle (SUPPLIERS, CONTRACTS)
```

### Origem única

Frontend e API são servidos pela mesma origem, sem depender de CORS no fluxo normal:

- **Desenvolvimento:** o Vite (porta 3001) repassa as chamadas `/api` para a API (porta 5004).
- **Publicação:** `dotnet publish` gera o build do React e o inclui em `wwwroot`. A API serve telas e endpoints na mesma porta e devolve o `index.html` para as rotas do React.

### Estrutura do repositório

```text
EnterpriseIntegrationDashboard/
├── EID.Api/                 # Entrada da aplicação: Program.cs, Controllers, Middlewares
├── EID.Application/         # DTOs, Services, Validators, Interfaces
├── EID.Domain/              # Entidades (User, AuditLog, Supplier, Contract) e enums
├── EID.Infrastructure/      # DbContexts, Mappings, Migrations (SqlServer/Oracle), Repositories
├── EID.Tests/               # Testes unitários
├── EID.Web/                 # Frontend React (Vite)
│   └── src/
│       ├── components/      # AppShell, AccessLayout, PasswordField, SourceTag...
│       ├── contexts/        # Autenticação e sessão
│       ├── hooks/           # useApiData
│       ├── lib/             # Erros da API, JWT, formatação
│       ├── pages/           # Login, Register, Dashboard, Suppliers, Contracts
│       ├── services/        # Cliente HTTP e chamadas à API
│       └── styles/          # global.css (tokens de design)
├── scripts/dev/             # seed-oracle.sql (dados fictícios para desenvolvimento)
├── .github/workflows/       # CI (build e testes .NET, audit/lint/build do frontend)
├── docker-compose.yml
└── EnterpriseIntegrationDashboard.sln
```

---

## Modelo de dados

### SQL Server

**Users**: `Id` (GUID, PK), `Name` nvarchar(150), `Email` nvarchar(200) único, `PasswordHash` (BCrypt), `Role` nvarchar(50), `IsActive`, `CreatedAt`, `LastLoginAt` (opcional).

**AuditLogs**: `Id` (GUID, PK), `UserId` (FK → Users, exclusão em cascata), `Action`, `Resource`, `Details` (opcional), `IpAddress`, `CreatedAt`.

> A tabela e o repositório de auditoria existem, mas nenhum fluxo grava registros ainda. Veja [Melhorias futuras](#melhorias-futuras).

### Oracle

**SUPPLIERS**: `Id` (identity, PK), `CompanyName` NVARCHAR2(200), `TaxId` NVARCHAR2(20) único, `ContactEmail` NVARCHAR2(200), `ContactPhone` NVARCHAR2(20), `IsActive` NUMBER(1), `CreatedAt` TIMESTAMP.

**CONTRACTS**: `Id` (identity, PK), `SupplierId` (FK → SUPPLIERS), `Title` NVARCHAR2(300), `Value` NUMBER(18,2), `StartDate`, `EndDate`, `Status` (0 Rascunho, 1 Ativo, 2 Expirado, 3 Cancelado), `Description` NVARCHAR2(1000) opcional, `CreatedAt`.

---

## Como executar

### Pré-requisitos

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10)
- [Node.js](https://nodejs.org/) 20.19+ ou 22.12+ (exigência do Vite 8)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Ferramenta do EF Core: `dotnet tool install --global dotnet-ef`

### 1. Clone o repositório

```bash
git clone https://github.com/AnaC380/Enterprise-Integration-Dashboard.git
cd Enterprise-Integration-Dashboard
```

### 2. Senhas dos bancos (Docker)

Copie `.env.example` para `.env` e defina `SQLSERVER_PASSWORD` e `ORACLE_PASSWORD`. O `.env` não é versionado.

### 3. Segredos da API (user-secrets)

As connection strings e a chave JWT ficam fora do repositório, no *user-secrets* do .NET:

```bash
dotnet user-secrets set "ConnectionStrings:SqlServer" "Server=127.0.0.1,1434;Database=EID;User Id=sa;Password=<SQLSERVER_PASSWORD>;Encrypt=True;TrustServerCertificate=True" --project EID.Api
dotnet user-secrets set "ConnectionStrings:Oracle" "User Id=system;Password=<ORACLE_PASSWORD>;Data Source=127.0.0.1:1521/FREEPDB1" --project EID.Api
dotnet user-secrets set "Jwt:Key" "<chave aleatória com pelo menos 32 bytes>" --project EID.Api
```

Use `127.0.0.1` em vez de `localhost`: no Windows, `localhost` pode resolver primeiro para IPv6 (`::1`), e as portas do Docker estão publicadas apenas em IPv4. Como alternativa ao user-secrets, há o modelo `EID.Api/appsettings.Development.json.example`.

### 4. Bancos

```bash
docker compose up -d
docker compose ps        # aguarde os dois serviços como "healthy"
```

O SQL Server e o Oracle usam volumes nomeados, então os dados sobrevivem à recriação dos containers.

### 5. Migrations

```bash
dotnet ef database update --project EID.Infrastructure --startup-project EID.Api --context SqlServerContext
dotnet ef database update --project EID.Infrastructure --startup-project EID.Api --context OracleContext
```

### 6. Dados de exemplo (opcional)

Insere fornecedores e contratos **fictícios** no Oracle, apenas se a tabela estiver vazia. A conexão usa a autenticação do container, sem senha na linha de comando:

```powershell
Get-Content scripts/dev/seed-oracle.sql | docker exec -i eid-oracle sqlplus -s / as sysdba
```

### 7. Desenvolvimento (dois terminais)

```bash
# Terminal 1: API
dotnet run --project EID.Api

# Terminal 2: frontend
cd EID.Web
npm install
npm run dev
```

| Endereço | Uso |
|----------|-----|
| `http://localhost:3001` | Painel (entre por aqui) |
| `http://localhost:5004/swagger` | Documentação interativa da API |

Crie uma conta em **Criar conta**, ou pelo `POST /api/Auth/register` no Swagger.

### 8. Publicação (porta única)

```bash
dotnet publish EID.Api -c Release -o publish
cd publish
dotnet EID.Api.dll --urls http://localhost:5004
```

O sistema completo fica em `http://localhost:5004`. Para usar o user-secrets nesse teste local, defina `ASPNETCORE_ENVIRONMENT=Development` antes de iniciar; em um servidor real, os segredos vêm de variáveis de ambiente ou de um cofre de segredos.

---

## API

| Método | Endpoint | Autenticação | Finalidade |
|--------|----------|--------------|------------|
| POST | `/api/Auth/register` | Não | Cria conta (perfil sempre `Viewer`) e retorna JWT |
| POST | `/api/Auth/login` | Não | Autentica e retorna JWT |
| GET | `/api/Supplier` | JWT | Lista fornecedores (Oracle) |
| GET | `/api/Supplier/{id}` | JWT | Busca fornecedor por ID |
| GET | `/api/Contract` | JWT | Lista contratos com o nome do fornecedor |
| GET | `/api/Contract/supplier/{supplierId}` | JWT | Contratos de um fornecedor |

Respostas de erro:

| Código | Formato | Exemplo |
|--------|---------|---------|
| 400 (validação) | lista de mensagens | `["Senha deve ter no mínimo 8 caracteres."]` |
| 400 / 401 / 500 (regras e falhas) | `{ "error": "..." }` | `{ "error": "Email ou senha inválidos." }` |

Erros 500 retornam mensagem genérica, sem detalhes internos.

---

## Segurança

- Senhas com hash BCrypt; o perfil é sempre atribuído pelo servidor e o campo `role` não existe na requisição.
- JWT HMAC-SHA256 com expiração de 8 horas e claims `NameIdentifier`, `Email`, `Name` e `Role`.
- Validação de entrada com FluentValidation:
  - e-mail válido;
  - limites de tamanho;
  - senha de 8 a 100 caracteres, com maiúscula, número e caractere especial.
- Segredos fora do repositório: `.env`, user-secrets e `appsettings.Development.json` no `.gitignore`.
- `AllowedHosts` e CORS restritos a `localhost`.
- Portas dos bancos publicadas apenas em `127.0.0.1`.
- CI com permissões mínimas (`contents: read`) e `npm audit` bloqueando vulnerabilidades altas.

Limitações conhecidas estão listadas em [Melhorias futuras](#melhorias-futuras).

---

## Testes e CI

```bash
dotnet test
```

São 21 testes unitários em `EID.Tests`:

| Suíte | Cobertura |
|-------|-----------|
| `AuthServiceTests` | Registro (perfil Viewer, hash BCrypt, e-mail duplicado, token) e login (válido, senha errada, usuário inativo, inexistente) |
| `AuthControllerTests` | Respostas 201/200 e rejeição de entradas inválidas com 400, sem chamar o serviço |
| `AuthServiceSecurityTests` | Ausência do campo `role` no DTO de registro e perfil sempre `Viewer` |

O GitHub Actions executa a cada push na `main`:

- **`build-and-test`**: restore, build e testes do .NET.
- **`frontend`**: `npm ci`, `npm audit`, lint e build.

---

## Melhorias futuras

Itens identificados e ainda não implementados, por prioridade.

**Segurança**
- [ ] Mover o JWT do `localStorage` para cookie `HttpOnly` + `Secure` + `SameSite`, reduzindo o impacto de XSS.
- [ ] Limitar tentativas nos endpoints de login e cadastro (`AddRateLimiter` do ASP.NET Core).
- [ ] Recusar a inicialização da API sem connection strings ou com a chave JWT padrão/curta.
- [ ] Configurar `AllowedHosts` e CORS por variável de ambiente para produção.

**Funcionalidades**
- [ ] Gravar registros na tabela `AuditLogs` (login, cadastro, consultas), que já existe mas não é usada.
- [ ] Autorização por perfil (`[Authorize(Roles = ...)]`) e um perfil administrador.
- [ ] Endpoints de escrita para fornecedores e contratos, com validação.
- [ ] Paginação nas listagens.

**Banco de dados**
- [ ] Gerar migration de sincronização do `OracleContext`: o snapshot foi criado com EF Core 8 e o EF Core 10 aponta alterações pendentes.

**Qualidade e operação**
- [ ] Testes de integração da API (WebApplicationFactory) e testes do frontend.
- [ ] Health checks (`/health`) com verificação dos dois bancos.
- [ ] Logs estruturados e correlação de requisições.
- [ ] Lock files do NuGet (`packages.lock.json`) com restore em modo travado no CI.
- [ ] SpaProxy para iniciar API e frontend com um único comando em desenvolvimento.
- [ ] Dockerfile da aplicação para publicar API + frontend em container.

---

## Autora

**Ana Carolina Salles Ferreira**: [GitHub](https://github.com/AnaC380) · [LinkedIn](https://www.linkedin.com/in/ana-carolina-salles-b31a3421a)
