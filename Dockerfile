# Multi-stage build for Next.js application

# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set dummy DATABASE_URL for Prisma Client generation (not used, just required)
ENV DATABASE_URL="file:/app/data/prod.db"

# Generate Prisma Client
RUN npx prisma generate

# Build arguments for NEXT_PUBLIC_ variables (required at build time)
ARG NEXT_PUBLIC_TEAM_NAME
ARG NEXT_PUBLIC_RELEASE_NUMBER
ARG NEXT_PUBLIC_TEAM_ICON

# Set as environment variables for Next.js build
ENV NEXT_PUBLIC_TEAM_NAME=$NEXT_PUBLIC_TEAM_NAME
ENV NEXT_PUBLIC_RELEASE_NUMBER=$NEXT_PUBLIC_RELEASE_NUMBER
ENV NEXT_PUBLIC_TEAM_ICON=$NEXT_PUBLIC_TEAM_ICON

# Build Next.js application
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/src/generated ./src/generated
COPY --from=builder /app/src/data ./src/data
COPY --from=builder /app/package*.json ./

# Install only Prisma CLI for migrations (as root before switching user)
RUN npm install prisma@~6.19.2 --omit=dev

# Create directory for SQLite database
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Run migrations and start the server
CMD ["sh", "-c", "./node_modules/.bin/prisma migrate deploy && node server.js"]
