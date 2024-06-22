import { PrismaClient, expenses as Expense } from '@prisma/client';
import { IExpenseRepository } from '../interfaces/IExpenseRepository';

export class ExpenseRepository implements IExpenseRepository {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async createExpense(userId: number, description: string, amount: number, date: string, category: string): Promise<Expense> {
        return this.prisma.expenses.create({
            data: {
                userId,
                description,
                amount,
                date,
                category,
            },
        });
    }

    async updateExpense(id: number, userId: number, description?: string, amount?: number, date?: string, category?: string): Promise<Expense> {
        return this.prisma.expenses.update({
            where: { id: id, userId: userId },
            data: {
                description,
                amount,
                date,
                category,
            },
        });
    }

    async deleteExpense(id: number, userId: number): Promise<Expense> {
        return this.prisma.expenses.delete({
            where: { id: id, userId: userId },
        });
    }

    async getExpenses(userId: number): Promise<Expense[]> {
        return this.prisma.expenses.findMany({
            where: { userId },
        });
    }

    async getExpenseById(id: number, userId: number): Promise<Expense | null> {
        return this.prisma.expenses.findUnique({
            where: { id: id, userId: userId },
        });
    }
}