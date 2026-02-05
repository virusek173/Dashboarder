# syntax=docker/dockerfile:1
# Multi-stage build for Next.js application

# Stage 1: Builder (combined deps + build)
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies with BuildKit cache mount
RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline

# Copy source files
COPY . .

# Set dummy DATABASE_URL for Prisma Client generation
ENV DATABASE_URL="file:/app/data/prod.db"

# Generate Prisma Client for Linux Alpine
RUN npx prisma generate

# Build arguments for NEXT_PUBLIC_ variables (required at build time)
ARG NEXT_PUBLIC_TEAM_NAME
ARG NEXT_PUBLIC_RELEASE_NUMBER
ARG NEXT_PUBLIC_TEAM_ICON
ARG NEXT_PUBLIC_JIRA_BASE_URL

# Set as environment variables for Next.js build
ENV NEXT_PUBLIC_TEAM_NAME=$NEXT_PUBLIC_TEAM_NAME \
    NEXT_PUBLIC_RELEASE_NUMBER=$NEXT_PUBLIC_RELEASE_NUMBER \
    NEXT_PUBLIC_TEAM_ICON=$NEXT_PUBLIC_TEAM_ICON \
    NEXT_PUBLIC_JIRA_BASE_URL=$NEXT_PUBLIC_JIRA_BASE_URL \
    NEXT_TELEMETRY_DISABLED=1

# Build Next.js application
RUN npm run build

# Stage 2: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/src/generated ./src/generated
COPY --from=builder /app/src/config ./src/config
COPY --from=builder /app/package*.json ./

# Create directory for SQLite database and install Prisma CLI for migrations
RUN --mount=type=cache,target=/root/.npm \
    mkdir -p /app/data && \
    npm install prisma@~6.19.2 --omit=dev --prefer-offline --no-audit --no-fund && \
    npm cache clean --force && \
    chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000 \
    HOSTNAME="0.0.0.0"

# Run migrations and start the server
CMD ["sh", "-c", "./node_modules/.bin/prisma migrate deploy && node server.js"]
