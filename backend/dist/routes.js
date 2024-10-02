"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRouter = createRouter;
const express_1 = require("express");
const sql = `
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
    // An endpoint to make sure server is running properly
    router.get('/hello-world', (_req, res) => {
        return res.json({ message: 'Hello, world!' });
    });
    // An endpoint to get all snapshots
    router.get('/snapshots', async (_req, res) => {
        const sql = 'SELECT * FROM snapshots';
        const rows = await db.client.all(sql);
        return res.json({ data: rows });
    });
    router.get('/aggregation', async (req, res) => {
        const { minDatetime, maxDatetime } = req.query;
        console.log('Received minDatetime:', minDatetime, 'maxDatetime:', maxDatetime);
        if (!minDatetime || !maxDatetime) {
            return res
                .status(400)
                .json({ message: 'minDatetime and maxDatetime are required' });
        }
        // Execute SQL query and log errors if any
        try {
            const rows = await db.client.all(sql, [
                minDatetime,
                maxDatetime,
            ]);
            // Check if rows are returned and log the output
            console.log('Query result rows:', rows);
            if (!rows.length) {
                return res.status(404).json({ message: 'No data found' });
            }
            const snapshot = rows[0];
            const count = snapshot?.count || 0;
            const successfulRate = count > 0 ? snapshot?.successfulCount || 0 / count : 0;
            const errorRate = count > 0 ? snapshot?.errorCount || 0 / count : 0;
            return res.json({
                count,
                successfulRate,
                errorRate,
                avgRuntimeMillis: snapshot?.avgRuntimeMillis || 0,
            });
        }
        catch (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    });
    return router;
}
//# sourceMappingURL=routes.js.map