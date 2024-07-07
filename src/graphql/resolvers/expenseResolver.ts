import { IResolvers } from '@graphql-tools/utils';
import { ExpenseService } from '../../services/expenseService';
import { ExpenseRepository } from '../../repositories/ExpenseRepository';
import { withAuth, withAuthAndOwnership } from '../../utils/authUtils';
import prisma from '../../utils/prisma';
import { Context } from '../../types/middleware';
import { BaseError } from '../../errors/BaseError';
import { RecurringMetadata } from '../../types/expense';
import { createResponse } from '../../utils/createResponse';

const expenseRepository = new ExpenseRepository(prisma);
const expenseService = new ExpenseService({ expenseRepository });

const expenseResolvers: IResolvers = {
  Query: {
    getExpenses: withAuth(async (_, { startDate, endDate }, context: Context) => {
      try {
        let expenses = await expenseService.getExpenses(context.userId!, startDate, endDate);
        return createResponse(true, expenses, 'Expense fetched successfully')
      } catch (error) {
        handleError(error);
      }
    }),
    getExpenseById: withAuth(async (_, { id }, context: Context) => {
      try {
        let expense = await expenseService.getExpenseById(context.userId!, Number(id));
        return createResponse(true, expense, 'Expense fetched successfully')
      } catch (error) {
        handleError(error);
      }
    }),
    totalExpenses: withAuth(async (_, { startDate, endDate }: { startDate: string; endDate: string }, context: Context) => {
      try {
        let total_expense = await expenseService.getTotalExpense(context.userId!, startDate, endDate)
        return createResponse(true, total_expense, 'Expense fetched successfully') 
      } catch (error) {
        handleError(error);
      }
    }),
  },
  Mutation: {
    addExpense: withAuth(
      async (
        _,
        {
          description,
          amount,
          date,
          category,
          frequency,
          interval,
          endDate,
          occurrences,
          nextOccurrence,
          paused,
        },
        context: Context,
      ) => {
        try {

          const recurringMetadata = {
            frequency,
            interval,
            endDate: endDate ? new Date(endDate).toISOString() : undefined,
            occurrences,
            nextOccurrence: nextOccurrence
              ? new Date(nextOccurrence).toISOString()
              : undefined,
            paused,
          };

          const newExpense = await expenseService.addExpense(
            context.userId!,
            description,
            amount,
            new Date(date),
            category,
            recurringMetadata,
          );

          return createResponse(true, newExpense, 'Expense created successfully')
        } catch (error) {
          handleError(error);
        }
      },
    ),
    updateExpense: withAuth(
      async (
        _,
        {
          id,
          description,
          amount,
          date,
          category,
          frequency,
          interval,
          endDate,
          occurrences,
          nextOccurrence,
          paused,
        },
        context: Context,
      ) => {
        try {
          const recurringMetadata = {
            frequency,
            interval,
            endDate: endDate ? new Date(endDate).toISOString() : undefined,
            occurrences,
            nextOccurrence: nextOccurrence
              ? new Date(nextOccurrence).toISOString()
              : undefined,
            paused,
          };
          let expense = await expenseService.updateExpense(
            context.userId!,
            Number(id),
            description,
            amount,
            date ? new Date(date) : undefined,
            category,
            recurringMetadata,
          );

          return createResponse(true, expense, 'Expense updated successfully')
        } catch (error) {
          handleError(error);
        }
      },
    ),
    deleteExpense: withAuth(async (_, { id }, context: Context) => {
      try {
        let deletedExpense = await expenseService.deleteExpense(context.userId!, Number(id));
        return createResponse(true, deletedExpense, 'Expense deleted successfully')
      } catch (error) {
        handleError(error);
      }
    }),

    pauseExpense: withAuthAndOwnership(async (_, { id }, context: Context) => {
      try {
        const expense = await expenseService.getExpenseById(
          context.userId!,
          Number(id),
        );
        if (expense && expense.recurringMetadata) {
          const metadata = expense.recurringMetadata as any;
          metadata.paused = true;
          return await expenseService.updateExpense(
            context.userId!,
            Number(id),
            expense.description,
            expense.amount,
            expense.date,
            expense.category,
            metadata,
          );
        }
      } catch (error) {
        handleError(error);
      }
    }),

    resumeExpense: withAuthAndOwnership(async (_, { id }, context: Context) => {
      try {
        const expense = await expenseService.getExpenseById(
          context.userId!,
          Number(id),
        );
        if (expense && expense.recurringMetadata) {
          const metadata = expense.recurringMetadata as any;
          metadata.paused = false;
          return await expenseService.updateExpense(
            context.userId!,
            Number(id),
            expense.description,
            expense.amount,
            expense.date,
            expense.category,
            metadata,
          );
        }
      } catch (error) {
        handleError(error);
      }
    }),
  },
};

function handleError(error: any) {
  if (error instanceof BaseError) {
    throw new Error(JSON.stringify(error));
  } else {
    throw new Error(`Unknown error: ${error.message}`);
  }
}

export default expenseResolvers;
