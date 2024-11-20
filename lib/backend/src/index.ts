import express, { Request, Response } from "express";
import customersRouter  from './routers/customer';
const app = express();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(express.json());

app.use('/customer', customersRouter);
// Root endpoint
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Express.js with TypeScript example!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});