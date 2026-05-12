const sql = require('mssql');
const bcrypt = require('bcryptjs');
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

async function createTestUser() {
    try {
        console.log('Connecting to database...');
        const pool = await sql.connect(config);
        
        // Check current users and their passwords
        const userResult = await pool.request().query('SELECT TOP 3 UserID, Username, Email, PasswordHash, RoleID FROM Users');
        console.log('Current users and password hashes:');
        userResult.recordset.forEach(user => {
            console.log(`- ${user.Username} (${user.Email}) - PasswordHash: ${user.PasswordHash.substring(0, 20)}...`);
        });
        
        // Create a new test user with known credentials
        const testPassword = 'test123';
        const hashedPassword = await bcrypt.hash(testPassword, 10);
        
        console.log(`Creating new test user with password: ${testPassword}`);
        console.log(`Hashed password: ${hashedPassword}`);
        
        await pool.request()
            .input('Username', sql.VarChar, 'testuser')
            .input('Email', sql.VarChar, 'test@test.com')
            .input('PasswordHash', sql.VarChar, hashedPassword)
            .input('RoleID', sql.Int, 2)
            .query(`
                INSERT INTO Users (Username, Email, PasswordHash, CreatedDate, RoleID)
                VALUES (@Username, @Email, @PasswordHash, GETDATE(), @RoleID)
            `);
        
        console.log('✅ Test user created successfully!');
        console.log('Login credentials:');
        console.log('Email: test@test.com');
        console.log('Password: test123');
        
        await pool.close();
        
        // Test the login immediately
        console.log('\nTesting login with new user...');
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                Email: 'test@test.com', 
                Password: 'test123'
            }),
        });
        
        const data = await response.json();
        console.log('Login response:', data);
        
        if (data.token) {
            console.log('✅ Login successful! Testing dashboard...');
            
            // Test dashboard endpoint
            const dashboardResponse = await fetch('http://localhost:3000/api/users/dashboard-stats', {
                headers: {
                    'Authorization': `Bearer ${data.token}`
                }
            });
            
            const dashboardData = await dashboardResponse.json();
            console.log('Dashboard data:', dashboardData);
        }
        
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

createTestUser();
