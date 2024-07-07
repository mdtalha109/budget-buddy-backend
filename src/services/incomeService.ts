// src/services/IncomeService.ts

import { IncomeRepository } from '../repositories/incomeRepository';
import { incomes as Income } from '@prisma/client';
import { incomeSchema } from '../validators/incomeValidator';
import { ValidationError } from '../errors/ValidationError';
import logger from '../utils/logger';

interface IncomeServiceDependencies {
  incomeRepository: IncomeRepository;
}

export class IncomeService {
  private incomeRepository: IncomeRepository;

  constructor({ incomeRepository }: IncomeServiceDependencies) {
    this.incomeRepository = incomeRepository;
  }

  async addIncome(
    userId: number,
    description: string,
    amount: number,
    date: Date,
    category?: string,
  ): Promise<Income> {
    const { error } = incomeSchema.validate({
      description,
      amount,
      date,
      category,
    });
    if (error) {
      logger.error(`Validation failed: ${error.message}`);
      throw new ValidationError(`Validation failed: ${error.message}`);
    }

    console.log("here")
    const income = await this.incomeRepository.createIncome(
      userId,
      description,
      amount,
      date,
      category,
    );
    logger.info(`Income added: ${income.id}`);
    return income;
  }

  async updateIncome(
    userId: number,
    id: number,
    description?: string,
    amount?: number,
    date?: Date,
    category?: string,
  ): Promise<Income> {
    const { error } = incomeSchema.validate(
      { description, amount, date, category },
      { allowUnknown: true },
    );
    if (error) {
      logger.error(`Validation failed: ${error.message}`);
      throw new ValidationError(`Validation failed: ${error.message}`);
    }
    const income = await this.incomeRepository.updateIncome(
      id,
      userId,
      description,
      amount,
      date,
      category,
    );
    logger.info(`Income updated: ${income.id}`);
    return income;
  }

  async getIncomes(userId: number, startDate: string, endDate: string): Promise<Income[]> {
    return this.incomeRepository.getIncomes(userId, startDate, endDate);
  }

  async getIncomeById(userId: number, id: number): Promise<Income | null> {
    return this.incomeRepository.getIncomeById(id, userId);
  }

  async deleteIncome(userId: number, id: number): Promise<Income> {
    const income = await this.incomeRepository.deleteIncome(id, userId);
    logger.info(`Income deleted: ${income.id}`);
    return income;
  }
}
