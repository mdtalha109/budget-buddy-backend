import { users as User } from '@prisma/client';

export interface IUserRepository {
  findUserById(id: number): Promise<User | null>;
  findUserByEmail(email: string): Promise<User | null>;
  createUser(name: string, email: string, password: string): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User>;
  deleteUser(id: number): Promise<User>;
}
