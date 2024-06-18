import { mergeResolvers } from '@graphql-tools/merge';
import { userResolvers } from './userResolvers';

const mergedResolvers = mergeResolvers([userResolvers]);

export { mergedResolvers };
