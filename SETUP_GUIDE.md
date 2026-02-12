# Online School Platform - Setup Guide

## Quick Start

### 1. Configure Environment

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

**Critical Configuration:**
- `DATABASE_URL`: Update with your PostgreSQL credentials
- `JWT_SECRET`: Generate a secure random string (min 32 characters)
- `SUPERADMIN_EMAIL` and `SUPERADMIN_PASSWORD`: Set your super admin credentials

Example for local PostgreSQL:
```
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/online_school_db
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database

Generate Prisma Client:
```bash
npm run prisma:generate
```

Create and run migrations:
```bash
npm run prisma:migrate
```

Seed the super admin user:
```bash
npm run seed
```

### 4. Run the Server

Development mode with hot reload:
```bash
npm run dev:ts
```

Production mode:
```bash
npm run build
npm start
```

Server will start on: **http://localhost:3000**

## Testing the API

### Option 1: Using Postman Collection

1. Import `postman_collection.json` into Postman
2. The collection includes all endpoints with examples
3. Variables are automatically set (token, schoolId, classId)

### Option 2: Using cURL

**1. Login as Super Admin:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SuperSecure123!"
  }'
```

Save the `accessToken` from the response.

**2. Create a School:**
```bash
curl -X POST http://localhost:3000/schools \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Harvard University"
  }'
```

Save the school `id` from the response.

**3. Invite a School Admin:**
```bash
curl -X POST http://localhost:3000/schools/SCHOOL_ID/invites/school-admin \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "schooladmin@example.com",
    "expiresInHours": 72
  }'
```

Check the console output for the invite URL (stub mailer logs it).

**4. Accept the Invite:**
```bash
curl -X POST http://localhost:3000/auth/accept-invite \
  -H "Content-Type: application/json" \
  -d '{
    "token": "TOKEN_FROM_CONSOLE",
    "password": "newpassword123",
    "name": "School Admin"
  }'
```

## Complete Flow Example

### Super Admin Flow:
1. Login → Get token
2. Create school
3. Invite school admin (check console for invite URL)

### School Admin Flow:
1. Accept invite (from console URL)
2. Login with new credentials
3. Create classes
4. Invite teachers/students to classes

### Teacher Flow:
1. Accept invite
2. Login
3. Post messages in assigned classes
4. View class messages and members

### Student Flow:
1. Accept invite
2. Login
3. View class messages
4. View class information

## Useful Commands

**View database in GUI:**
```bash
npm run prisma:studio
```

**Reset database:**
```bash
npx prisma migrate reset
npm run seed
```

**Generate TypeScript types:**
```bash
npm run prisma:generate
```

**Check for type errors:**
```bash
npm run build
```

## Project Structure

```
src/
├── app.ts                    # Express app configuration
├── server.ts                 # Server entry point
├── prisma.ts                 # Prisma client singleton
├── config/
│   └── env.ts               # Environment validation (Zod)
├── routes/
│   ├── authRoutes.ts        # Auth endpoints
│   ├── schoolRoutes.ts      # School & admin endpoints
│   └── classRoutes.ts       # Class & message endpoints
├── controllers/
│   ├── authController.ts    # Auth request handlers
│   ├── schoolController.ts  # School request handlers
│   └── classController.ts   # Class request handlers
├── services/
│   ├── authService.ts       # Auth business logic
│   ├── schoolService.ts     # School business logic
│   └── classService.ts      # Class business logic
├── middlewares/
│   ├── auth.ts              # Authentication & authorization
│   └── validate.ts          # Request validation wrapper
├── validators/
│   ├── auth.ts              # Auth validation schemas (Zod)
│   ├── school.ts            # School validation schemas
│   └── message.ts           # Message validation schemas
├── utils/
│   ├── crypto.ts            # Token generation & hashing
│   ├── jwt.ts               # JWT signing & verification
│   ├── mailer.ts            # Email stub (logs to console)
│   └── rateLimiter.ts       # In-memory rate limiter
└── errors/
    ├── ApiError.ts          # Custom error class
    └── errorHandler.ts      # Centralized error handler
```

## Security Features

- ✅ JWT authentication (HS256)
- ✅ Password hashing (bcrypt, 12 rounds)
- ✅ Rate limiting on login (5 attempts per 15 min)
- ✅ Helmet security headers
- ✅ CORS configuration
- ✅ Token hashing (SHA-256) - never store raw tokens
- ✅ Environment validation
- ✅ Role-based access control
- ✅ Database-level permission checks

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL format
- Ensure database exists or let Prisma create it

### JWT Errors
- Ensure JWT_SECRET is at least 32 characters
- Check token hasn't expired (30min default)

### Invite Token Issues
- Check console for logged invite URLs
- Tokens expire after 72 hours by default
- Tokens are single-use only

### Port Already in Use
Change PORT in `.env` file:
```
PORT=3001
```

## API Documentation

All endpoints return JSON. Errors follow this format:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {}
  }
}
```

See `README_SCHOOL_PLATFORM.md` for complete API documentation.

