import request from 'supertest';
import express from 'express';
import { createRouter } from '../../src/routes';
import { DB } from '../../src/database-async';

describe('Aggregation Endpoint', () => {
  let app: express.Application;
  let mockDB: jest.Mocked<DB>;

  beforeEach(() => {
    mockDB = {
      client: {
        all: jest.fn(),
      },
    } as unknown as jest.Mocked<DB>;

    app = express();
    app.use(createRouter(mockDB));
  });

  it('should return 400 if minDatetime or maxDatetime is missing', async () => {
    const response = await request(app).get('/aggregation');
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      'minDatetime and maxDatetime are required'
    );
  });

  it('should return 404 if no data is found', async () => {
    (mockDB.client.all as jest.Mock).mockResolvedValue([]);

    const response = await request(app).get(
      '/aggregation?minDatetime=2024-06-14%2000:00:00&maxDatetime=2024-06-14%2023:59:59'
    );
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('No data found');
  });

  it('should return correct aggregation when data is found', async () => {
    (mockDB.client.all as jest.Mock).mockResolvedValue([
      {
        count: 10,
        avgRuntimeMillis: 100,
        successfulCount: 8,
        errorCount: 2,
      },
    ]);

    const response = await request(app).get(
      '/aggregation?minDatetime=2024-06-14%2000:00:00&maxDatetime=2024-06-14%2023:59:59'
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      count: 10,
      successfulRate: 0.8,
      errorRate: 0.2,
      avgRuntimeMillis: 100,
    });
  });

  it('should handle zero counts correctly', async () => {
    (mockDB.client.all as jest.Mock).mockResolvedValue([
      {
        count: 0,
        avgRuntimeMillis: 0,
        successfulCount: 0,
        errorCount: 0,
      },
    ]);

    const response = await request(app).get(
      '/aggregation?minDatetime=2024-06-14%2000:00:00&maxDatetime=2024-06-14%2023:59:59'
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      count: 0,
      successfulRate: 0,
      errorRate: 0,
      avgRuntimeMillis: 0,
    });
  });
});
