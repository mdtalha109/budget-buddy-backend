import { ExpenseService } from '../../services/expenseService';
import { ExpenseRepository } from '../../repositories/ExpenseRepository';
import prisma from '../../utils/prisma';
import { expenses as Expense } from '@prisma/client';

jest.mock('../../repositories/ExpenseRepository');

describe('ExpenseService', () => {
  let expenseService: ExpenseService;
  let expenseRepository: ExpenseRepository;

  beforeEach(() => {
    expenseRepository = new ExpenseRepository(prisma);
    expenseService = new ExpenseService({ expenseRepository });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addExpense', () => {
    it('should add a new expense', async () => {
      const mockExpense: Expense = {
        id: 1,
        description: 'Test',
        amount: 100,
        date: new Date(),
        category: 'Test',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        recurringMetadata: {
          frequency: 'monthly',
          interval: 1,
          endDate: new Date('2023-12-22').toISOString(),
          occurrences: 6,
          currentOccurrence: 1,
          nextOccurrence: new Date('2023-07-22').toISOString(),
          paused: false,
        },
      };

      expenseRepository.createExpense = jest
        .fn()
        .mockResolvedValue(mockExpense);

      const result = await expenseService.addExpense(
        1,
        'Test',
        100,
        new Date(),
        'Test',
        {},
      );
      console.log('result: ', result);
      expect(result).toEqual(mockExpense);
      expect(expenseRepository.createExpense).toHaveBeenCalledWith(
        1,
        'Test',
        100,
        expect.any(Date),
        'Test',
        {},
      );
    });
  });

  describe('updateExpense', () => {
    it('should update an existing expense', async () => {
      const mockDate = new Date();
      const mockExpense: Expense = {
        id: 1,
        description: 'Updated',
        amount: 150,
        date: mockDate,
        category: 'Updated',
        userId: 1,
        createdAt: mockDate,
        updatedAt: mockDate,
        recurringMetadata: {},
      };
      expenseRepository.updateExpense = jest
        .fn()
        .mockResolvedValue(mockExpense);

      const result = await expenseService.updateExpense(
        1,
        1,
        'Updated',
        150,
        mockDate,
        'Updated',
        {},
      );
      expect(result).toEqual(mockExpense);
      expect(expenseRepository.updateExpense).toHaveBeenCalledWith(
        1,
        1,
        'Updated',
        150,
        mockDate,
        'Updated',
        {},
      );
    });
  });

  describe('getExpenses', () => {
    it('should return all expenses for a user', async () => {
      const mockDate = new Date();
      const mockExpenses: Expense[] = [
        {
          id: 1,
          description: 'Test1',
          amount: 100,
          date: mockDate,
          category: 'Test',
          userId: 1,
          createdAt: mockDate,
          updatedAt: mockDate,
          recurringMetadata: {},
        },
        {
          id: 2,
          description: 'Test2',
          amount: 200,
          date: mockDate,
          category: 'Test',
          userId: 1,
          createdAt: mockDate,
          updatedAt: mockDate,
          recurringMetadata: {},
        },
      ];
      expenseRepository.getExpenses = jest.fn().mockResolvedValue(mockExpenses);

      const result = await expenseService.getExpenses(1);
      expect(result).toEqual(mockExpenses);
      expect(expenseRepository.getExpenses).toHaveBeenCalledWith(1);
    });
  });

  describe('getExpenseById', () => {
    it('should return a specific expense by id', async () => {
      const mockDate = new Date();
      const mockExpense: Expense = {
        id: 1,
        description: 'Test',
        amount: 100,
        date: mockDate,
        category: 'Test',
        userId: 1,
        createdAt: mockDate,
        updatedAt: mockDate,
        recurringMetadata: {
          frequency: 'monthly',
          interval: 1,
          endDate: new Date('2023-12-22').toISOString(),
          occurrences: 6,
          currentOccurrence: 1,
          nextOccurrence: new Date('2023-07-22').toISOString(),
          paused: false,
        },
      };
      expenseRepository.getExpenseById = jest
        .fn()
        .mockResolvedValue(mockExpense);

      const result = await expenseService.getExpenseById(1, 1);
      expect(result).toEqual(mockExpense);
      expect(expenseRepository.getExpenseById).toHaveBeenCalledWith(1, 1);
    });
  });
});
