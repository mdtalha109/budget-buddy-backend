import { PrismaClient, users as User } from '@prisma/client';
import { IUserRepository } from '../interfaces/IUserRepository';

export class UserRepository implements IUserRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findUserById(id: number): Promise<User | null> {
    return this.prisma.users.findUnique({ where: { id } });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.users.findUnique({ where: { email } });
  }

  async createUser(
    name: string,
    email: string,
    password: string,
  ): Promise<User> {
    return this.prisma.users.create({ data: { name, email, password } });
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    console.log('id: ', id);
    return this.prisma.users.update({ where: { id }, data });
  }

  async deleteUser(id: number): Promise<User> {
    return this.prisma.users.delete({ where: { id } });
  }

  async updatePassword(id: number, newPassword: string): Promise<User> {
    return this.prisma.users.update({
      where: { id },
      data: { password: newPassword },
    });
  }
}
