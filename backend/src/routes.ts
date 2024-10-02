import { Router, Request, Response } from 'express';
import { DB } from './database-async';

// Define a TypeScript interface for the snapshot data
interface Snapshot {
  count: number;
  avgRuntimeMillis: number;
  successfulCount: number;
  errorCount: number;
}

const aggregationSql = `
  SELECT
    COUNT(*) as count,
    AVG(avgRuntimeMillis) as avgRuntimeMillis,
    SUM(successfulCount) as successfulCount,
    SUM(clientErrorCount + serverErrorCount) as errorCount
  FROM snapshots
  WHERE createdAt >= ? AND createdAt <= ?
`;

export function createRouter(db: DB) {
  const router = Router();

  // Health check endpoint
  router.get('/hello-world', (_req: Request, res: Response) => {
    return res.json({ message: 'Hello, world!' });
  });

  // Get all snapshots
  router.get('/snapshots', async (_req: Request, res: Response) => {
    const sql = 'SELECT * FROM snapshots';
    try {
      const rows = await db.client.all<Snapshot[]>(sql);
      return res.json({ data: rows });
    } catch (error) {
      console.error('Error fetching snapshots:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Aggregation endpoint
  router.get('/aggregation', async (req: Request, res: Response) => {
    const { minDatetime, maxDatetime } = req.query;

    // Validate query parameters
    if (!minDatetime || !maxDatetime) {
      return res
        .status(400)
        .json({ message: 'minDatetime and maxDatetime are required' });
    }

    // Execute SQL query
    try {
      const rows = await db.client.all<Snapshot>(aggregationSql, [
        minDatetime,
        maxDatetime,
      ]);

      // If no data found, return 404
      if (!rows.length) {
        return res.status(404).json({ message: 'No data found' });
      }

      const snapshot = rows[0];
      const count = snapshot?.count || 0;

      // Calculate success and error rates
      const successfulRate =
        count > 0 ? (snapshot?.successfulCount || 0) / count : 0;
      const errorRate = count > 0 ? (snapshot?.errorCount || 0) / count : 0;

      // Send response with calculated data
      return res.json({
        count,
        successfulRate,
        errorRate,
        avgRuntimeMillis: snapshot?.avgRuntimeMillis || 0,
      });
    } catch (error) {
      console.error('Error executing aggregation query:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.get('/aggregation/date', async (_req: Request, res: Response) => {
    const minQuery = `SELECT MIN(createdAt) as minDate FROM snapshots`;
    const maxQuery = `SELECT MAX(createdAt) as maxDate FROM snapshots`;

    try {
      const minDateResult = await db.client.get<{ minDate: string }>(minQuery);
      const maxDateResult = await db.client.get<{ maxDate: string }>(maxQuery);

      return res.json({
        minDate: minDateResult.minDate,
        maxDate: maxDateResult.maxDate,
      });
    } catch (error) {
      console.error('Error fetching min/max dates:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

  return router;
}
