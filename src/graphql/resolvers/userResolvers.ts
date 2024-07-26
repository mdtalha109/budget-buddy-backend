import { IResolvers } from '@graphql-tools/utils';
import { UserService } from '../../services/userService';
import { UserRepository } from '../../repositories/UserRepository';
import { AuthUtils, withAuth, withAuthAndOwnership } from '../../utils/authUtils';
import prisma from '../../utils/prisma';
import { UpdateUserArgs } from '../../types/Resolver';
import { Context } from '../../types/middleware';
import { createResponse } from '../../utils/createResponse';
import logger from '../../utils/logger';
import { BaseError } from '../../errors/BaseError';

const userRepository = new UserRepository(prisma);
const authUtils = new AuthUtils();
const userService = new UserService({ userRepository, authUtils });

/**
 * GraphQL resolvers for user management.
 */

export const userResolvers: IResolvers = {
  Query: {
    /**
     * Get a user by ID.
     * @param _ - parent resolver
     * @param id - ID of the user to retrieve
     * @returns The user object
     */

    getUser: async (_, { id }) => {
      return userService.getUser(Number(id));
    },

    /**
     * Get the currently authenticated user.
     * @param _ - parent resolver
     * @param __ - arguments
     * @param context - context containing the authenticated user ID
     * @returns The authenticated user object
     */
  },
  Mutation: {
    /**
     * Register a new user.
     * @param _ - parent resolver
     * @param name - Name of the new user
     * @param email - Email of the new user
     * @param password - Password of the new user
     * @returns The authentication payload containing the token and user
     */
    register: async (_, { name, email, password }) => {
      return userService.register(name, email, password);
    },

    /**
     * Log in an existing user.
     * @param _ - parent resolver
     * @param email - Email of the user
     * @param password - Password of the user
     * @returns The authentication payload containing the token and user
     */
    login: async (_, { email, password }) => {
      return userService.login(email, password);
    },

    /**
     * Update an existing user.
     * @param _ - parent resolver
     * @param id - ID of the user to update
     * @param name - New name of the user
     * @param email - New email of the user
     * @param password - New password of the user
     * @returns The updated user object
     */
    updateUser: withAuthAndOwnership<UpdateUserArgs, unknown>(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async (_, {  name, email, password }, context: Context) => {
        let updatedUser = userService.updateUser(context.userId, name, email, password);
        return createResponse(true, updatedUser, 'User Updated successfully')
        
      },
    ),

    /**
     * Delete a user by ID.
     * @param _ - parent resolver
     * @param id - ID of the user to delete
     * @returns The deleted user object
     */
    deleteUser: async (_, { id }, context) => {
      if (!context.userId) {
        throw new Error('Not authenticated');
      }

      if (Number(id) !== context.userId) {
        throw new Error('Not authorized to update this user');
      }

      return userService.deleteUser(Number(id));
    },

    /**
     * update user's password by ID.
     * @param _ - parent resolver
     * @param id - ID of the user to update password
     * @param currentPassword - current password of the user
     * @param newPassword - new password of the user
     * @returns The updated user object
     */

    updatePassword: withAuth(async (_, {currentPassword, newPassword}, context) => {
      try {
        let updatedUserPassword = await userService.updatePassword(context.userId, currentPassword, newPassword);
        return createResponse(true, updatedUserPassword, 'Password updated successfully!')
      } catch (error) {
        handleError(error)
      }
    })
  },
};

function handleError(error: any) {
  if (error instanceof BaseError) {
    throw new Error(error.message);
  } else {
    throw new Error(error.message);
  }
}