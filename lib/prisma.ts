import { PrismaClient } from "@prisma/client";

// Standard Next.js singleton pattern so we don't open a new Prisma Client
// (and a new DB connection) on every hot-reload in development.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
