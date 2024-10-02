# Dashboard Aggregation Assignment

## Screenshots

![image](https://github.com/user-attachments/assets/da70eef6-d68d-4832-9da6-0109d1361c55)

## Installation

To run this application locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/Amir-Inbar/Dashboard-Aggregation-Assignment.git
   ```

2. Access the project.

   ```bash
   cd Dashboard-Aggregation-Assignment

   ```

3. Setup backend environment

   ```bash
    cd backend

   ```

4. Install backend dependencies.

   ```bash
    npm install

   ```

5. Start the backend development server.

   ```bash
   npm run start

   ```

6. The backend will run on port 3000.

7. Setup Frontend environment

   ```bash
    cd frontend

   ```

8. Install Frontend dependencies.

   ```bash
    npm install

   ```

9. Start the Frontend development server.

   ```bash
   npm run dev

   ```

10. The Frontend will run on port 5173.

This should bring up a local Express server on port 3000.
Try to run `curl localhost:3000/api/hello-world` in order to verify things work as they should.

## Snapshots

This modest server runs with an in-memory SQLite database. You may inspect the database schema and the records seeded into the DB in `src/database.ts`.
Each snapshot represents a snapshot from some reporting Lunar Proxy out there.

For simplicity's sake, we assume that there is only a single user with a single proxy in our system, and that that proxy never crashes or restarts.

Remember, each snapshot captures Lunar Proxy's aggregated state up to a certain point. Each of its metrics are either a counter or a gauge: a counter may only go up, while a gauge may go both up and down.
A proxy reports its current snapshot to the web server every 15 seconds, however there might be a scenario in which data is lost (e.g. connectivity issue, database issue, etc...).

## Task

You are tasked with implementing the GET /api/aggregation endpoint.
For your convenience, there is already the GET /api/snapshots endpoint in place which will supply some hints regarding how to work with the Express routes and the DB client (which is based on the promised-sqlite3 library, which is in turn an async adaptation of the sqlite3 library).

The GET /api/aggregation should accept min datetime and max datetime and calculate the aggregation for that time range. Only relevant snapshots should be taken into account - meaning, no snapshots before the min datetime or after the max datetime.

The returned aggregation should contain the following fields:

- count: the amount of calls within the selected time range.
- successfulRate: the successful call rate out of all calls within the selected time range.
- errorRate: the error call rate (client and server side) out of all calls within the selected time range.
- avgRuntimeMillis: the average runtime in milliseconds for all calls within the selected time range.

To finish, add some tests - it is up to you to decide how and what to test. Briefly explain your testing approach.

### Bonus Questions

1. As an extra, you may try to uncomment the strict type checks in `./tsconfig.json`. Verify that your proposed solution still works as expected, or make the required changes to support the stricter type check.
   Describe in a sentence or two the implications of this change on your work on this endpoint.

2. Up till now we worked under the assumption that there is only a single proxy that keeps running and sending snapshot. What would need to change if more than a single Proxy instance could be running at any given moment?

## Backend Changes

1. **Database Schema Update**: Added a `proxyId` to the snapshots table to associate each snapshot with its respective proxy.
2. **Endpoint Update**: Modified the `/api/aggregation` endpoint to accept and handle `proxyId` as an additional parameter.
3. **Data Handling**: Validated that the user requesting the data is requesting the correct proxy and has a valid request.
4. **Testing**: Implemented tests to verify that the aggregation logic works correctly with multiple proxies, ensuring that each user can access data from their proxy and multiple proxies, depending on the product demands.

# Dashboard-Aggregation-Assignment
