import jwt from 'jsonwebtoken';
import { config } from '../config';
import { Context } from '../types/middleware';

const getUserFromToken = (token: string): number | null => {
  try {
    if (token) {
      const decoded = jwt.verify(token, config.jwtSecret as string) as {
        userId: number;
      };
      return decoded.userId;
    }
    return null;
  } catch (err) {
    return null;
  }
};

export const context = ({ req }: { req: Context['req'] }): Context => {
  const token = req.headers.authorization?.replace('Bearer ', '') || '';
  const userId: number | null = getUserFromToken(token);
  return { req, userId };
};
