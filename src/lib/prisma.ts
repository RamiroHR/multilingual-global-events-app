import { PrismaClient } from "@prisma/client";
import { config } from "@/config";

// variable to store a global object for prisma
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// set prisma as an existing or a new prismaClient instance
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasourceUrl: config.databaseUrl,
  });

// if the app is not in production, store prisma on the global object
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
