# Quick Start Guide

Get **FAFSA Assistant Pro** running in 5 minutes.

---

## Prerequisites

Ensure you have the following installed:

- **Node.js 18+**: [Download here](https://nodejs.org/)
- **npm 9+**: Comes with Node.js
- **Git**: [Download here](https://git-scm.com/)
- **PostgreSQL 14+** (optional, for full functionality): [Download here](https://www.postgresql.org/download/)
- **Redis 7+** (optional, for sessions): [Download here](https://redis.io/download/)

**Verify installations**:
```powershell
node --version  # Should be v18.x.x or higher
npm --version   # Should be 9.x.x or higher
git --version   # Any recent version
```

---

## Installation

### Step 1: Clone the Repository (if applicable)
```powershell
# If you have this as a Git repository
git clone https://github.com/your-org/fafsa-assistant.git
cd fafsa-assistant

# If you're already in the directory
cd C:\Users\Public\test-capabilities\fafsa-assistant
```

### Step 2: Install Dependencies
```powershell
# Install all dependencies for the monorepo
npm install

# This will install dependencies for:
# - Root workspace
# - apps/web (Next.js frontend)
# - apps/api (Express backend)
```

**Expected output**:
```
added 1420 packages in 2m
```

### Step 3: Set Up Environment Variables

#### Frontend Environment
```powershell
# Create environment file
New-Item -Path "apps\web\.env.local" -ItemType File

# Add to apps/web/.env.local:
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Backend Environment
```powershell
# Create environment file
New-Item -Path "apps\api\.env" -ItemType File

# Add to apps/api/.env:
NODE_ENV=development
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
DATABASE_URL=postgresql://postgres:password@localhost:5432/fafsa_dev
REDIS_URL=redis://localhost:6379
FRONTEND_URL=http://localhost:3000
```

**Note**: The application will work without PostgreSQL/Redis for initial testing (uses in-memory storage).

---

## Running the Application

### Option 1: Run Everything (Recommended)
```powershell
# Start both frontend and backend
npm run dev
```

This starts:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

### Option 2: Run Individually
```powershell
# Terminal 1: Start frontend only
npm run dev --filter=web

# Terminal 2: Start backend only
npm run dev --filter=api
```

### Option 3: Run with Turbo (Parallel)
```powershell
# Turbo runs both workspaces in parallel
npx turbo dev
```

---

## Verify Installation

### Check Frontend
Open your browser to **http://localhost:3000**

You should see:
- ✅ Professional homepage with hero section
- ✅ Student testimonials
- ✅ Trust badges (FERPA, SOC 2, SSL)
- ✅ Feature cards
- ✅ Call-to-action buttons

### Check Backend API
Open your browser to **http://localhost:3001/health**

You should see:
```json
{
  "status": "ok",
  "timestamp": "2024-12-10T12:00:00.000Z",
  "uptime": 42.5
}
```

### Test API Endpoints

**Register a new user**:
```powershell
$body = @{
  email = "test@example.com"
  password = "SecurePass123!"
  firstName = "John"
  lastName = "Doe"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/api/auth/register" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

**Expected response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "test@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

---

## Common Issues & Solutions

### Issue 1: Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution**:
```powershell
# Find process using the port
Get-NetTCPConnection -LocalPort 3000 | Select-Object OwningProcess

# Kill the process (replace PID with actual process ID)
Stop-Process -Id <PID> -Force

# Or use a different port
# In apps/web/package.json: "dev": "next dev -p 3002"
```

### Issue 2: Module Not Found
```
Error: Cannot find module 'next'
```

**Solution**:
```powershell
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force apps/web/node_modules
Remove-Item -Recurse -Force apps/api/node_modules
npm install
```

### Issue 3: TypeScript Errors
```
Type error: Cannot find name 'React'
```

**Solution**: These are expected before running `npm install`. After installation, restart your editor:
```powershell
# In VS Code: Press Ctrl+Shift+P
# Type "Reload Window" and press Enter
```

### Issue 4: Database Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution**: The app works without a database initially. To connect PostgreSQL:
```powershell
# Install PostgreSQL: https://www.postgresql.org/download/windows/

# Create database
psql -U postgres
CREATE DATABASE fafsa_dev;
\q

# Update DATABASE_URL in apps/api/.env
# DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/fafsa_dev
```

---

## Database Setup (Optional)

### PostgreSQL Setup

**1. Install PostgreSQL**:
- Download from https://www.postgresql.org/download/windows/
- During installation, set password for `postgres` user
- Remember the password for connection string

**2. Create Development Database**:
```powershell
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE fafsa_dev;

# Create user (optional)
CREATE USER fafsa_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE fafsa_dev TO fafsa_user;

# Exit
\q
```

**3. Run Migrations** (when implemented):
```powershell
cd apps/api
npm run db:migrate
```

### Redis Setup (Optional)

**1. Install Redis on Windows**:
```powershell
# Using Chocolatey package manager
choco install redis-64

# Or download from: https://github.com/microsoftarchive/redis/releases
```

**2. Start Redis**:
```powershell
redis-server
```

**3. Verify Redis**:
```powershell
redis-cli ping
# Should return: PONG
```

---

## Development Workflow

### File Watching
All changes are automatically reloaded:
- **Frontend**: Next.js Fast Refresh (instant updates)
- **Backend**: TypeScript watch mode (restarts on changes)

### Building for Production

**Build all workspaces**:
```powershell
npm run build
```

**Build individually**:
```powershell
# Frontend
npm run build --filter=web

# Backend
npm run build --filter=api
```

**Start production server**:
```powershell
npm run start --filter=web   # Frontend
npm run start --filter=api   # Backend
```

---

## IDE Setup

### Visual Studio Code (Recommended)

**Recommended Extensions**:
- ESLint
- Prettier - Code formatter
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- GitLens
- Error Lens

**Install all at once**:
```powershell
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
code --install-extension eamodio.gitlens
code --install-extension usernamehw.errorlens
```

**VS Code Settings** (`.vscode/settings.json`):
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

---

## Testing the Application

### Navigate the Website

**Homepage** (http://localhost:3000):
- ✅ Hero section with student imagery
- ✅ Stats cards (100K+ students, $2.1B+ aid)
- ✅ Feature cards (Smart Wizard, AI Validation, etc.)
- ✅ How It Works timeline
- ✅ Testimonials section
- ✅ Trust & Security section
- ✅ Footer with certification badges

**Application Wizard** (http://localhost:3000/application/getting-started):
- ✅ Progress bar (Step 1 of 7)
- ✅ Document checklist
- ✅ FSA ID requirement notice
- ✅ Quick eligibility check
- ✅ "Save & Exit" and "Continue" buttons

### Test API Endpoints

**Health Check**:
```powershell
Invoke-RestMethod -Uri "http://localhost:3001/health"
```

**Register User**:
```powershell
$registerBody = @{
  email = "student@example.com"
  password = "SecurePassword123!"
  firstName = "Jane"
  lastName = "Student"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/register" `
  -Method Post `
  -ContentType "application/json" `
  -Body $registerBody

$token = $response.token
Write-Host "Token: $token"
```

**Get Current User** (requires authentication):
```powershell
Invoke-RestMethod -Uri "http://localhost:3001/api/auth/me" `
  -Headers @{ Authorization = "Bearer $token" }
```

**Validate Field**:
```powershell
$validateBody = @{
  field = "ssn"
  value = "123-45-6789"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/api/validation/field" `
  -Method Post `
  -ContentType "application/json" `
  -Body $validateBody
```

**Calculate EFC**:
```powershell
$efcBody = @{
  studentIncome = 15000
  parentIncome = 75000
  assets = 25000
  dependents = 3
  collegeStudents = 1
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/api/validation/calculate-efc" `
  -Method Post `
  -ContentType "application/json" `
  -Body $efcBody
```

---

## Next Steps

### 1. Explore the Codebase
- **Frontend**: `apps/web/src/`
  - `app/page.tsx` - Homepage
  - `components/` - Reusable UI components
  - `lib/` - Utilities, constants, images
- **Backend**: `apps/api/src/`
  - `server.ts` - Express server setup
  - `controllers/` - Business logic
  - `routes/` - API endpoints

### 2. Build Remaining Wizard Pages
Use `apps/web/src/app/application/getting-started/page.tsx` as a template to create:
- `student-info/page.tsx`
- `dependency/page.tsx`
- `financial/page.tsx`
- `parent-info/page.tsx`
- `school-selection/page.tsx`
- `review/page.tsx`

### 3. Review Documentation
- **README.md**: Project overview
- **DESIGN_SYSTEM.md**: UI/UX guidelines
- **SECURITY.md**: Security best practices
- **DEPLOYMENT.md**: Production deployment guide
- **PROJECT_STATUS.md**: Complete project summary

### 4. Customize Branding
- Replace Unsplash images with your own in `apps/web/src/lib/images.ts`
- Update certification badges in `apps/web/public/certifications/`
- Modify color scheme in `apps/web/tailwind.config.ts`

---

## Getting Help

### Documentation
- **Next.js**: https://nextjs.org/docs
- **Express**: https://expressjs.com/
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Turborepo**: https://turbo.build/repo/docs

### Troubleshooting
- Check `apps/api/logs/error.log` for backend errors
- Check browser console (F12) for frontend errors
- Review `PROJECT_STATUS.md` for known issues

### Support
- File issues in GitHub repository
- Check existing documentation files
- Review TypeScript errors in VS Code

---

## Success!

You now have **FAFSA Assistant Pro** running locally. The platform features:

✅ Professional, trustworthy design  
✅ Real student imagery and testimonials  
✅ Trust badges and certifications  
✅ Secure authentication system  
✅ Real-time validation engine  
✅ Comprehensive documentation

**Happy developing!** 🎓💰

---

**Last Updated**: December 2024  
**Maintained By**: Development Team
