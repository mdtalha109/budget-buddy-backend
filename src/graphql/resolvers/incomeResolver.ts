import { IResolvers } from '@graphql-tools/utils';
import { IncomeService } from '../../services/incomeService';
import { withAuth } from '../../utils/authUtils';
import prisma from '../../utils/prisma';
import { Context } from '../../types/middleware';
import { BaseError } from '../../errors/BaseError';
import { IncomeRepository } from '../../repositories/incomeRepository';
import { createResponse } from '../../utils/createResponse';

const incomeRepository = new IncomeRepository(prisma);
const incomeService = new IncomeService({ incomeRepository });

const incomeResolvers: IResolvers = {
  Query: {
    getIncomes: withAuth(async (_, { startDate, endDate }, context: Context) => {
      try {
        let incomes = await incomeService.getIncomes(context.userId!, startDate, endDate);
        return createResponse(true, incomes, 'Expense fetched successfully')
      } catch (error) {
        handleError(error);
      }
    }),

    getIncomeById: withAuth(async (_, { id }, context: Context) => {
      try {
        return await incomeService.getIncomeById(context.userId!, Number(id));
      } catch (error) {
        handleError(error);
      }
    }),

    totalIncomes: withAuth(async (_, { startDate, endDate }: { startDate: string; endDate: string }, context: Context) => {
      try {
        const total = await prisma.incomes.aggregate({
          _sum: {
            amount: true,
          },
          where: {
            userId: context.userId,
            createdAt: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },

          },
        });
        return total._sum.amount || 0.00;
      } catch (error) {
        handleError(error);
      }
    }),
  },
  Mutation: {
    addIncome: withAuth(
      async (_, { description, amount, date, category }, context: Context) => {
        try {
          const newIncomes = await incomeService.addIncome(
            context.userId!,
            description,
            amount,
            new Date(date),
            category,
          );

          return createResponse(true, newIncomes, 'Income created successfully')

        } catch (error) {
          handleError(error);
        }
      },
    ),
    updateIncome: withAuth(
      async (
        _,
        { id, description, amount, date, category },
        context: Context,
      ) => {
        try {
          return await incomeService.updateIncome(
            context.userId!,
            Number(id),
            description,
            amount,
            date ? new Date(date) : undefined,
            category,
          );
        } catch (error) {
          handleError(error);
        }
      },
    ),
    deleteIncome: withAuth(async (_, { id }, context: Context) => {
      try {
        return await incomeService.deleteIncome(context.userId!, Number(id));
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

export default incomeResolvers;
