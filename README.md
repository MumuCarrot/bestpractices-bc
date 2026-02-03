# Backend Best Practices Collection

This repository is a collection of backend server implementations demonstrating modern best practices for building secure, maintainable, and scalable server-side applications. Each server implements similar functionality but uses different frameworks and approaches, allowing you to compare and learn from different architectural patterns.

## Overview

This project contains multiple backend implementations that share the same core functionality:

- **User Authentication** - Registration, login, and token refresh
- **Password Security** - Argon2 password hashing
- **JWT Tokens** - Access and refresh token management
- **Database Integration** - Supabase database operations
- **Repository Pattern** - Abstracted data access layer
- **Logging** - Structured logging with Winston
- **Health Checks** - Application and database health monitoring
- **Error Handling** - Consistent error response patterns
- **Configuration Management** - Environment-based configuration

## Comparison

Both implementations follow similar architectural patterns but differ in their approach:

| Aspect | Express | NestJS |
|--------|---------|--------|
| **Language** | JavaScript | TypeScript |
| **Architecture** | Layered (functional) | Modular (OOP) |
| **Dependency Injection** | Manual | Built-in |
| **Validation** | Zod schemas | Zod (can use class-validator) |
| **Type Safety** | Runtime (Zod) | Compile-time + Runtime |
| **Learning Curve** | Lower | Higher |
| **Framework Features** | Minimal, flexible | Rich, opinionated |
| **Code Style** | Functional | Object-oriented |

## Common Features

Both servers implement the same core features:

### 🔐 Authentication System
- User registration with password hashing
- User login with credential verification
- JWT token generation (access + refresh tokens)
- Token refresh mechanism
- HTTP-only cookie storage for tokens

### 🔒 Security
- Argon2id password hashing with configurable parameters
- Secure cookie configuration (httpOnly, secure, sameSite)
- Password never exposed in API responses
- Generic error messages to prevent information leakage

### 📊 Database
- Supabase integration
- Repository pattern for data access
- Base repository with common CRUD operations
- User-specific repository methods

### 📝 Logging
- Winston logger integration
- Multiple log levels (error, warn, info, debug)
- File-based logging (error.log, combined.log)
- Request/response logging
- Environment-aware log levels

### ⚙️ Configuration
- Environment variable management
- Sensible defaults for development
- Production-ready configuration
- Secure secret management

### 📚 Documentation
- Comprehensive JSDoc comments
- README files for each implementation
- Code examples and usage instructions

## API Endpoints

Both servers expose the same API endpoints:

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Authenticate user
- `GET /auth/refresh-token` - Refresh authentication tokens

### Health Check
- `GET /health` - Server health status
- `GET /health/supabase` - Database connection health check (NestJS only)

## Best Practices Demonstrated

This collection demonstrates:

✅ **Separation of Concerns** - Clear layer/module boundaries  
✅ **DRY Principle** - Reusable components and utilities  
✅ **Security First** - Secure password hashing and token management  
✅ **Type Safety** - Runtime validation (Express) and compile-time types (NestJS)  
✅ **Error Handling** - Consistent error responses  
✅ **Documentation** - Comprehensive code documentation  
✅ **Configuration** - Centralized and environment-aware  
✅ **Testability** - Modular structure for easy testing  
✅ **Maintainability** - Clean code and clear patterns  
✅ **Repository Pattern** - Abstracted data access layer  
✅ **Logging** - Structured logging with multiple transports  

## Purpose

This repository serves as:

1. **Learning Resource** - Compare different approaches to the same problem
2. **Best Practices Reference** - See how to implement common patterns correctly
3. **Architecture Comparison** - Understand trade-offs between frameworks
4. **Code Examples** - Real-world implementations you can reference
5. **Starting Point** - Use as a template for new projects

## Contributing

When adding new implementations or features:

- Maintain consistency in functionality across implementations
- Follow the same API contract
- Document changes in respective README files
- Keep security best practices consistent
- Update this global README if adding new servers

## Notes

- All documentation is in English
- Both servers implement the same business logic
- Code follows framework-specific conventions
- Environment-specific configurations are properly separated
- Security best practices are implemented throughout
- Each implementation can run independently

## License

This project is for educational and reference purposes.
