# Production Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Configuration

Create production environment files:

**`apps/web/.env.production`**
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_ENVIRONMENT=production
```

**`apps/api/.env.production`**
```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:password@host:5432/fafsa_db
REDIS_URL=redis://user:password@host:6379
JWT_SECRET=<GENERATE_SECURE_SECRET>
FRONTEND_URL=https://yourdomain.com
```

### 2. Image Licensing

**Action Required**: Replace Unsplash placeholder images with licensed photography.

#### Option A: Purchase Licensed Stock Photos
- **Adobe Stock**: $29.99/month for 10 images
- **Shutterstock**: $29/month for 10 images
- **Getty Images**: Custom pricing for exclusive content

#### Option B: Commission Custom Photography
- Budget: $1,500-5,000 for professional shoot
- Benefits: Unique, brand-aligned imagery
- Include model releases for all individuals

**See**: [`IMAGE_ATTRIBUTION.md`](../IMAGE_ATTRIBUTION.md) for complete licensing guide.

### 3. Legal & Compliance

- [ ] **Privacy Policy**: Draft comprehensive privacy policy
- [ ] **Terms of Service**: Create terms and conditions
- [ ] **Cookie Consent**: Implement GDPR/CCPA compliant cookie banner
- [ ] **FERPA Compliance**: Review student data handling procedures
- [ ] **Model Releases**: Obtain for all testimonial photos
- [ ] **Partner Agreements**: Secure partnerships with Federal Student Aid (if claiming)

### 4. Security Hardening

```bash
# Generate secure JWT secret (256-bit)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Update all secrets in production environment
# Never commit secrets to version control
```

- [ ] Enable HTTPS/SSL certificates (Let's Encrypt or CloudFlare)
- [ ] Configure Content Security Policy (CSP)
- [ ] Set up rate limiting in production
- [ ] Enable DDoS protection (CloudFlare, AWS Shield)
- [ ] Configure CORS for production domain only
- [ ] Set secure cookie flags (httpOnly, secure, sameSite)

### 5. Database Setup

**PostgreSQL Production Setup**

```sql
-- Create production database
CREATE DATABASE fafsa_assistant_prod;

-- Create dedicated user
CREATE USER fafsa_app WITH ENCRYPTED PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE fafsa_assistant_prod TO fafsa_app;

-- Run migrations
npm run db:migrate --workspace=apps/api
```

**Redis Production Setup**

```bash
# Install Redis
sudo apt-get install redis-server

# Configure Redis for production
sudo nano /etc/redis/redis.conf

# Set:
# bind 127.0.0.1 ::1
# requirepass <strong_password>
# maxmemory 256mb
# maxmemory-policy allkeys-lru

# Restart Redis
sudo systemctl restart redis
```

---

## Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Deploy)

#### Frontend (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd apps/web
vercel --prod
```

**Vercel Configuration:**
- Build Command: `cd ../.. && npm run build --filter=web`
- Output Directory: `apps/web/.next`
- Install Command: `npm install`
- Environment Variables: Add from `.env.production`

#### Backend (Railway)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Deploy backend
cd apps/api
railway login
railway init
railway up
```

**Railway Configuration:**
- Root Directory: `apps/api`
- Build Command: `npm install && npm run build`
- Start Command: `npm start`
- Add PostgreSQL and Redis services from Railway dashboard

---

### Option 2: AWS (Production-Grade)

#### Architecture
- **Frontend**: AWS Amplify or S3 + CloudFront
- **Backend**: ECS Fargate or EC2 with Auto Scaling
- **Database**: RDS PostgreSQL (Multi-AZ)
- **Cache**: ElastiCache Redis
- **CDN**: CloudFront
- **DNS**: Route 53
- **SSL**: Certificate Manager

#### Deployment Steps

**1. Frontend to S3 + CloudFront**
```bash
# Build frontend
cd apps/web
npm run build

# Deploy to S3
aws s3 sync out/ s3://your-bucket-name --delete
aws cloudfront create-invalidation --distribution-id DISTID --paths "/*"
```

**2. Backend to ECS Fargate**
```bash
# Build Docker image
cd apps/api
docker build -t fafsa-api .

# Push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com
docker tag fafsa-api:latest <account>.dkr.ecr.us-east-1.amazonaws.com/fafsa-api:latest
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/fafsa-api:latest

# Create ECS service (use AWS Console or CloudFormation)
```

**3. Database Setup (RDS)**
```bash
# Create RDS PostgreSQL instance via AWS Console
# Enable Multi-AZ for high availability
# Configure automated backups (7-day retention minimum)
# Set up read replicas for scaling
```

---

### Option 3: DigitalOcean App Platform (Cost-Effective)

**App Spec (`app.yaml`)**
```yaml
name: fafsa-assistant-pro
region: nyc

# Frontend
services:
- name: web
  github:
    repo: your-org/fafsa-assistant
    branch: main
    deploy_on_push: true
  source_dir: /apps/web
  build_command: npm run build
  run_command: npm start
  envs:
  - key: NEXT_PUBLIC_API_URL
    value: ${api.PUBLIC_URL}
  routes:
  - path: /

