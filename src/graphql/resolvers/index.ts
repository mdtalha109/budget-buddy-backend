import { mergeResolvers } from '@graphql-tools/merge';
import { userResolvers } from './userResolvers';
import expenseResolvers from './expenseResolver';

const mergedResolvers = mergeResolvers([userResolvers, expenseResolvers]);

export { mergedResolvers };
