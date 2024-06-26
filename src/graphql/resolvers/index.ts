import { mergeResolvers } from '@graphql-tools/merge';
import { userResolvers } from './userResolvers';
import expenseResolvers from './expenseResolver';
import incomeResolvers from './incomeResolver';

const mergedResolvers = mergeResolvers([userResolvers, expenseResolvers, incomeResolvers]);

export { mergedResolvers };
