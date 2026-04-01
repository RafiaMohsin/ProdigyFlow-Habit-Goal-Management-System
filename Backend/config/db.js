const sql = require('mssql');
require('dotenv').config(); // This loads the variables from .env

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT) || 1433
    options: {
        instanceName: process.env.DB_INSTANCE,
        trustServerCertificate: true, // For local development
        encrypt: true
    }
};

const connectDB = async () => {
    try {
        await sql.connect(config);
        console.log("Connected to DB via Environment Variables");
    } catch (err) {
        console.error("DB Error:", err);
    }
};

module.exports = { sql, connectDB };
