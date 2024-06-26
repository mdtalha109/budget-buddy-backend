import { expenses as Expense } from "@prisma/client";
import { IExpenseRepository } from "../interfaces/IExpenseRepository";
import { RecurringMetadata } from "../types/expense";
import { JsonValue } from "@prisma/client/runtime/library";

interface IExpenseServiceDependecies {
    expenseRepository: IExpenseRepository
}


/**
 * Service for expense management
 */

export class ExpenseService {
    private expenseRepository: IExpenseRepository;

    constructor({ expenseRepository }: IExpenseServiceDependecies) {
        this.expenseRepository = expenseRepository;
    }

    async addExpense(userId: number, description: string, amount: number, date: Date, category?: string, recurringMetadata?: JsonValue): Promise<Expense> {
        return this.expenseRepository.createExpense(userId, description, amount, date, category, recurringMetadata);
    }

    async updateExpense(userId: number, id: number, description?: string, amount?: number, date?: Date, category?: string, recurringMetadata?: JsonValue): Promise<Expense> {
        return this.expenseRepository.updateExpense(id, userId, description, amount, date, category, recurringMetadata);
    }

    async deleteExpense(userId: number, id: number): Promise<Expense> {
        return this.expenseRepository.deleteExpense(id, userId);
    }

    async getExpenses(userId: number): Promise<Expense[] | null> {
        return this.expenseRepository.getExpenses(userId);
    }

    async getExpenseById(userId: number, id: number): Promise<Expense | null> {
        return this.expenseRepository.getExpenseById(id, userId);
    }

    async getRecurringExpenses(): Promise<Expense[]> {
        return this.expenseRepository.getRecurringExpenses();
    }
}