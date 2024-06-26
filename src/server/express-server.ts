import express, { Application } from 'express';

export async function createExpressApp(): Promise<Application> {
  const app = express();
  app.use(express.json());

  // Add other middlewares or configurations here

  return app;
}