"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const promised_sqlite3_1 = require("promised-sqlite3");
class DB {
    constructor() {
        Object.defineProperty(this, "client", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.client = new promised_sqlite3_1.AsyncDatabase(new sqlite3_1.default.Database(":memory:"));
    }
    async migrate() {
        const createTable = `CREATE TABLE snapshots (
      id                INTEGER PRIMARY KEY AUTOINCREMENT,
      count             INTEGER,
      successfulCount   INTEGER,
      clientErrorCount  INTEGER,
      serverErrorCount  INTEGER,
      avgRuntimeMillis  INTEGER,
      createdAt         TIMESTAMP(6) NOT NULL
    )`;
        await this.client.run(createTable);
    }
    async seed() {
        const insert = "INSERT INTO snapshots (count, successfulCount, clientErrorCount, serverErrorCount, avgRuntimeMillis, createdAt) VALUES (?,?,?,?,?,?)";
        await Promise.all([
            this.client.run(insert, [0, 0, 0, 0, 100, "2024-06-14 13:59:00"]),
            this.client.run(insert, [0, 0, 0, 0, 105, "2024-06-14 13:59:15"]),
            this.client.run(insert, [1, 1, 0, 0, 110, "2024-06-14 13:59:30"]),
            // Some missing data (i.e. representing a gap in reporting from Proxy)
            // this.client.run(insert, [1, 1, 0, 0, 110, "2024-06-14 13:59:45"]),
            // this.client.run(insert, [2, 2, 0, 0, 120, "2024-06-14 14:00:00"]),
            // this.client.run(insert, [5, 4, 1, 0, 120, "2024-06-14 14:00:15"]),
            this.client.run(insert, [8, 6, 1, 1, 95, "2024-06-14 14:00:30"]),
            this.client.run(insert, [8, 6, 1, 1, 95, "2024-06-14 14:00:45"]),
            this.client.run(insert, [9, 7, 1, 1, 90, "2024-06-14 14:01:00"]),
            this.client.run(insert, [20, 15, 3, 2, 85, "2024-06-14 14:01:15"]),
            this.client.run(insert, [21, 16, 3, 2, 95, "2024-06-14 14:01:30"]),
            this.client.run(insert, [21, 17, 2, 2, 90, "2024-06-14 14:01:45"]),
            this.client.run(insert, [22, 18, 2, 2, 100, "2024-06-14 14:02:00"]),
            this.client.run(insert, [23, 19, 2, 2, 105, "2024-06-14 14:02:15"]),
            this.client.run(insert, [25, 20, 3, 2, 110, "2024-06-14 14:02:30"]),
            this.client.run(insert, [25, 20, 3, 2, 115, "2024-06-14 14:02:45"]),
        ]);
    }
}
exports.DB = DB;
//# sourceMappingURL=database-async.js.map