"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const routes_1 = require("../../src/routes");
describe('Aggregation Endpoint', () => {
    let app;
    let mockDB;
    beforeEach(() => {
        mockDB = {
            client: {
                all: jest.fn(), // Ensure this is a jest mock function
            },
        };
        app = (0, express_1.default)();
        app.use((0, routes_1.createRouter)(mockDB));
    });
    it('should return 400 if minDatetime or maxDatetime is missing', async () => {
        const response = await (0, supertest_1.default)(app).get('/aggregation');
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('minDatetime and maxDatetime are required');
    });
    it('should return 404 if no data is found', async () => {
        mockDB.client.all.mockResolvedValue([]); // Cast as jest.Mock
        const response = await (0, supertest_1.default)(app).get('/aggregation?minDatetime=2024-06-14%2000:00:00&maxDatetime=2024-06-14%2023:59:59');
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('No data found');
    });
    it('should return correct aggregation when data is found', async () => {
        mockDB.client.all.mockResolvedValue([
            {
                count: 10,
                avgRuntimeMillis: 100,
                successfulCount: 8,
                errorCount: 2,
            },
        ]);
        const response = await (0, supertest_1.default)(app).get('/aggregation?minDatetime=2024-06-14%2000:00:00&maxDatetime=2024-06-14%2023:59:59');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            count: 10,
            successfulRate: 0.8,
            errorRate: 0.2,
            avgRuntimeMillis: 100,
        });
    });
    it('should handle zero counts correctly', async () => {
        mockDB.client.all.mockResolvedValue([
            {
                count: 0,
                avgRuntimeMillis: 0,
                successfulCount: 0,
                errorCount: 0,
            },
        ]);
        const response = await (0, supertest_1.default)(app).get('/aggregation?minDatetime=2024-06-14%2000:00:00&maxDatetime=2024-06-14%2023:59:59');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            count: 0,
            successfulRate: 0,
            errorRate: 0,
            avgRuntimeMillis: 0,
        });
    });
});
//# sourceMappingURL=aggregation.test.js.map