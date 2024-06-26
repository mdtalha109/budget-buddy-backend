import { mergeTypeDefs } from '@graphql-tools/merge';

import { userTypeDef } from './user.typedef';
import { expenseTypeDef } from './expense.typedef';
import { incomeTypeDef } from './income.typedef';

export const mergedTypeDef = mergeTypeDefs([
  userTypeDef,
  expenseTypeDef,
  incomeTypeDef,
]);
