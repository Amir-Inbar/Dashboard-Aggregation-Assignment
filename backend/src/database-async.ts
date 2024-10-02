import sqlite3 from 'sqlite3';
import { AsyncDatabase } from 'promised-sqlite3';

export class DB {
  client: AsyncDatabase;
  constructor() {
    this.client = new AsyncDatabase(new sqlite3.Database(':memory:'));
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
    const insert =
      'INSERT INTO snapshots (count, successfulCount, clientErrorCount, serverErrorCount, avgRuntimeMillis, createdAt) VALUES (?,?,?,?,?,?)';
    await Promise.all([
      // June 12 snapshots
      this.client.run(insert, [5, 4, 0, 1, 90, '2024-06-12 10:00:00']),
      this.client.run(insert, [6, 5, 0, 1, 100, '2024-06-12 10:15:00']),
      this.client.run(insert, [8, 6, 1, 1, 95, '2024-06-12 10:30:00']),
      this.client.run(insert, [9, 7, 1, 1, 90, '2024-06-12 11:00:00']),
      this.client.run(insert, [10, 8, 1, 1, 85, '2024-06-12 11:30:00']),

      // June 13 snapshots
      this.client.run(insert, [12, 10, 1, 1, 110, '2024-06-13 12:00:00']),
      this.client.run(insert, [14, 12, 1, 1, 115, '2024-06-13 12:30:00']),
      this.client.run(insert, [15, 13, 1, 1, 120, '2024-06-13 13:00:00']),
      this.client.run(insert, [16, 14, 2, 1, 125, '2024-06-13 13:30:00']),
      this.client.run(insert, [18, 15, 2, 1, 130, '2024-06-13 14:00:00']),

      // June 14 snapshots (from earlier examples, but with more added)
      this.client.run(insert, [0, 0, 0, 0, 100, '2024-06-14 13:59:00']),
      this.client.run(insert, [0, 0, 0, 0, 105, '2024-06-14 13:59:15']),
      this.client.run(insert, [1, 1, 0, 0, 110, '2024-06-14 13:59:30']),
      this.client.run(insert, [25, 20, 3, 2, 115, '2024-06-14 14:02:45']),
      this.client.run(insert, [30, 25, 4, 3, 125, '2024-06-14 14:03:15']),

      // June 15 snapshots
      this.client.run(insert, [12, 10, 2, 1, 90, '2024-06-15 09:00:00']),
      // this.client.run(insert, [14, 11, 2, 1, 95, '2024-06-15 09:30:00']),
      // this.client.run(insert, [18, 16, 2, 2, 110, '2024-06-15 10:00:00']),
      this.client.run(insert, [20, 17, 2, 3, 120, '2024-06-15 10:30:00']),
      this.client.run(insert, [22, 18, 3, 2, 130, '2024-06-15 11:00:00']),

      // June 16 snapshots
      this.client.run(insert, [6, 4, 1, 1, 95, '2024-06-16 08:00:00']),
      this.client.run(insert, [7, 5, 1, 1, 100, '2024-06-16 08:30:00']),
      // this.client.run(insert, [10, 8, 2, 2, 110, '2024-06-16 09:00:00']),
      // this.client.run(insert, [12, 9, 2, 3, 120, '2024-06-16 09:30:00']),
      this.client.run(insert, [15, 13, 3, 3, 130, '2024-06-16 10:00:00']),

      // June 17 snapshots
      this.client.run(insert, [4, 2, 0, 2, 80, '2024-06-17 07:30:00']),
      // this.client.run(insert, [5, 3, 1, 1, 90, '2024-06-17 08:00:00']),
      this.client.run(insert, [6, 4, 1, 1, 100, '2024-06-17 08:30:00']),
      this.client.run(insert, [8, 6, 1, 1, 110, '2024-06-17 09:00:00']),
      this.client.run(insert, [10, 8, 2, 2, 120, '2024-06-17 09:30:00']),

      // June 18 snapshots
      this.client.run(insert, [15, 12, 2, 1, 110, '2024-06-18 10:00:00']),
      this.client.run(insert, [18, 14, 3, 1, 115, '2024-06-18 10:30:00']),
      // this.client.run(insert, [20, 16, 3, 2, 120, '2024-06-18 11:00:00']),
      this.client.run(insert, [22, 18, 3, 2, 125, '2024-06-18 11:30:00']),
      this.client.run(insert, [25, 20, 4, 2, 130, '2024-06-18 12:00:00']),
    ]);
  }
}
