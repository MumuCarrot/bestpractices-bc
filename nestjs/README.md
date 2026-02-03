# NestJS Best Practices Project

This project demonstrates modern best practices for building NestJS applications with a focus on security, maintainability, and scalability.

## Architecture Overview

The project follows a **modular architecture** pattern with clear separation of concerns using NestJS modules:

```
src/
├── core/              # Core business modules
│   ├── auth/         # Authentication module
│   ├── database/     # Database module with repositories
│   ├── health/       # Health check module
│   └── logger/       # Logging module
├── common/           # Shared utilities
│   └── utils/        # Utility functions
└── main.ts           # Application entry point
```

## Implemented Best Practices

### 1. **Modular Architecture**

- **Modules**: Feature-based modules (AuthModule, DatabaseModule, LoggerModule, HealthModule)
- **Controllers**: Handle HTTP requests/responses and route definitions
- **Services**: Contain business logic and orchestration
- **Repositories**: Abstract data access operations using Repository pattern
- **Providers**: Dependency injection for database clients and utilities

### 2. **Repository Pattern**

- Base repository (`base.repo.ts`) provides common CRUD operations
- Specific repositories extend base functionality
- Abstracts database implementation details
- Promotes code reusability and testability

**Example:**
```typescript
@Injectable()
export class UserRepository extends BaseRepository {
  constructor(@Inject(SUPABASE_CLIENT) supabase: SupabaseClient) {
    super(supabase, 'users');
  }

  async findByLogin(login: string) { /* custom logic */ }
}
```

### 3. **Configuration Management**

- **@nestjs/config** for centralized configuration
- Environment variables with sensible defaults
- Type-safe configuration using ConfigService
- Global configuration module

**Features:**
- Environment variable parsing with defaults
- Configuration validation
- Production/development mode detection
- Secure configuration access

### 4. **Dependency Injection**

- NestJS built-in dependency injection system
- Constructor-based injection
- Provider tokens for database clients
- Modular service registration

**Example:**
```typescript
@Injectable()
export class AuthService {
  constructor(
    private readonly passwordUtil: PasswordUtil,
    private readonly userRepository: UserRepository,
    private readonly jwtUtil: JwtUtil,
    private readonly logger: LoggerService,
  ) {}
}
```

### 5. **Security Best Practices**

#### Password Security
- **Argon2** password hashing (argon2id variant)
- Configurable memory, time, and parallelism costs via environment variables
- Protection against timing attacks
- Secure password verification

#### Authentication
- **JWT** tokens for stateless authentication
- Separate access and refresh tokens with different expiration times
- HTTP-only cookies for token storage
- Secure cookie options (httpOnly, secure, sameSite)
- Token refresh mechanism

#### Security Features
- Passwords never exposed in responses
- Token expiration handling
- Secure cookie configuration based on environment
- Error messages don't leak sensitive information

### 6. **Error Handling**

- Consistent error response format
- Proper HTTP status codes using HttpException
- Detailed error messages for debugging
- Graceful error handling in async operations
- Service-level error handling with logging

**Response Format:**
```typescript
{
  success: boolean,
  data?: any,
  error?: Error,
  accessToken?: string,
  refreshToken?: string
}
```

### 7. **Code Documentation**

- **JSDoc** comments for all functions, methods, and classes
- TypeScript type annotations for better IDE support
- Parameter and return value documentation
- Usage examples where appropriate
- Comprehensive method descriptions

### 8. **Logging**

- **Winston** logger integration
- Structured logging with metadata
- Multiple log levels (error, warn, info, debug)
- File-based logging (error.log, combined.log)
- HTTP request/response logging interceptor
- Environment-aware log levels

**Features:**
- Console output in development
- JSON file logging for production
- Exception and rejection handlers
- Request/response time tracking

### 9. **Database Abstraction**

- Supabase client abstraction via providers
- Consistent query patterns through repositories
- Error handling at repository level
- Easy to swap database implementations
- Type-safe database operations

### 10. **TypeScript Best Practices**

- Strict TypeScript configuration
- Type-safe code throughout
- Interface definitions for contracts
- Generic types for reusability
- Modern ES6+ features

## Project Structure

