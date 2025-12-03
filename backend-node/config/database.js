const mysql = require('mysql2/promise');
require('dotenv').config();

let connection = null;

const initializeDatabase = async () => {
  try {
    if (!process.env.DB_HOST) {
      console.log('Database configuration not found. Running without database.');
      return null;
    }

    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    // Create tables if they don't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS search_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        query TEXT NOT NULL,
        lat DECIMAL(10, 8),
        lon DECIMAL(11, 8),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS chat_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        question TEXT NOT NULL,
        context JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database connected successfully');
    return connection;
  } catch (error) {
    console.log('Database connection failed. Running without database:', error.message);
    return null;
  }
};

// Initialize database on startup
initializeDatabase();

module.exports = connection;