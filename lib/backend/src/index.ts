import express, { Request, Response } from "express";
const app = express();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(express.json());
// Root endpoint
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Express.js with TypeScript example!");
});
// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});