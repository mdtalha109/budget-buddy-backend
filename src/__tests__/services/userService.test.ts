import { UserService } from '../../services/userService';
import { UserRepository } from '../../repositories/UserRepository';
import { AuthUtils } from '../../utils/authUtils';
import prisma from '../../utils/prisma';

jest.mock('../../repositories/UserRepository');
jest.mock('../../utils/authUtils');

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;
  let authUtils: AuthUtils;

  beforeEach(() => {
    userRepository = new UserRepository(prisma);
    authUtils = new AuthUtils();
    userService = new UserService({ userRepository, authUtils });
  });

  it('should register a new user', async () => {
    const mockUser = {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'hashedpassword',
    };
    userRepository.createUser = jest.fn().mockResolvedValue(mockUser);
    authUtils.hashPassword = jest.fn().mockResolvedValue('hashedpassword');
    authUtils.generateToken = jest.fn().mockReturnValue('token');

    const result = await userService.register(
      'John Doe',
      'john.doe@example.com',
      'password123',
    );
    expect(result).toEqual({ token: 'token', user: mockUser });
  });

  it('should login an existing user', async () => {
    const mockUser = {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'hashedpassword',
    };
    userRepository.findUserByEmail = jest.fn().mockResolvedValue(mockUser);
    authUtils.comparePasswords = jest.fn().mockResolvedValue(true);
    authUtils.generateToken = jest.fn().mockReturnValue('token');

    const result = await userService.login(
      'john.doe@example.com',
      'password123',
    );
    expect(result).toEqual({ token: 'token', user: mockUser });
  });

  it('should not login a user with incorrect password', async () => {
    const mockUser = {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'hashedpassword',
    };
    userRepository.findUserByEmail = jest.fn().mockResolvedValue(mockUser);
    authUtils.comparePasswords = jest.fn().mockResolvedValue(false);
    await expect(
      userService.login('john.doe@example.com', 'wrongpassword'),
    ).rejects.toThrow('Invalid password');
  });

  it('should not login a non-existing user', async () => {
    userRepository.findUserByEmail = jest.fn().mockResolvedValue(null);
    await expect(
      userService.login('non.existing@example.com', 'password123'),
    ).rejects.toThrow('No user found with this email');
  });

  it('should update a user', async () => {
    const mockUser = {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'hashedpassword',
    };
    const updatedUser = { ...mockUser, name: 'Jane Doe' };
    userRepository.updateUser = jest.fn().mockResolvedValue(updatedUser);
    authUtils.hashPassword = jest.fn().mockResolvedValue('hashedpassword');

    const result = await userService.updateUser(
      1,
      'Jane Doe0',
      'john.doe@example.com',
      'password123',
    );
    expect(result).toEqual(updatedUser);
  });
});
