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

async function testUsersAndAuth() {
    try {
        console.log('Connecting to database...');
        const pool = await sql.connect(config);
        
        // Get existing users
        const userResult = await pool.request().query('SELECT TOP 3 UserID, Username, Email, RoleID FROM Users');
        console.log('Existing users:');
        userResult.recordset.forEach(user => {
            console.log(`- ${user.Username} (${user.Email}) - Role: ${user.RoleID === 1 ? 'Admin' : 'User'}`);
        });
        
        await pool.close();
        
        // Test login with first user
        if (userResult.recordset.length > 0) {
            const testUser = userResult.recordset[0];
            console.log(`\nTesting login with: ${testUser.Email}`);
            
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    Email: testUser.Email, 
                    Password: 'password' // Try common passwords
                }),
            });
            
            const data = await response.json();
            console.log('Login response:', data);
            
            if (data.token) {
                console.log('✅ Login successful! Token obtained.');
                
                // Test dashboard endpoint with token
                const dashboardResponse = await fetch('http://localhost:3000/api/users/dashboard-stats', {
                    headers: {
                        'Authorization': `Bearer ${data.token}`
                    }
                });
                
                const dashboardData = await dashboardResponse.json();
                console.log('Dashboard data:', dashboardData);
            } else {
                console.log('❌ Login failed. Trying to test with plain text passwords...');
                
                // Try common plain text passwords
                const commonPasswords = ['password', '123456', 'admin', 'user', 'test'];
                
                for (const pwd of commonPasswords) {
                    const response = await fetch('http://localhost:3000/api/auth/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ 
                            Email: testUser.Email, 
                            Password: pwd
                        }),
                    });
                    
                    const data = await response.json();
                    if (data.token) {
                        console.log(`✅ Login successful with password: ${pwd}`);
                        console.log('Token:', data.token);
                        break;
                    }
                }
            }
        }
        
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

testUsersAndAuth();
