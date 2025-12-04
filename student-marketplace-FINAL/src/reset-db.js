/**
 * File: src/reset-db.js
 * Description: Drops and recreates the database to clear all data.
 * Run this with: node src/reset-db.js
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

const resetDatabase = async () => {
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  };

  const dbName = process.env.DB_NAME || 'student_marketplace';

  console.log('🔄 Connecting to MySQL server...');

  let connection;
  try {
    // Connect to MySQL server (without specifying a database yet)
    connection = await mysql.createConnection(dbConfig);

    console.log(`🗑️  Dropping database "${dbName}" if it exists...`);
    await connection.query(`DROP DATABASE IF EXISTS \`${dbName}\`;`);

    console.log(`✨ Creating fresh database "${dbName}"...`);
    await connection.query(`CREATE DATABASE \`${dbName}\`;`);

    console.log('✅ Database reset successfully!');
    console.log('👉 Now run "npm start" to rebuild tables and start the server.');

  } catch (error) {
    console.error('❌ Error resetting database:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('   -> Is your XAMPP MySQL server running?');
    }
  } finally {
    if (connection) await connection.end();
    process.exit();
  }
};

resetDatabase();