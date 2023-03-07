require('dotenv').config();

const { Pool } = require('pg');

const databaseOptions = {
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  host: process.env.DB_HOST
};
const pgClient = new Pool(databaseOptions);

module.exports = pgClient;