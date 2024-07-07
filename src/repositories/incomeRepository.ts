// src/repositories/IncomeRepository.ts

import { PrismaClient, incomes as Income } from '@prisma/client';
import { IincomeRepository } from '../interfaces/IincomeRepository';

export class IncomeRepository implements IincomeRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createIncome(
    userId: number,
    description: string,
    amount: number,
    date: Date,
    category?: string,
  ): Promise<Income> {
    return this.prisma.incomes.create({
      data: {
        userId,
        description,
        amount,
        date,
        category,
      },
    });
  }

  async updateIncome(
    id: number,
    userId: number,
    description?: string,
    amount?: number,
    date?: Date,
    category?: string,
  ): Promise<Income> {
    return this.prisma.incomes.update({
      where: { id: id },
      data: {
        description,
        amount,
        date,
        category,
      },
    });
  }

  async getIncomes(userId: number, startDate:string, endDate:string): Promise<Income[]> {
    return this.prisma.incomes.findMany({
      where: { 
        userId: userId,
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
       },
    });
  }

  async getIncomeById(id: number, userId: number): Promise<Income | null> {
    return this.prisma.incomes.findUnique({
      where: { id: id },
    });
  }

  async deleteIncome(id: number, userId: number): Promise<Income> {
    return this.prisma.incomes.delete({
      where: { id: id },
    });
  }
}