```
nestjs/
├── src/
│   ├── core/                        # Core business modules
│   │   ├── auth/                    # Authentication module
│   │   │   ├── auth.controller.ts  # Auth endpoints
│   │   │   ├── auth.module.ts      # Auth module definition
│   │   │   └── auth.service.ts     # Auth business logic
│   │   ├── database/                # Database module
│   │   │   ├── database.module.ts   # Database module definition
│   │   │   ├── supabase.provider.ts # Supabase client provider
│   │   │   └── repos/              # Repository layer
│   │   │       ├── base.repo.ts    # Base repository
│   │   │       └── user.repo.ts    # User repository
│   │   ├── health/                  # Health check module
│   │   │   ├── health.controller.ts
│   │   │   ├── health.module.ts
│   │   │   └── health.service.ts
│   │   └── logger/                  # Logging module
│   │       ├── logger.module.ts
│   │       ├── logger.service.ts
│   │       └── logger.interceptor.ts
│   ├── common/                      # Shared utilities
│   │   └── utils/                   # Utility functions
│   │       ├── crypto.util.ts      # Cryptographic utilities
│   │       ├── jwt.util.ts         # JWT token utilities
│   │       └── password.util.ts    # Password hashing utilities
│   ├── app.module.ts                # Root application module
│   └── main.ts                      # Application entry point
├── .env.example                     # Environment variables template
├── package.json                     # Dependencies and scripts
├── tsconfig.json                    # TypeScript configuration
└── README.md                        # This file
```

## Key Dependencies

- **@nestjs/common**: Core NestJS framework
- **@nestjs/core**: NestJS core functionality
- **@nestjs/config**: Configuration management
- **@nestjs/platform-express**: Express platform adapter
- **@supabase/supabase-js**: Database client
- **argon2**: Password hashing
- **winston**: Logging library
- **cookie-parser**: Cookie parsing middleware
- **reflect-metadata**: Metadata reflection for decorators
- **rxjs**: Reactive programming library

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

3. Set required environment variables:
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_KEY` - Supabase service role key
- `SECRET_KEY` - Secret key for JWT token signing
- `ACCESS_TOKEN_EXPIRES_IN` - Access token expiration (default: 5m)
- `REFRESH_TOKEN_EXPIRES_IN` - Refresh token expiration (default: 1h)
- `ARGON2_MEMORY_COST` - Argon2 memory cost (default: 65536)
- `ARGON2_TIME_COST` - Argon2 time cost (default: 3)
- `ARGON2_PARALLELISM` - Argon2 parallelism (default: 1)
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (optional, defaults to 3000)

4. Build the project:
```bash
npm run build
```

5. Start the server:
```bash
# Development mode with watch
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
  - Body: `{ login: string, password: string }`
  - Returns: User data and sets HTTP-only cookies with tokens

- `POST /auth/login` - Authenticate user
  - Body: `{ login: string, password: string }`
  - Returns: User data (without password) and sets HTTP-only cookies with tokens

- `GET /auth/refresh-token` - Refresh authentication tokens
  - Uses refresh token from HTTP-only cookie
  - Returns: User data and sets new HTTP-only cookies with tokens

### Health Check
- `GET /health` - Server health status
- `GET /health/supabase` - Supabase database connection health check

## Development

### Code Formatting
```bash
npm run format
```

### Linting
```bash
npm run lint
```

### Testing
```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

## Best Practices Summary

✅ **Separation of Concerns** - Clear module boundaries  
✅ **DRY Principle** - Reusable components and utilities  
✅ **Security First** - Secure password hashing and token management  
✅ **Type Safety** - Full TypeScript support with strict types  
✅ **Error Handling** - Consistent error responses  
✅ **Documentation** - Comprehensive JSDoc comments  
✅ **Configuration** - Centralized and environment-aware  
✅ **Dependency Injection** - Loose coupling and testability  
✅ **Logging** - Structured logging with Winston  
✅ **Repository Pattern** - Abstracted data access layer  
✅ **Modular Design** - Feature-based modules  
✅ **Maintainability** - Clean code and clear patterns  

## Notes

- All documentation is in English
- Code follows NestJS conventions and best practices
- Environment-specific configurations are properly separated
- Security best practices are implemented throughout
- TypeScript strict mode is enabled
- JSDoc comments provide comprehensive method documentation
- Logging is configured for both development and production environments
