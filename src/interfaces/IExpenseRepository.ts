import { expenses as Expense } from '@prisma/client';

export interface IExpenseRepository {
  getExpenses(userId: number): Promise<Expense[] | null>;
  getExpenseById(id: number, userId: number): Promise<Expense | null>;
  createExpense(userId: number, description: string, amount: number, date: Date, category?: string): Promise<Expense>;
  updateExpense(id: number, userId: number, description?: string, amount?: number, date?: Date, category?: string): Promise<Expense>;
  deleteExpense(id: number, userId: number): Promise<Expense>;
}
