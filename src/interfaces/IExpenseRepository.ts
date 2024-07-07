import { expenses as Expense } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';

export interface IExpenseRepository {
  getExpenses(userId: number, startDate:string, endDate:string): Promise<Expense[] | null>;
  getExpenseById(id: number, userId: number): Promise<Expense | null>;
  createExpense(
    userId: number,
    description: string,
    amount: number,
    date: Date,
    category?: string,
    recurringMetadata?: JsonValue,
  ): Promise<Expense>;
  updateExpense(
    id: number,
    userId: number,
    description?: string,
    amount?: number,
    date?: Date,
    category?: string,
    recurringMetadata?: JsonValue,
  ): Promise<Expense>;
  deleteExpense(id: number, userId: number): Promise<Expense>;
  getRecurringExpenses(): Promise<Expense[]>;
}
