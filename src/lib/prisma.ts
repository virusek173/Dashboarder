import { PrismaClient } from "@/generated/prisma/client";

// PrismaClient singleton to prevent multiple connections in development
// Next.js hot-reloads modules, which would create new connections each time
// This pattern stores the client in globalThis to persist across reloads

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Check if client already exists in globalThis
const existingClient = globalForPrisma.prisma;

// Use existing client or create new one
export const prisma = existingClient ?? new PrismaClient();

// In development: store in globalThis for next hot-reload
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Debug: uncomment to see singleton behavior
// console.log("[Prisma] Using existing client:", !!existingClient);