# Backend
- name: api
  github:
    repo: your-org/fafsa-assistant
    branch: main
  source_dir: /apps/api
  build_command: npm run build
  run_command: npm start
  http_port: 3001
  envs:
  - key: DATABASE_URL
    value: ${db.DATABASE_URL}
  - key: REDIS_URL
    value: ${redis.DATABASE_URL}
  routes:
  - path: /api

# Database
databases:
- name: db
  engine: PG
  version: "15"
  size: db-s-1vcpu-1gb

- name: redis
  engine: REDIS
  version: "7"
  size: db-s-1vcpu-1gb
```

Deploy:
```bash
doctl apps create --spec app.yaml
```

---

## Post-Deployment Tasks

### 1. Performance Optimization

**Image Optimization**
```bash
# Install sharp for optimized image processing
npm install sharp --workspace=apps/web

# Enable Next.js image optimization in production
# next.config.js already configured
```

**Caching Strategy**
```javascript
// Set CDN cache headers
// Already configured in next.config.js headers
```

### 2. Monitoring & Analytics

**Application Monitoring**
- **Sentry**: Error tracking
  ```bash
  npm install @sentry/nextjs @sentry/node --workspaces
  ```
- **DataDog**: Full-stack monitoring
- **New Relic**: Application performance monitoring

**User Analytics**
- **Google Analytics 4**: User behavior tracking
- **Hotjar**: Heatmaps and session recordings
- **PostHog**: Open-source product analytics

### 3. Backup & Disaster Recovery

```bash
# PostgreSQL automated backups
# Set up daily backups with 30-day retention
pg_dump -h <host> -U <user> -d fafsa_assistant_prod > backup-$(date +%Y%m%d).sql

# Upload to S3
aws s3 cp backup-$(date +%Y%m%d).sql s3://your-backup-bucket/
```

### 4. SSL/TLS Configuration

```bash
# Use Let's Encrypt for free SSL
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Or use CloudFlare for automated SSL + DDoS protection
```

### 5. Load Testing

```bash
# Install artillery
npm install -g artillery

# Run load test
artillery quick --count 100 --num 10 https://yourdomain.com
```

---

## Scaling Considerations

### Traffic Expectations
- **Low**: <10k users/month - Single instance sufficient
- **Medium**: 10k-100k users/month - Horizontal scaling, load balancer
- **High**: >100k users/month - CDN, multiple regions, auto-scaling

### Horizontal Scaling
```bash
# AWS Auto Scaling Group
# Set min: 2, max: 10 instances
# Scale on CPU > 70% or request count > 1000/min
```

### Database Scaling
- **Read Replicas**: Separate read/write workloads
- **Connection Pooling**: Use PgBouncer (500 max connections)
- **Partitioning**: Time-based partitioning for applications table

---

## Cost Estimates

### Small Scale (< 10k users/month)
- **Vercel** (Frontend): Free tier
- **Railway** (Backend + DB + Redis): $20/month
- **Total**: ~$20/month

### Medium Scale (10k-100k users/month)
- **Vercel Pro**: $20/month
- **Railway Pro**: $50/month
- **CloudFlare Pro** (CDN): $20/month
- **Total**: ~$90/month

### Large Scale (> 100k users/month)
- **AWS**:
  - ECS Fargate (2 instances): $60/month
  - RDS PostgreSQL (db.t3.medium): $100/month
  - ElastiCache Redis: $50/month
  - CloudFront CDN: $50/month
  - S3 + misc: $20/month
- **Total**: ~$280/month

---

## Compliance & Certifications

### FERPA Compliance
- [ ] Implement data retention policies (7 years for FAFSA data)
- [ ] Create data access audit logs
- [ ] Implement right-to-delete functionality
- [ ] Annual security training for staff

### SOC 2 Type II Audit
- **Cost**: $15,000-50,000 for initial audit
- **Timeline**: 6-12 months
- **Requirements**:
  - Documented security policies
  - Access controls and monitoring
  - Incident response procedures
  - Third-party penetration testing

---

## Support & Maintenance

### Recommended Schedule
- **Daily**: Monitor error logs (Sentry)
- **Weekly**: Review performance metrics, user feedback
- **Monthly**: Security updates, dependency upgrades
- **Quarterly**: Penetration testing, compliance review
- **Annually**: SOC 2 audit, disaster recovery drill

### On-Call Rotation
- Set up PagerDuty or Opsgenie for critical alerts
- Response SLA: <15 minutes for P0, <2 hours for P1

---

## Rollback Procedures

```bash
# Vercel rollback
vercel rollback

# Railway rollback
railway rollback

# AWS ECS rollback
aws ecs update-service --cluster <cluster> --service <service> --task-definition <previous-version>
```

---

## Emergency Contacts

- **Infrastructure**: DevOps team (devops@example.com)
- **Security**: security@example.com
- **Legal/Compliance**: legal@example.com
- **Product Owner**: product@example.com

---

**Last Updated**: December 2024  
**Maintained By**: Engineering Team  
**Review Schedule**: Quarterly
