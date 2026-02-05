# Docker Deployment Guide

## Quick Start

```bash
# 1. Build and start the container
docker-compose up -d

# 2. View logs
docker-compose logs -f app

# 3. Stop the container
docker-compose down
```

## Setup Instructions

### 1. Environment Configuration

Docker Compose will automatically use the `.env.local` file. Make sure it contains all required variables:

```env
# Database - use this path for Docker:
DATABASE_URL=file:/app/data/prod.db

# JIRA Configuration
JIRA_BASE_URL=https://your-jira-server.com
JIRA_API_TOKEN=your-bearer-token-here
JIRA_STORY_POINTS_FIELD=customfield
JIRA_RESOLVED_STATUS=Solved

# SOCKS Proxy - IMPORTANT: Use host.docker.internal instead of localhost/127.0.0.1
SOCKS_PROXY_URL=socks5://host.docker.internal:12345

# Team Configuration
NEXT_PUBLIC_TEAM_NAME=TEAM
NEXT_PUBLIC_RELEASE_NUMBER=1
NEXT_PUBLIC_TEAM_ICON=🚀
```

**IMPORTANT changes for Docker:**

1. **DATABASE_URL**: Change to `file:/app/data/prod.db` (not `./prisma/dev.db`)

2. **SOCKS_PROXY_URL**: Change `127.0.0.1` or `localhost` to `host.docker.internal`
   ```env
   # ❌ Won't work in Docker:
   SOCKS_PROXY_URL=socks5://127.0.0.1:12345

   # ✅ Correct configuration for Docker:
   SOCKS_PROXY_URL=socks5://host.docker.internal:12345
   ```

   `host.docker.internal` is a special hostname that points to the host machine (your computer) from inside the Docker container.

### 2. Configuration Files

Before the first build, make sure you have the configuration files:

```bash
# Copy teams configuration
cp src/config/teams.example.json src/config/teams.json

# Copy tab configurations
cp src/config/tabs.example.json src/config/tabs.json
```

**Important:** The configuration files are copied into the Docker image during build. After changes to these files, you must rebuild the image:

```bash
docker-compose up -d --build
```

### 3. Build and Run

```bash
# Build and start in background
docker-compose up -d --build

# Start only (without rebuild)
docker-compose up -d
```

Application will be available at: http://localhost:3000

## Docker Networking

### Container → Host Communication

Docker container has its own network isolated from your machine (host). Therefore:

```
❌ localhost/127.0.0.1 in container = the container itself (NOT your machine)
✅ host.docker.internal = your machine (host)
```

**Example:**

```
┌─────────────────────────────────────────┐
│ Your machine (host)                     │
│                                          │
│  SOCKS Proxy: 127.0.0.1:12345           │
│                                          │
│  ┌─────────────────────────────────┐    │
│  │ Docker Container                 │    │
│  │                                  │    │
│  │ localhost = container ❌         │    │
│  │ host.docker.internal = host ✅   │    │
│  │                                  │    │
│  │ Next.js App → SOCKS Proxy        │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

**Configuration in docker-compose.yml:**

```yaml
extra_hosts:
  - "host.docker.internal:host-gateway"
```

This line ensures that `host.docker.internal` works on all platforms (Mac, Windows, Linux).

## Multi-Stage Build Explanation

Dockerfile uses 3-stage build:

1. **deps** - Install dependencies
2. **builder** - Build Next.js application
3. **runner** - Final image (runtime only)

**Benefits:**
- Smaller image size (~200MB vs ~500MB)
- Better caching (faster rebuilds)
- More secure (no source code in final image)

## Health Checks

Application has built-in health checks:

```bash
# Check status
docker inspect --format='{{.State.Health.Status}}' dashboarder-app

# View recent health check logs
docker inspect --format='{{range .State.Health.Log}}{{.Output}}{{end}}' dashboarder-app
```

## Production Considerations

- ✅ Uses `NODE_ENV=production`
- ✅ Automatic migration execution on startup
- ✅ Volume for data persistence
- ✅ Health checks for monitoring
- ✅ Restart policy: `unless-stopped`
- ✅ Non-root user for security

## Next Steps

1. Configure reverse proxy (nginx/traefik) for HTTPS
2. Set up backup schedule for database
3. Configure monitoring (Prometheus/Grafana)
4. Add CI/CD pipeline for automatic deployment
