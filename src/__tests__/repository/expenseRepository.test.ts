import { PrismaClient, expenses as Expense } from '@prisma/client';
import { ExpenseRepository } from '../../repositories/ExpenseRepository';

jest.mock('@prisma/client', () => {
  const actualPrisma = jest.requireActual('@prisma/client');
  return {
    ...actualPrisma,
    PrismaClient: jest.fn().mockImplementation(() => ({
      expenses: {
        create: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
      },
    })),
  };
});

const prisma = new PrismaClient();
const expenseRepository = new ExpenseRepository(prisma);

describe('ExpenseRepository', () => {
  const userId = 1;
  const mockExpense: Expense = {
    id: 1,
    description: 'Test Expense',
    amount: 50.0,
    date: new Date('2023-06-22'),
    category: 'Test',
    userId,
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new expense', async () => {
    prisma.expenses.create = jest.fn().mockResolvedValue(mockExpense);

    const result = await expenseRepository.createExpense(
      userId,
      mockExpense.description,
      mockExpense.amount,
      mockExpense.date,
      mockExpense.category,
      mockExpense.recurringMetadata,
    );

    expect(prisma.expenses.create).toHaveBeenCalledWith({
      data: {
        userId,
        description: mockExpense.description,
        amount: mockExpense.amount,
        date: mockExpense.date,
        category: mockExpense.category,
        recurringMetadata: mockExpense.recurringMetadata,
      },
    });
    expect(result).toEqual(mockExpense);
  });

  it('should update an expense', async () => {
    prisma.expenses.update = jest.fn().mockResolvedValue(mockExpense);

    const result = await expenseRepository.updateExpense(
      mockExpense.id,
      userId,
      mockExpense.description,
      mockExpense.amount,
      mockExpense.date,
      mockExpense.category,
      mockExpense.recurringMetadata,
    );

    expect(prisma.expenses.update).toHaveBeenCalledWith({
      where: { id: mockExpense.id },
      data: {
        description: mockExpense.description,
        amount: mockExpense.amount,
        date: mockExpense.date,
        category: mockExpense.category,
        recurringMetadata: mockExpense.recurringMetadata,
      },
    });
    expect(result).toEqual(mockExpense);
  });

  it('should retrieve an expense by ID', async () => {
    prisma.expenses.findUnique = jest.fn().mockResolvedValue(mockExpense);

    const result = await expenseRepository.getExpenseById(
      mockExpense.id,
      userId,
    );

    expect(prisma.expenses.findUnique).toHaveBeenCalledWith({
      where: { id: mockExpense.id, userId: userId },
    });
    expect(result).toEqual(mockExpense);
  });

  it('should retrieve all expenses for a user', async () => {
    prisma.expenses.findMany = jest.fn().mockResolvedValue([mockExpense]);

    const result = await expenseRepository.getExpenses(userId);

    expect(prisma.expenses.findMany).toHaveBeenCalledWith({
      where: { userId },
    });
    expect(result).toEqual([mockExpense]);
  });

  it('should retrieve all expenses', async () => {
    prisma.expenses.findMany = jest.fn().mockResolvedValue([mockExpense]);

    const result = await expenseRepository.getExpenses(userId);

    expect(prisma.expenses.findMany).toHaveBeenCalledWith({
      where: { userId },
    });
    expect(result).toEqual([mockExpense]);
  });
});
