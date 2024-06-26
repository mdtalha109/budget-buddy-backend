import { startServer } from "./server/start-server";

startServer().catch((error) => {
  console.error('Failed to start server:', error);
});