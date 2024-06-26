import { incomes as Income } from '@prisma/client';

export interface IincomeRepository {
  createIncome(
    userId: number,
    description: string,
    amount: number,
    date: Date,
    category?: string,
  ): Promise<Income>;

  updateIncome(
    id: number,
    userId: number,
    description?: string,
    amount?: number,
    date?: Date,
    category?: string,
  ): Promise<Income | null>;

  getIncomes(userId: number): Promise<Income[] | null>;

  getIncomeById(id: number, userId: number): Promise<Income>;

  deleteIncome(id: number, userId: number): Promise<Income>;
}
