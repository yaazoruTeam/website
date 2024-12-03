import express, { Request, Response } from "express";
import { router } from './routers/router';
const app = express();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(express.json());

app.use(router);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});