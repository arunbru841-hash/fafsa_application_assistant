# FAFSA Assistant Pro - Setup Guide

## Prerequisites Checklist

Before you begin, ensure you have:

- ✅ Node.js >= 18.0.0 installed
- ✅ npm >= 9.0.0 installed
- ✅ Git installed
- ✅ A code editor (VS Code recommended)
- ⬜ PostgreSQL >= 14 (optional, for production features)
- ⬜ Redis (optional, for caching)

## Quick Start (Development)

### 1. Install Dependencies

Open PowerShell and navigate to the project root:

```powershell
cd fafsa-assistant

# Install all dependencies for all workspaces
npm install
```

This will install dependencies for:
- Root workspace
- Frontend (`apps/web`)
- Backend (`apps/api`)

### 2. Set Up Environment Variables

**Frontend:**

```powershell
cd apps\web
Copy-Item .env.example .env.local
```

Edit `apps\web\.env.local` with your preferred editor:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_AI_ASSISTANT=true
```

**Backend:**

```powershell
cd ..\api
Copy-Item .env.example .env
```

Edit `apps\api\.env`:
```env
NODE_ENV=development
PORT=4000
CORS_ORIGINS=http://localhost:3000
JWT_SECRET=dev-secret-change-in-production
```

### 3. Start Development Servers

From the project root:

```powershell
npm run dev
```

This starts both:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000

### 4. Verify Installation

Open your browser:
- Frontend: http://localhost:3000
- API Health Check: http://localhost:4000/health

Expected API response:
```json
{
  "status": "healthy",
  "timestamp": "2025-12-08T...",
  "environment": "development"
}
```

## Detailed Installation Steps

### Frontend Setup

```powershell
cd apps\web

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Backend Setup

```powershell
cd apps\api

# Install dependencies
npm install

# Start development server (with hot reload)
npm run dev

# Build TypeScript
npm run build

# Start production server
npm start
```

## Package Dependencies

The project uses these major dependencies:

### Frontend (`apps/web`)
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Query** - Data fetching
- **Zod** - Validation
- **Framer Motion** - Animations
- **Lucide React** - Icons

### Backend (`apps/api`)
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database (optional)
- **JWT** - Authentication
- **Zod** - Validation
- **Winston** - Logging
- **Helmet** - Security

## Troubleshooting

### Port Already in Use

If ports 3000 or 4000 are in use:

**Change Frontend Port:**
```powershell
# In apps/web
$env:PORT=3001; npm run dev
```

**Change Backend Port:**
Edit `apps/api/.env`:
```env
PORT=4001
```

Then update `apps/web/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4001
```

### Module Not Found Errors

If you see TypeScript errors about missing modules:

```powershell
# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install

# For specific workspace
cd apps\web
Remove-Item -Recurse -Force node_modules
npm install
```

### TypeScript Errors

The project is configured with strict TypeScript. Some errors during development are expected until all dependencies are installed:

```powershell
# Check TypeScript errors
cd apps\web
npm run type-check

cd ..\api
npm run type-check
```

### Missing Dependencies

If you encounter missing dependencies:

```powershell
# Frontend specific
cd apps\web
npm install class-variance-authority @tailwindcss/forms @tailwindcss/typography

# Backend specific
cd apps\api
npm install
```

## Development Workflow

### Making Changes

1. **Frontend Changes**: Edit files in `apps/web/src`
   - Hot reload is enabled
   - Changes appear instantly

2. **Backend Changes**: Edit files in `apps/api/src`
   - Server restarts automatically with `tsx watch`

3. **Shared Types**: Edit `apps/web/src/types` or `apps/api/src/types`

### Code Quality

```powershell
# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

## Production Deployment

### Frontend (Vercel Recommended)

```powershell
# Install Vercel CLI
npm i -g vercel

# Deploy
cd apps\web
vercel --prod
```

### Backend (Railway/Heroku/DigitalOcean)

```powershell
# Build
cd apps\api
npm run build

# Set environment variables on your platform
# Start with: npm start
```

### Environment Variables (Production)

**Critical: Change these in production!**

```env
# Backend
NODE_ENV=production
JWT_SECRET=<strong-random-secret-here>
DB_HOST=<your-postgres-host>
DB_PASSWORD=<strong-password>
CORS_ORIGINS=https://your-domain.com

# Frontend
NEXT_PUBLIC_API_URL=https://api.your-domain.com
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Database Setup (Optional)

For production features:

```powershell
# Create database
createdb fafsa_assistant

# Update .env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fafsa_assistant
DB_USER=postgres
DB_PASSWORD=your-password
```

## Support

If you encounter issues:

1. Check this guide
2. Review the main [README.md](../README.md)
3. Check for open issues on GitHub
4. Create a new issue with:
   - Error message
   - Steps to reproduce
   - Your environment (Node version, OS)

## Next Steps

1. ✅ Read the [main README](../README.md)
2. ✅ Explore the code structure
3. ✅ Try the application at http://localhost:3000
4. ✅ Review API endpoints at http://localhost:4000/health
5. ✅ Start building features!

## Quick Reference

| Command | Description |
|---------|-------------|
| `npm install` | Install all dependencies |
| `npm run dev` | Start all dev servers |
| `npm run build` | Build all apps |
| `npm run lint` | Lint all code |
| `npm run format` | Format all code |

### Individual Apps

| App | Command | URL |
|-----|---------|-----|
| Frontend | `cd apps/web; npm run dev` | http://localhost:3000 |
| Backend | `cd apps/api; npm run dev` | http://localhost:4000 |

---

**Happy Coding! 🚀**
