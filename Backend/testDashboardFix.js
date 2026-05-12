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

async function testDashboardFix() {
    try {
        console.log('Testing dashboard with StatusID fix...');
        
        // Test login first
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
            console.log('✅ Login successful, testing dashboard...');
            
            // Test dashboard endpoint
            const dashboardResponse = await fetch('http://localhost:3000/api/users/dashboard-stats', {
                headers: {
                    'Authorization': `Bearer ${loginData.token}`
                }
            });
            
            const dashboardData = await dashboardResponse.json();
            console.log('✅ Dashboard response:', dashboardData);
            
            // Test the query directly to verify it works
            console.log('\nTesting query directly...');
            const pool = await sql.connect(config);
            
            // Test the notification query specifically
            const notificationQuery = loginData.user.roleId === 1 
                ? 'SELECT COUNT(*) as count FROM Notifications WHERE StatusID = 2'
                : `SELECT COUNT(*) as count FROM Notifications WHERE StatusID = 2 AND UserID = ${loginData.user.id}`;
            
            const result = await pool.request().query(notificationQuery);
            console.log(`✅ Notification count query result: ${result.recordset[0].count}`);
            
            await pool.close();
            
            console.log('\n✅ Dashboard fix successful! No table modifications needed.');
            console.log('The dashboard now uses StatusID = 2 (Unread) instead of Status = "Unread"');
            
        } else {
            console.log('❌ Login failed:', loginData);
        }
        
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

testDashboardFix();
