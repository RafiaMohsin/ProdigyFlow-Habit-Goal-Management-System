const sql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT) || 1433,
    options: {
        instanceName: process.env.DB_INSTANCE,
        trustServerCertificate: true,
        encrypt: true,
        useUTC: false
    }
};

async function checkStatusMapping() {
    try {
        console.log('Connecting to database...');
        const pool = await sql.connect(config);
        
        // Check NotificationStatuses table
        console.log('NotificationStatuses table data:');
        try {
            const statusData = await pool.request().query('SELECT * FROM NotificationStatuses');
            statusData.recordset.forEach(status => {
                console.log(`- StatusID: ${status.StatusID}, StatusName: ${status.StatusName}`);
            });
        } catch (err) {
            console.log('NotificationStatuses table not found or error:', err.message);
        }
        
        // Check current notification status distribution
        console.log('\nCurrent notification status distribution:');
        const statusDist = await pool.request().query(`
            SELECT StatusID, COUNT(*) as count 
            FROM Notifications 
            GROUP BY StatusID
        `);
        statusDist.recordset.forEach(row => {
            console.log(`- StatusID ${row.StatusID}: ${row.count} notifications`);
        });
        
        await pool.close();
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkStatusMapping();
