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

async function fixDatabaseSchema() {
    try {
        console.log('Connecting to database...');
        const pool = await sql.connect(config);
        
        // Check Notifications table structure
        console.log('Checking Notifications table structure...');
        const tableInfo = await pool.request().query(`
            SELECT COLUMN_NAME, DATA_TYPE 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'Notifications'
        `);
        
        console.log('Current Notifications table columns:');
        tableInfo.recordset.forEach(col => {
            console.log(`- ${col.COLUMN_NAME}: ${col.DATA_TYPE}`);
        });
        
        // Check if Status column exists
        const statusColumn = tableInfo.recordset.find(col => col.COLUMN_NAME === 'Status');
        
        if (!statusColumn) {
            console.log('Status column not found. Adding Status column...');
            await pool.request().query(`
                ALTER TABLE Notifications 
                ADD Status VARCHAR(20) DEFAULT 'Unread'
            `);
            console.log('✅ Status column added successfully');
        } else {
            console.log('Status column already exists');
        }
        
        // Check other required tables for dashboard
        console.log('\nChecking required tables for dashboard...');
        
        const tables = ['Users', 'Habits', 'Goals', 'UserAchievements', 'Notifications'];
        
        for (const tableName of tables) {
            try {
                const result = await pool.request().query(`SELECT COUNT(*) as count FROM ${tableName}`);
                console.log(`✅ ${tableName}: ${result.recordset[0].count} records`);
            } catch (err) {
                console.log(`❌ ${tableName}: Table not found or error - ${err.message}`);
            }
        }
        
        await pool.close();
        
        // Test dashboard endpoint again
        console.log('\nTesting dashboard endpoint with fixed schema...');
        
        // Get token first
        const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                Email: 'test@test.com', 
                Password: 'test123'
            }),
        });
        
        const loginData = await loginResponse.json();
        
        if (loginData.token) {
            console.log('✅ Got token, testing dashboard...');
            
            const dashboardResponse = await fetch('http://localhost:3000/api/users/dashboard-stats', {
                headers: {
                    'Authorization': `Bearer ${loginData.token}`
                }
            });
            
            const dashboardData = await dashboardResponse.json();
            console.log('✅ Dashboard data:', dashboardData);
        }
        
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

fixDatabaseSchema();
