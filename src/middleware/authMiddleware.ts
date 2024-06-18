// src/middleware/authMiddleware.ts

import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

export interface Context {
  req: {
    headers: {
      authorization?: string;
    };
  };
  prisma: PrismaClient;
  userId: number | null;
}

/**
 * Extract user ID from token.
 * @param token - JWT token
 * @returns User ID or null if verification fails
 */

const getUserFromToken = (token: string) => {
  try {
    if (token) {
      const { userId } = jwt.verify(
        token,
        process.env.JWT_SECRET as string,
      ) as { userId: number };
      return userId;
    }
    return null;
  } catch (err) {
    return null;
  }
};

/**
 * Context function to set up the context for each request.
 * @param req - Request object
 * @returns Context containing the user ID
 */

export const context = ({
  req,
  prisma,
}: {
  req: Context['req'];
  prisma: PrismaClient;
}): Context => {
  const token = req.headers.authorization || '';
  const userId = getUserFromToken(token);
  return { req, prisma, userId };
};
