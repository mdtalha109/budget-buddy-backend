import { PrismaClient } from '@prisma/client';

export interface Context {
  req: {
    headers: {
      authorization?: string;
    };
  };
  prisma?: PrismaClient;
  userId?: number | null;
}
