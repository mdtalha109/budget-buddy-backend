/* eslint-disable @typescript-eslint/ban-types */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { IAuthUtils } from '../interfaces/IAuthUtils';
import { ResolverFn } from '../types/Resolver';
import { Context } from '../types/middleware';

// eslint-disable-next-line @typescript-eslint/no-explicit-any

export class AuthUtils implements IAuthUtils {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, config.bcryptSaltRounds);
  }

  async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  generateToken(userId: number): string {
    return jwt.sign({ userId }, config.jwtSecret);
  }
}

export const withAuth = <Args, Result>(
  resolver: ResolverFn<Args, Result>,
): ResolverFn<Args, Result> => {
  return async (parent, args, context: Context, info) => {
    if (!context.userId) {
      throw new Error('Not authenticated');
    }

    return resolver(parent, args, context, info);
  };
};

export const withAuthAndOwnership = <Args extends { id: string }, Result>(
  resolver: ResolverFn<Args, Result>,
): ResolverFn<Args, Result> => {
  return async (parent, args, context: Context, info) => {
    if (!context.userId) {
      throw new Error('Not authenticated');
    }

    if (Number(args.id) !== context.userId) {
      throw new Error('Not authorized to perform this action');
    }

    return resolver(parent, args, context, info);
  };
};
