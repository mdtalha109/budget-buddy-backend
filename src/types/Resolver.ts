/* eslint-disable @typescript-eslint/no-explicit-any */

import { GraphQLResolveInfo } from 'graphql';
import { Context } from './middleware';

export type ResolverFn<Args = any, Result = any> = (
  parent: unknown,
  args: Args,
  context: Context,
  info: GraphQLResolveInfo,
) => Promise<Result> | Result;

export interface UpdateUserArgs {
  id: string;
  name?: string;
  email?: string;
  password?: string;
}

export interface DeleteUserArgs {
  id: string;
}
