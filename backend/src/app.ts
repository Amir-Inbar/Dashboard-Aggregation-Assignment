import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { createRouter } from './routes';
import { DB } from './database-async';

const app = express();
const PORT = process.env['PORT'] || 3000;

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const db = new DB();

async function initializeServer() {
  try {
    // Migrate and seed the database
    await db.migrate();
    console.log('📂 Database migrated successfully.');
    await db.seed();
    console.log('🌱 Database seeded successfully.');

    // Start the server after the database is ready
    app.use('/api', createRouter(db));
  } catch (error) {
    console.error('❌ Failed to initialize the server:', error);
    process.exit(1); // Exit the process with a failure code
  }
}

initializeServer();

app.listen(PORT, () => {
  console.log(`⚡ Server is running on port ${PORT}`);
});
