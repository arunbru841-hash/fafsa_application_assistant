# FAFSA Assistant Kubernetes Deployment

This directory contains Kubernetes manifests for deploying the FAFSA Assistant application.

## Prerequisites

- Kubernetes cluster (1.25+)
- kubectl configured
- An ingress controller (nginx-ingress recommended)
- cert-manager (for automatic SSL certificates)

## Quick Start

### 1. Update Secrets

Before deploying, update the secrets in `secrets.yaml` and `postgres-statefulset.yaml` with your actual values.

**⚠️ IMPORTANT: Never commit real secrets to version control!**

For production, use one of these approaches:
- [Sealed Secrets](https://github.com/bitnami-labs/sealed-secrets)
- [External Secrets Operator](https://external-secrets.io/)
- [SOPS](https://github.com/mozilla/sops)
- Cloud provider secret management (AWS Secrets Manager, GCP Secret Manager, Azure Key Vault)

### 2. Update Image References

Edit `kustomization.yaml` to point to your container registry:

```yaml
images:
  - name: ghcr.io/your-org/fafsa-assistant/api
    newName: your-registry/fafsa-api
    newTag: v1.0.0
  - name: ghcr.io/your-org/fafsa-assistant/web
    newName: your-registry/fafsa-web
    newTag: v1.0.0
```

### 3. Update Ingress

Edit `ingress.yaml` to use your domain:

```yaml
spec:
  tls:
    - hosts:
        - your-domain.com
        - api.your-domain.com
```

### 4. Deploy

```bash
# Preview what will be applied
kubectl apply -k . --dry-run=client

# Apply all resources
kubectl apply -k .

# Watch deployment status
kubectl -n fafsa-assistant rollout status deployment/fafsa-api
kubectl -n fafsa-assistant rollout status deployment/fafsa-web
```

## Architecture

```
                    ┌─────────────┐
                    │   Ingress   │
                    │   (nginx)   │
                    └──────┬──────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
            ▼              ▼              │
     ┌──────────┐   ┌──────────┐          │
     │   Web    │   │   API    │          │
     │  (Next)  │   │ (Express)│          │
     │ 3 pods   │   │ 3 pods   │          │
     └──────────┘   └────┬─────┘          │
                         │                │
            ┌────────────┼────────────┐   │
            │            │            │   │
            ▼            ▼            │   │
     ┌──────────┐  ┌──────────┐       │   │
     │ PostgreSQL│ │  Redis   │       │   │
     │ (StatefulSet) │(Deployment)│   │   │
     └──────────┘  └──────────┘       │   │
```

## Components

| Component | Type | Replicas | Description |
|-----------|------|----------|-------------|
| fafsa-api | Deployment | 3 (HPA: 3-10) | Express.js API server |
| fafsa-web | Deployment | 3 (HPA: 3-10) | Next.js frontend |
| postgres | StatefulSet | 1 | PostgreSQL database |
| redis | Deployment | 1 | Redis cache |

## Resource Limits

| Component | CPU Request | CPU Limit | Memory Request | Memory Limit |
|-----------|-------------|-----------|----------------|--------------|
| API | 100m | 500m | 256Mi | 512Mi |
| Web | 100m | 500m | 256Mi | 512Mi |
| PostgreSQL | 250m | 1000m | 512Mi | 1Gi |
| Redis | 100m | 250m | 128Mi | 512Mi |

## Health Checks

### API Endpoints

| Endpoint | Purpose | Used By |
|----------|---------|---------|
| `/health` | Basic health | Load balancers |
| `/health/live` | Liveness probe | Kubernetes |
| `/health/ready` | Readiness probe | Kubernetes |
| `/health/detailed` | Metrics & diagnostics | Monitoring |

### Probe Configuration

- **Startup Probe**: 5s initial delay, checks `/health`
- **Liveness Probe**: 30s initial delay, 10s interval
- **Readiness Probe**: 10s initial delay, 5s interval

## Scaling

### Horizontal Pod Autoscaler (HPA)

Both API and Web deployments use HPA:
- Min replicas: 3
- Max replicas: 10
- CPU target: 70%
- Memory target: 80%

### Manual Scaling

```bash
# Scale API
kubectl -n fafsa-assistant scale deployment fafsa-api --replicas=5

# Scale Web
kubectl -n fafsa-assistant scale deployment fafsa-web --replicas=5
```

## Network Policies

Strict network policies are enforced:
- Default deny all traffic
- API can connect to: PostgreSQL, Redis, external HTTPS
- Web can connect to: API only
- All pods can perform DNS lookups

## Monitoring

### Prometheus Metrics

The API deployment is annotated for Prometheus scraping:

```yaml
annotations:
  prometheus.io/scrape: "true"
  prometheus.io/port: "3001"
  prometheus.io/path: "/health/detailed"
```

### Useful Commands

```bash
# View pod logs
kubectl -n fafsa-assistant logs -l app.kubernetes.io/name=fafsa-api -f

# Check pod status
kubectl -n fafsa-assistant get pods -o wide

# Describe deployment
kubectl -n fafsa-assistant describe deployment fafsa-api

# Check HPA status
kubectl -n fafsa-assistant get hpa

# Port forward for local access
kubectl -n fafsa-assistant port-forward svc/fafsa-api 3001:3001
kubectl -n fafsa-assistant port-forward svc/fafsa-web 3000:3000
```

## Troubleshooting

### Pods not starting

```bash
kubectl -n fafsa-assistant describe pod <pod-name>
kubectl -n fafsa-assistant logs <pod-name> --previous
```

### Database connection issues

```bash
kubectl -n fafsa-assistant exec -it deploy/fafsa-api -- sh
# Inside the pod:
nc -zv postgres 5432
```

### Network policy issues

```bash
# Temporarily disable network policies for debugging
kubectl -n fafsa-assistant delete networkpolicy --all
```

## Production Checklist

- [ ] Update all secrets with production values
- [ ] Configure proper storage class for PostgreSQL
- [ ] Set up external database (RDS, Cloud SQL) for high availability
- [ ] Configure Redis cluster or managed Redis
- [ ] Update ingress with production domain
- [ ] Configure cert-manager for SSL
- [ ] Set up monitoring (Prometheus, Grafana)
- [ ] Configure log aggregation (ELK, Loki)
- [ ] Set up alerting
- [ ] Configure backup for PostgreSQL
- [ ] Review and adjust resource limits
- [ ] Enable pod security policies/standards
