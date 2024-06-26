import { IResolvers } from '@graphql-tools/utils';
import { ExpenseService } from '../../services/expenseService';
import { ExpenseRepository } from '../../repositories/ExpenseRepository';
import { withAuth, withAuthAndOwnership } from '../../utils/authUtils';
import prisma from '../../utils/prisma';
import { Context } from '../../types/middleware';
import { BaseError } from '../../errors/BaseError';
import { RecurringMetadata } from '../../types/expense';

const expenseRepository = new ExpenseRepository(prisma);
const expenseService = new ExpenseService({ expenseRepository });

const expenseResolvers: IResolvers = {
  Query: {
    getExpenses: withAuth(async (_, __, context: Context) => {
      try {
        return await expenseService.getExpenses(context.userId!);
      } catch (error) {
        handleError(error);
      }
    }),
    getExpenseById: withAuth(async (_, { id }, context: Context) => {
      try {
        return await expenseService.getExpenseById(context.userId!, Number(id));
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
          return await expenseService.addExpense(
            context.userId!,
            description,
            amount,
            new Date(date),
            category,
            recurringMetadata,
          );
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
          return await expenseService.updateExpense(
            context.userId!,
            Number(id),
            description,
            amount,
            date ? new Date(date) : undefined,
            category,
            recurringMetadata,
          );
        } catch (error) {
          handleError(error);
        }
      },
    ),
    deleteExpense: withAuth(async (_, { id }, context: Context) => {
      try {
        return await expenseService.deleteExpense(context.userId!, Number(id));
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
