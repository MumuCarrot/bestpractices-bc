# Express Best Practices Project

This project demonstrates modern best practices for building Express.js applications with a focus on security, maintainability, and scalability.

## Architecture Overview

The project follows a **layered architecture** pattern with clear separation of concerns:

```
app/
├── config/          # Configuration management
├── database/        # Database connection setup
├── middleware/      # Express middleware
├── repos/           # Data access layer (Repository pattern)
├── routers/         # Route definitions
├── schemas/         # Validation schemas (Zod)
└── services/        # Business logic layer
```

## Implemented Best Practices

### 1. **Layered Architecture**

- **Routers**: Handle HTTP requests/responses and route definitions
- **Services**: Contain business logic and orchestration
- **Repositories**: Abstract data access operations
- **Middleware**: Reusable request processing functions

### 2. **Repository Pattern**

- Base repository (`base.repo.js`) provides common CRUD operations
- Specific repositories extend base functionality
- Abstracts database implementation details
- Promotes code reusability and testability

**Example:**
```javascript
const baseRepository = createRepository('users');
export const usersRepository = {
  ...baseRepository,
  async findByLogin(login) { /* custom logic */ }
};
```

### 3. **Configuration Management**

- Centralized configuration in `config/` directory
- Environment variables with sensible defaults
- Type-safe configuration objects
- Separation of environment-specific settings

**Features:**
- Environment variable parsing with defaults
- Configuration validation
- Time string conversion utilities
- Production/development mode detection

### 4. **Input Validation**

- **Zod** schemas for type-safe validation
- Reusable validation middleware
- Detailed error messages for validation failures
- Schema composition for complex validations

**Example:**
```javascript
export const registerSchema = z.object({
  login: loginSchema,
  password: passwordSchema,
});
```

### 5. **Security Best Practices**

#### Password Security
- **Argon2** password hashing (argon2id variant)
- Configurable memory, time, and parallelism costs
- Protection against timing attacks

#### Authentication
- **JWT** tokens for stateless authentication
- Separate access and refresh tokens
- HTTP-only cookies for token storage
- Secure cookie options (httpOnly, secure, sameSite)

#### Security Features
- Passwords never exposed in responses
- Token expiration handling
- Secure cookie configuration based on environment

### 6. **Error Handling**

- Consistent error response format
- Proper HTTP status codes
- Detailed error messages for debugging
- Graceful error handling in async operations

**Response Format:**
```javascript
{
  success: boolean,
  data?: any,
  error?: string,
  details?: Array<{field: string, message: string}>
}
```

### 7. **Code Documentation**

- **JSDoc** comments for all functions and classes
- Type annotations for better IDE support
- Parameter and return value documentation
- Usage examples where appropriate

### 8. **Environment Configuration**

- `.env` file support via `dotenv`
- `.env.example` for documentation
- Type-safe environment variable parsing
- Default values for development

### 9. **Database Abstraction**

- Supabase client abstraction
- Consistent query patterns
- Error handling at repository level
- Easy to swap database implementations

### 10. **Modern JavaScript**

- ES6 modules (`import`/`export`)
- Async/await for asynchronous operations
- Arrow functions and modern syntax
- Destructuring for cleaner code

## Project Structure

```
express/
├── app/
│   ├── app.js                    # Application entry point
│   ├── config/                   # Configuration files
│   │   ├── app.config.js         # Application configuration
│   │   ├── argon2.config.js      # Argon2 hashing config
│   │   ├── env.js                # Environment variables
│   │   └── server.config.js      # Server configuration
│   ├── database/                 # Database setup
│   │   └── supabase.js           # Supabase client
│   ├── middleware/               # Express middleware
│   │   └── validation.middleware.js
│   ├── repos/                    # Data access layer
│   │   ├── base.repo.js          # Base repository
│   │   └── user.repo.js          # User repository
│   ├── routers/                  # Route handlers
│   │   ├── auth.router.js        # Authentication routes
│   │   └── health.router.js      # Health check routes
│   ├── schemas/                  # Validation schemas
│   │   └── auth.schema.js        # Auth validation schemas
│   └── services/                 # Business logic
│       └── auth.service.js       # Authentication service
├── .env.example                  # Environment variables template
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

## Key Dependencies

- **express**: Web framework
- **zod**: Schema validation
- **argon2**: Password hashing
- **jsonwebtoken**: JWT token generation/verification
- **@supabase/supabase-js**: Database client
- **cookie-parser**: Cookie parsing middleware
- **dotenv**: Environment variable management

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
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `SECRET_KEY`
- `PORT` (optional, defaults to 8000)

4. Start the server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

## API Endpoints

### Authentication
- `POST /register` - Register a new user
- `POST /login` - Authenticate user
- `GET /refresh-token` - Refresh authentication tokens

### Health Check
- `GET /health` - Server health status

## Best Practices Summary

✅ **Separation of Concerns** - Clear layer boundaries  
✅ **DRY Principle** - Reusable components and utilities  
✅ **Security First** - Secure password hashing and token management  
✅ **Type Safety** - Zod schemas for runtime validation  
✅ **Error Handling** - Consistent error responses  
✅ **Documentation** - Comprehensive JSDoc comments  
✅ **Configuration** - Centralized and environment-aware  
✅ **Testability** - Modular structure for easy testing  
✅ **Maintainability** - Clean code and clear patterns  

## Notes

- All documentation is in English
- Code follows modern JavaScript/Node.js conventions
- Environment-specific configurations are properly separated
- Security best practices are implemented throughout
