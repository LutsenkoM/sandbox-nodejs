# 🎓 Online School Platform - Complete MVP Backend

## ✅ Project Status: READY TO RUN

A fully functional MVP backend for an online school platform with:
- ✅ TypeScript + Express.js + PostgreSQL + Prisma
- ✅ Invite-based registration (no open signup)
- ✅ Role-based access control (4 roles)
- ✅ JWT authentication (HS256)
- ✅ Complete CRUD operations
- ✅ Postman collection included
- ✅ Production-ready error handling
- ✅ Security best practices

## 📋 What's Been Built

### Database Schema (Prisma)
- **User** - System users with global roles
- **School** - Educational institutions
- **Class** - Classes within schools
- **Membership** - User roles in schools (SCHOOL_ADMIN, TEACHER, STUDENT)
- **ClassEnrollment** - User roles in classes (TEACHER, STUDENT)
- **InviteToken** - Secure invite management (hashed tokens)
- **Message** - Class chat messages

### API Endpoints (REST)

**Auth:**
- `POST /auth/login` - Login with credentials
- `POST /auth/me` - Get user profile
- `POST /auth/accept-invite` - Accept invitation
- `POST /auth/logout` - Logout (no-op for JWT)

**Super Admin:**
- `POST /schools` - Create school
- `POST /schools/:schoolId/invites/school-admin` - Invite school admin

**School Admin:**
- `POST /schools/:schoolId/classes` - Create class
- `POST /schools/:schoolId/invites` - Invite teacher/student
- `GET /schools/:schoolId` - Get school details

**Teacher:**
- `POST /classes/:classId/messages` - Post message

**Teacher & Student:**
- `GET /classes/:classId/messages` - Get messages
- `GET /classes/:classId` - Get class details

### Security Features
- Password hashing: bcrypt (12 rounds)
- JWT tokens: HS256 with 30min TTL
- Rate limiting: 5 login attempts per 15min
- Token hashing: SHA-256 (never store raw tokens)
- Security headers: Helmet
- CORS: Configurable origin
- Input validation: Zod schemas
- Centralized error handling

### Architecture
- **Clean separation:** routes → controllers → services
- **Middleware:** authentication, authorization, validation
- **Error handling:** Centralized with consistent format
- **Environment validation:** Zod schemas
- **Type safety:** Full TypeScript coverage

## 🚀 Quick Start

### 1. Configure Database
Edit `.env` file:
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/online_school_db
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
SUPERADMIN_EMAIL=admin@example.com
SUPERADMIN_PASSWORD=SuperSecure123!
```

### 2. Setup Database
```bash
npm run prisma:generate
npm run prisma:migrate
npm run seed
```

### 3. Run Server
```bash
npm run dev:ts
```

Server: http://localhost:3000
Health: http://localhost:3000/health

## 📖 Documentation Files

- **README_SCHOOL_PLATFORM.md** - Complete API documentation
- **SETUP_GUIDE.md** - Detailed setup instructions
- **postman_collection.json** - Postman collection for testing
- **.env.example** - Environment variables template

## 🔐 Authorization Model

### Roles & Permissions

**SUPER_ADMIN (Global):**
- Create schools
- Invite school admins
- Access all resources

**SCHOOL_ADMIN (Per School):**
- Create classes in their school
- Invite teachers/students
- View school data

**TEACHER (Per Class):**
- Post messages in their classes
- View class members and messages

**STUDENT (Per Class):**
- View class members and messages

### Invite Flow
1. Super Admin creates school → invites School Admin
2. School Admin creates classes → invites Teachers/Students
3. Invitees receive URL (logged to console in MVP)
4. Accept invite → creates account or adds role
5. Token is marked as used (single-use)

## 🧪 Testing

### Using Postman
1. Import `postman_collection.json`
2. Run "Login" request (saves token automatically)
3. Run other requests in order

### Using cURL
See SETUP_GUIDE.md for complete examples.

### Test Flow
1. Login as super admin
2. Create school (note the ID)
3. Invite school admin (check console for URL)
4. Use token from console to accept invite
5. Login as school admin
6. Create class and invite teacher/student
7. Continue testing...

## 📁 Project Files

```
├── src/
│   ├── server.ts              # Entry point
│   ├── app.ts                 # Express setup
│   ├── prisma.ts              # DB client
│   ├── config/env.ts          # Env validation
│   ├── routes/                # API routes
│   ├── controllers/           # Request handlers
│   ├── services/              # Business logic
│   ├── middlewares/           # Auth & validation
│   ├── validators/            # Zod schemas
│   ├── utils/                 # Helpers
│   └── errors/                # Error handling
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed script
├── postman_collection.json    # API tests
├── tsconfig.json              # TypeScript config
├── package.json               # Dependencies
├── .env                       # Configuration
└── dist/                      # Compiled JS

Documentation:
├── README_SCHOOL_PLATFORM.md  # API docs
└── SETUP_GUIDE.md             # Setup guide
```

## 🔧 Available Scripts

```bash
npm run dev:ts          # Development with hot reload
npm run build           # Compile TypeScript
npm start               # Run production build
npm run seed            # Seed super admin
npm run prisma:generate # Generate Prisma client
npm run prisma:migrate  # Run migrations
npm run prisma:studio   # Open Prisma Studio GUI
```

## 🎯 Next Steps

1. **Update .env** - Configure database and secrets
2. **Run migrations** - Setup database schema
3. **Seed database** - Create super admin
4. **Start server** - Test endpoints
5. **Import Postman** - Use collection for testing

## 💡 Notes

- **Email sending:** Stubbed for MVP (logs to console)
- **Refresh tokens:** Not implemented (MVP uses short-lived access tokens)
- **File uploads:** Not implemented
- **Rate limiting:** In-memory (use Redis for production)
- **Logging:** Console only (add proper logging for production)

## 🏗️ Production Considerations

Before deploying to production:
- [ ] Add proper logging (Winston, Pino)
- [ ] Use Redis for rate limiting
- [ ] Implement refresh tokens
- [ ] Add real email service
- [ ] Set up monitoring/alerts
- [ ] Add database backups
- [ ] Use proper secrets management
- [ ] Add request logging
- [ ] Implement pagination
- [ ] Add API versioning
- [ ] Set up CI/CD

## 📝 Code Quality

- ✅ TypeScript strict mode
- ✅ No unused variables warnings
- ✅ Consistent error handling
- ✅ Input validation on all endpoints
- ✅ Database constraints and indexes
- ✅ Proper HTTP status codes
- ✅ Clean architecture

---

**Built with:** Node.js | TypeScript | Express.js | PostgreSQL | Prisma | JWT | Zod | Bcrypt

