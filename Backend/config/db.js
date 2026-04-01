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

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to SQL Server successfully.');
    return pool;
  })
  .catch(err => {
    console.error('Database Connection Failed! Bad Config: ', err);
    process.exit(1);
  });

module.exports = {
  sql,
  config,
  poolPromise,
};

//use this module.exports for reminder, notification, achievement, analytic layer
// const connectDB = async () => {
//     try {
//         await sql.connect(config);
//         console.log("Connected to DB via Environment Variables");
//     } catch (err) {
//         console.error("DB Error:", err);
//     }
// };

// module.exports = { sql, connectDB };
