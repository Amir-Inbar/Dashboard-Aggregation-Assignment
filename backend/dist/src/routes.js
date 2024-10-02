"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRouter = createRouter;
const express_1 = require("express");
const aggregationSql = `
  SELECT
    COUNT(*) as count,
    AVG(avgRuntimeMillis) as avgRuntimeMillis,
    SUM(successfulCount) as successfulCount,
    SUM(clientErrorCount + serverErrorCount) as errorCount
  FROM snapshots
  WHERE createdAt >= ? AND createdAt <= ?
`;
function createRouter(db) {
    const router = (0, express_1.Router)();
    // Health check endpoint
    router.get('/hello-world', (_req, res) => {
        return res.json({ message: 'Hello, world!' });
    });
    // Get all snapshots
    router.get('/snapshots', async (_req, res) => {
        const sql = 'SELECT * FROM snapshots';
        try {
            const rows = await db.client.all(sql);
            return res.json({ data: rows });
        }
        catch (error) {
            console.error('Error fetching snapshots:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    });
    // Aggregation endpoint
    router.get('/aggregation', async (req, res) => {
        const { minDatetime, maxDatetime } = req.query;
        // Validate query parameters
        if (!minDatetime || !maxDatetime) {
            return res
                .status(400)
                .json({ message: 'minDatetime and maxDatetime are required' });
        }
        // Execute SQL query
        try {
            const rows = await db.client.all(aggregationSql, [
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
            const successfulRate = count > 0 ? (snapshot?.successfulCount || 0) / count : 0;
            const errorRate = count > 0 ? (snapshot?.errorCount || 0) / count : 0;
            // Send response with calculated data
            return res.json({
                count,
                successfulRate,
                errorRate,
                avgRuntimeMillis: snapshot?.avgRuntimeMillis || 0,
            });
        }
        catch (error) {
            console.error('Error executing aggregation query:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    });
    return router;
}
//# sourceMappingURL=routes.js.map