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

async function checkAndCreateUsers() {
    try {
        console.log('Connecting to database...');
        const pool = await sql.connect(config);
        console.log('Connected successfully!');

        // Check if users exist
        const userResult = await pool.request().query('SELECT COUNT(*) as count FROM Users');
        const userCount = userResult.recordset[0].count;
        console.log(`Current user count: ${userCount}`);

        if (userCount === 0) {
            console.log('No users found. Creating test users...');
            
            // Check if roles exist
            const roleResult = await pool.request().query('SELECT COUNT(*) as count FROM Roles');
            const roleCount = roleResult.recordset[0].count;
            
            if (roleCount === 0) {
                console.log('Creating roles...');
                await pool.request().query("INSERT INTO Roles (RoleName) VALUES ('Admin')");
                await pool.request().query("INSERT INTO Roles (RoleName) VALUES ('User')");
                console.log('Roles created successfully');
            }

            // Create admin user
            const bcrypt = require('bcryptjs');
            const adminPassword = await bcrypt.hash('admin123', 10);
            await pool.request()
                .input('Username', sql.VarChar, 'admin')
                .input('Email', sql.VarChar, 'admin@test.com')
                .input('PasswordHash', sql.VarChar, adminPassword)
                .input('RoleID', sql.Int, 1)
                .query(`
                    INSERT INTO Users (Username, Email, PasswordHash, CreatedDate, RoleID)
                    VALUES (@Username, @Email, @PasswordHash, GETDATE(), @RoleID)
                `);
            
            // Create regular user
            const userPassword = await bcrypt.hash('user123', 10);
            await pool.request()
                .input('Username', sql.VarChar, 'testuser')
                .input('Email', sql.VarChar, 'user@test.com')
                .input('PasswordHash', sql.VarChar, userPassword)
                .input('RoleID', sql.Int, 2)
                .query(`
                    INSERT INTO Users (Username, Email, PasswordHash, CreatedDate, RoleID)
                    VALUES (@Username, @Email, @PasswordHash, GETDATE(), @RoleID)
                `);
            
            console.log('Test users created successfully!');
            console.log('Admin: admin@test.com / admin123');
            console.log('User: user@test.com / user123');
        } else {
            console.log('Users already exist in database');
        }

        await pool.close();
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkAndCreateUsers();
