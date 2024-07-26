import { IUserRepository } from '../interfaces/IUserRepository';
import { IAuthUtils } from '../interfaces/IAuthUtils';
import { users as User } from '@prisma/client';
import { ValidationError } from '../errors/ValidationError';

interface UserServiceDependencies {
  userRepository: IUserRepository;
  authUtils: IAuthUtils;
}

/**
 * Service for user management.
 */

export class UserService {
  private userRepository: IUserRepository;
  private authUtils: IAuthUtils;

  constructor({ userRepository, authUtils }: UserServiceDependencies) {
    this.userRepository = userRepository;
    this.authUtils = authUtils;
  }

  /**
   * Get a user by ID.
   * @param id - ID of the user to retrieve
   * @returns The user object or null if not found
   */
  async getUser(id: number): Promise<User | null> {
    return this.userRepository.findUserById(id);
  }

  /**
   * Register a new user.
   * @param name - Name of the new user
   * @param email - Email of the new user
   * @param password - Password of the new user
   * @returns The authentication payload containing the token and user
   */
  async register(
    name: string,
    email: string,
    password: string,
  ): Promise<{ token: string; user: User }> {
    const existingUser = await this.userRepository.findUserByEmail(email);
    if (existingUser) {
      throw new Error('Email already in use');
    }
    const hashedPassword = await this.authUtils.hashPassword(password);
    const user = await this.userRepository.createUser(
      name,
      email,
      hashedPassword,
    );
    const token = this.authUtils.generateToken(user.id);
    return { token, user };
  }

  /**
   * Log in an existing user.
   * @param email - Email of the user
   * @param password - Password of the user
   * @returns The authentication payload containing the token and user
   */

  async login(
    email: string,
    password: string,
  ): Promise<{ token: string; user: User }> {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new Error('No user found with this email');
    }

    const valid = await this.authUtils.comparePasswords(
      password,
      user.password,
    );
    if (!valid) {
      throw new Error('Invalid password');
    }

    const token = this.authUtils.generateToken(user.id);
    return { token, user };
  }

  /**
   * Update an existing user.
   * @param id - ID of the user to update
   * @param name - New name of the user (optional)
   * @param email - New email of the user (optional)
   * @param password - New password of the user (optional)
   * @returns The updated user object
   */

  async updateUser(
    id: number,
    name?: string,
    email?: string,
    password?: string,
  ): Promise<User> {
    const data: { name?: string; email?: string; password?: string } = {};
    if (name) data.name = name;
    if (email) data.email = email;
    if (password) data.password = await this.authUtils.hashPassword(password);

    return this.userRepository.updateUser(id, data);
  }

  /**
   * Delete a user by ID.
   * @param id - ID of the user to delete
   * @returns The deleted user object
   */
  async deleteUser(id: number): Promise<User> {
    return this.userRepository.deleteUser(id);
  }


  /**
   * Update user's password.
   * @param id - ID of the user
   * @param currentPassword - old password of the user
   * @param newPassword - New password of the user
   * @returns The updated user object
   */
  async updatePassword(id: number, currentPassword: string, newPassword: string): Promise<User> {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new Error('No user found with this email');
    }
    const valid = await this.authUtils.comparePasswords(
      currentPassword,
      user.password,
    );
    if (!valid) {
      throw new ValidationError('Current Password is not correct');
    }
    const hashedPassword = await this.authUtils.hashPassword(newPassword);
    return this.userRepository.updatePassword(id, hashedPassword);
  }
  
}
