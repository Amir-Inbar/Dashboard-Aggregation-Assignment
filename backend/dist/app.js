"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const routes_1 = require("./routes");
const database_async_1 = require("./database-async");
const app = (0, express_1.default)();
const PORT = process.env["PORT"] || 3000;
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
const db = new database_async_1.DB();
async function initializeServer() {
    try {
        // Migrate and seed the database
        await db.migrate();
        console.log("📂 Database migrated successfully.");
        await db.seed();
        console.log("🌱 Database seeded successfully.");
        // Other initialization tasks can be added here
        // Start the server after the database is ready
        app.use("/api", (0, routes_1.createRouter)(db));
        app.listen(PORT, () => {
            console.log(`⚡ Server is running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error("❌ Failed to initialize the server:", error);
        process.exit(1); // Exit the process with a failure code
    }
}
// Call the async function to initialize the server
initializeServer();
//# sourceMappingURL=app.js.map