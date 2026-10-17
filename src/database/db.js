const { Pool } = require('pg');
require('dotenv').config();

// Initialize the database connection pool using the secure connection string
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Required for secure serverless connections to Neon
    }
});

const DatabaseEngine = {
    /**
     * Executes a query against the Neon Postgres Database
     * @param {string} text - SQL Query String
     * @param {Array} params - Query Parameters
     */
    async query(text, params) {
        try {
            const start = Date.now();
            const res = await pool.query(text, params);
            const duration = Date.now() - start;
            console.log(`[Database] Query executed successfully in ${duration}ms.`);
            return res;
        } catch (err) {
            console.log(`[Database Error] Query execution failed: ${err.message}`);
            throw err;
        }
    },

    /**
     * Creates the core media asset table if it does not exist
     */
    async initializeTables() {
        const queryText = `
            CREATE TABLE IF NOT EXISTS track_downloads (
                id SERIAL PRIMARY KEY,
                track_name VARCHAR(255) NOT NULL,
                file_hash VARCHAR(64) NOT NULL,
                download_status VARCHAR(50) NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        console.log("[Database] Initializing structural framework tables...");
        await this.query(queryText);
    }
};

module.exports = DatabaseEngine;
