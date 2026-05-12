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

async function checkNotificationSchema() {
    try {
        console.log('Connecting to database...');
        const pool = await sql.connect(config);
        
        // Check Notifications table structure
        console.log('Current Notifications table structure:');
        const tableInfo = await pool.request().query(`
            SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'Notifications'
            ORDER BY ORDINAL_POSITION
        `);
        
        tableInfo.recordset.forEach(col => {
            console.log(`- ${col.COLUMN_NAME}: ${col.DATA_TYPE} (Nullable: ${col.IS_NULLABLE}, Default: ${col.COLUMN_DEFAULT || 'None'})`);
        });
        
        // Check sample data
        console.log('\nSample Notifications data:');
        const sampleData = await pool.request().query('SELECT TOP 3 * FROM Notifications');
        sampleData.recordset.forEach(row => {
            console.log(`ID: ${row.NotificationID}, UserID: ${row.UserID}, StatusID: ${row.StatusID}, Message: ${row.Message?.substring(0, 50)}...`);
        });
        
        // Check if there's a Status lookup table
        console.log('\nChecking for Status lookup table...');
        try {
            const statusTable = await pool.request().query(`
                SELECT TOP 5 * FROM INFORMATION_SCHEMA.TABLES 
                WHERE TABLE_NAME LIKE '%Status%' OR TABLE_NAME LIKE '%Notification%'
            `);
            if (statusTable.recordset.length > 0) {
                console.log('Found status-related tables:');
                statusTable.recordset.forEach(table => {
                    console.log(`- ${table.TABLE_NAME}`);
                });
            }
        } catch (err) {
            console.log('No status lookup tables found');
        }
        
        await pool.close();
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkNotificationSchema();
