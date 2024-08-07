import { PrismaClient, expenses as Expense } from '@prisma/client';
import { IExpenseRepository } from '../interfaces/IExpenseRepository';
import { RecurringMetadata } from '../types/expense';
import { JsonValue } from '@prisma/client/runtime/library';

export class ExpenseRepository implements IExpenseRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createExpense(
    userId: number,
    description: string,
    amount: number,
    date: Date,
    category: string,
    recurringMetadata?: JsonValue,
  ): Promise<Expense> {
    return this.prisma.expenses.create({
      data: {
        userId,
        description,
        amount,
        date,
        category,
        recurringMetadata: recurringMetadata,
      },
    });
  }

  async updateExpense(
    id: number,
    userId: number,
    description?: string,
    amount?: number,
    date?: Date,
    category?: string,
    recurringMetadata?: JsonValue,
  ): Promise<Expense> {
    return this.prisma.expenses.update({
      where: { id: id },
      data: {
        description,
        amount,
        date,
        category,
        recurringMetadata,
      },
    });
  }

  async deleteExpense(id: number, userId: number): Promise<Expense> {
    return this.prisma.expenses.delete({
      where: { id: id },
    });
  }

  async getExpenses(userId: number, startDate:string, endDate:string): Promise<Expense[]> {
    return this.prisma.expenses.findMany({
      where: { 
        userId: userId,
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      orderBy: [
        {
          createdAt: 'desc',
        },
      ]
    });
  }

  async getExpenseById(
    id: number,
    userId: number,
  ): Promise<Expense | null | undefined> {
    return this.prisma.expenses.findUnique({
      where: { id: id, userId: userId },
    });
  }

  async getRecurringExpenses(): Promise<Expense[]> {
    const allExpenses = await this.prisma.expenses.findMany({
      where: {
        NOT: {
          recurringMetadata: {},
        },
      },
    });

    const now = new Date();
    return allExpenses.filter((expense) => {
      const metadata = expense.recurringMetadata as { nextOccurrence?: string };
      return (
        metadata.nextOccurrence && new Date(metadata.nextOccurrence) <= now
      );
    });
  }

  async getTotalExpenses(userId: number, startDate:string, endDate:string): Promise<Number>{
    let total = await this.prisma.expenses.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        userId: userId,
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },

      },
    });

    return total._sum.amount || 0.00
  }
}
