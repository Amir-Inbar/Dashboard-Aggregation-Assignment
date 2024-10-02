# Dashboard Aggregation Assignment

The goal of this assignment is to implement the `GET /api/aggregation` endpoint.

## Setup

First, let's set things up:

1. `npm i -D`
2. `npm run dev`

This should bring up a local Express server on port 3000.
Try to run `curl localhost:3000/api/hello-world` in order to verify things work as they should.

## Snapshots

This modest server runs with an in-memory SQLite database. you may inspect the database schema and the records seeded into the DB in `src/database.ts`.
Each `snapshot` represents a snapshot from some reporting Lunar Proxy out there.

For simplicity's sake, we assume that there is only a single user with a single proxy in our system, and that that proxy never crashes or restarts.

Remember, each snapshot captures Lunar Proxy's aggregated state up to a certain point. Each of its metrics are either a counter or a gauge: a counter may only go up, while a gauge may go both up and down.
A proxy reports its current snapshot to the web server every 15 seconds, however there might be a scenario in which data is lost (e.g. connectivity issue, database issue, etc...).

## Task

You are tasked with implementing the `GET /api/aggregation` endpoint.
For your convenience, there is already the `GET /api/snapshots` endpoint in place which will supply some hints regarding how to work with the Express routes and the DB client (which is based on the `promised-sqlite3` library, which is in turn an async adaptation of the `sqlite3` library).

The `GET /api/aggregation` should accept min datetime and max datetime and calculate the aggregation for that time range. Only relevant snapshots should be taken into account - meaning, no snapshots before the min datetime or after the max datetime.

The returned aggregation should contain the following fields:

- `count`: the amount of calls within the selected time range.
- `successfulRate`: the successful call rate out of all calls within the selected time range.
- `errorRate`: the error call rate (client and server side) out of all calls within the selected time range.
- `avgRuntimeMillis`: the average runtime in milliseconds for all calls within the selected time range.

To finish, add some tests - it is up to you to decide how and what to test. Briefly explain your testing approach.

### Bonus Questions

1. As an extra, you may try to uncomment the strict type checks in `./tsconfig.json`. Verify that your proposed solution still works as expected, or make the required changes to support the stricter type check.
   Describe in a sentence or two the implications of this change on your work on this endpoint.

2. Up till now we worked under the assumption that there is only a single proxy that keeps running and sending snapshot. What would need to change if more than a single Proxy instance could be running at any given moment?
