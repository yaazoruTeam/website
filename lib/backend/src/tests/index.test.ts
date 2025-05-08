import request from 'supertest';
import express from 'express';
import { router } from '../routers/router';
import { errorHandler } from '../middleware/errorHandler';

const app = express();
app.use(express.json());
app.use(router);
app.use(errorHandler);

describe('Express Server', () => {
  it('should respond with 404 for unknown routes', async () => {
    const response = await request(app).get('/unknown-route');
    expect(response.status).toBe(404);
  });

  it('should handle errors using the errorHandler middleware', async () => {
    app.get('/error', (req, res, next) => {
        const error = new Error('Test error');
        (error as any).status = 500;
        next(error);
      });
      
      app.use(errorHandler);      

    const response = await request(app).get('/error');
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toHaveProperty('message', 'Test error');
    expect(response.body.error).toHaveProperty('status', 500);
  });
});