import express, { Request, Response } from "express";
import { router } from './routers/router';
import { errorHandler } from "./Middleware/errorHandler";
const app = express();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(express.json());

app.use(router);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});