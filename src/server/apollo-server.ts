import { ApolloError, ApolloServer } from 'apollo-server-express';
import { mergedResolvers } from '../graphql/resolvers';
import { mergedTypeDef } from '../graphql/typeDefs';
import { BaseContext } from 'apollo-server-types';
import { context } from '../middleware/authMiddleware';

interface MyContext extends BaseContext {}

export async function createApolloServer(): Promise<ApolloServer<MyContext>> {
  const server = new ApolloServer<MyContext>({
    typeDefs: mergedTypeDef,
    resolvers: mergedResolvers,
    context: ({ req }) => context({ req }),
    formatError: (error) => {
      return new ApolloError(error.message);
    },
  });

  await server.start();
  return server;
}
