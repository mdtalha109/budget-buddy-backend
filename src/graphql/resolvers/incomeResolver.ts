import { IResolvers } from '@graphql-tools/utils';
import { IncomeService } from '../../services/incomeService';
import { withAuth } from '../../utils/authUtils';
import prisma from '../../utils/prisma';
import { Context } from '../../types/middleware';
import { BaseError } from '../../errors/BaseError';
import { IncomeRepository } from '../../repositories/incomeRepository';

const incomeRepository = new IncomeRepository(prisma);
const incomeService = new IncomeService({ incomeRepository });

const incomeResolvers: IResolvers = {
  Query: {
    getIncomes: withAuth(async (_, __, context: Context) => {
      try {
        return await incomeService.getIncomes(context.userId!);
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
  },
  Mutation: {
    addIncome: withAuth(
      async (_, { description, amount, date, category }, context: Context) => {
        try {
          return await incomeService.addIncome(
            context.userId!,
            description,
            amount,
            new Date(date),
            category,
          );
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
