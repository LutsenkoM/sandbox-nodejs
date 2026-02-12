- **Centralized error handling**
- **Environment validation**

## Project Structure

```
src/
├── app.ts                 # Express app setup
├── server.ts             # Server entry point
├── prisma.ts             # Prisma client singleton
├── config/
│   └── env.ts            # Environment validation
├── routes/               # API routes
├── controllers/          # Request handlers
├── services/             # Business logic
├── middlewares/          # Auth & validation
├── validators/           # Zod schemas
├── utils/                # Helpers (crypto, jwt, mailer)
└── errors/               # Error handling

prisma/
├── schema.prisma         # Database schema
└── seed.ts              # Database seeding
```

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

Required variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Min 32 characters for HS256
- `SUPERADMIN_EMAIL` - Super admin email for seeding
- `SUPERADMIN_PASSWORD` - Super admin password (min 8 chars)
- `FRONTEND_ORIGIN` - CORS origin (default: http://localhost:5173)

### 3. Database Setup

Generate Prisma client:
```bash
npx prisma generate
```

Run migrations:
```bash
npx prisma migrate dev --name init
```

Seed super admin:
```bash
npm run seed
```

### 4. Run Development Server

```bash
npm run dev
```

Server will start on http://localhost:3000

## API Endpoints

### Authentication

#### POST `/auth/login`
Login with email and password.
```json
{
  "email": "admin@example.com",
  "password": "SuperSecure123!"
}
```
Returns: `{ "accessToken": "..." }`

#### POST `/auth/me`
Get current user info (requires auth).
Returns user with memberships and class enrollments.

#### POST `/auth/accept-invite`
Accept an invite token.
```json
{
  "token": "invite-token-here",
  "password": "newpassword123",
  "name": "John Doe"
}
```

#### POST `/auth/logout`
Logout (no-op for JWT, client discards token).

### Super Admin Only

#### POST `/schools`
Create a new school.
```json
{
  "name": "Harvard University"
}
```

#### POST `/schools/:schoolId/invites/school-admin`
Invite a school administrator.
```json
{
  "email": "admin@school.com",
  "expiresInHours": 72
}
```

### School Admin

#### POST `/schools/:schoolId/classes`
Create a class in the school.
```json
{
  "name": "Mathematics 101"
}
```

#### POST `/schools/:schoolId/invites`
Invite teacher or student to school (optionally to a class).
```json
{
  "email": "teacher@school.com",
  "role": "TEACHER",
  "classId": "optional-class-id",
  "expiresInHours": 72
}
```

#### GET `/schools/:schoolId`
Get school details with classes and members.

### Teacher

#### POST `/classes/:classId/messages`
Post a message to the class.
```json
{
  "text": "Welcome to the class!"
}
```

### Teacher & Student

#### GET `/classes/:classId/messages`
Get all messages in the class.

#### GET `/classes/:classId`
Get class details with enrollments.

## Authorization Flow

1. **Super Admin** creates schools and invites School Admins
2. **School Admin** creates classes and invites Teachers/Students
3. **Invite System**:
   - Invite URL logged to console (stub mailer)
   - Token is hashed (sha256) before storage
   - Accepting invite creates user and assigns roles
4. **Access Control**:
   - JWT contains only user ID
   - Permissions checked via database on each request
   - Middleware enforces role requirements

## Security Features

- Passwords hashed with bcrypt (12 rounds)
- JWT tokens (30min TTL)
- Rate limiting on login (5 attempts per 15min)
- Helmet for security headers
- CORS configured
- Token hashing (never store raw tokens)
- Environment validation with Zod

## Development

Build TypeScript:
```bash
npm run build
```

Run production:
```bash
npm start
```

View database:
```bash
npx prisma studio
```

Reset database:
```bash
npx prisma migrate reset
```

## Testing Flow

1. Login as super admin:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"SuperSecure123!"}'
```

2. Create a school:
```bash
curl -X POST http://localhost:3000/schools \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test School"}'
```

3. Invite school admin (check console for invite URL)
4. Accept invite with the token from console
5. Continue testing other endpoints

## Database Models

- **User** - System users with global roles
- **School** - Educational institutions
- **Class** - Classes within schools
- **Membership** - User roles in schools
- **ClassEnrollment** - User roles in classes
- **InviteToken** - Invitation management
- **Message** - Class chat messages

## Notes

- No refresh tokens in MVP (use short-lived access tokens)
- Email sending is stubbed (logs to console)
- Super admin has access to all resources
- Tokens are single-use and expire
- All endpoints return JSON with consistent error format
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}

