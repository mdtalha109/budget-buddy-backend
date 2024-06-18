import { mergeTypeDefs } from '@graphql-tools/merge';

import { userTypeDef } from './user.typedef';

export const mergedTypeDef = mergeTypeDefs([userTypeDef]);
