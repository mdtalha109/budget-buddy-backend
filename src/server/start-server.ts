import { createExpressApp } from "./express-server";
import { createApolloServer } from "./apollo-server";

export async function startServer() {
  const app = await createExpressApp();
  const apolloServer = await createApolloServer();

  apolloServer.applyMiddleware({ app });

  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => console.log(`Server is started at port ${PORT}`));

  return app;
}