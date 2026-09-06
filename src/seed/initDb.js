/**
 * Creates the database (if it doesn't exist yet) and syncs all Sequelize
 * models to create the tables. Run with: npm run db:init
 */
require('dotenv').config();
const mysql = require('mysql2/promise');

async function initDb() {
  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

  const connection = await mysql.createConnection({
    host: DB_HOST || '127.0.0.1',
    port: DB_PORT || 3306,
    user: DB_USER || 'root',
    password: DB_PASSWORD || '',
  });

  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${DB_NAME || 'ceylon_trails'}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
  );
  console.log(`✔ Database "${DB_NAME || 'ceylon_trails'}" is ready.`);
  await connection.end();

  // Now that the database exists, sync the Sequelize models to create tables.
  const sequelize = require('../config/db');
  require('../models'); // ensure all models + associations are registered
  await sequelize.sync({ force: false, alter: true });
  console.log('✔ Tables created/synced.');
  await sequelize.close();
}

initDb()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('✘ Database initialization failed:', err.message);
    process.exit(1);
  });
