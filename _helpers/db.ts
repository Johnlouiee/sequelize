import dotenv from 'dotenv';
dotenv.config();
import mysql from 'mysql2/promise';
import { Sequelize } from 'sequelize';
import userModel from '../users/user.model';

// Load database configuration from .env
const host = process.env.DB_HOST || 'localhost';
const port = Number(process.env.DB_PORT) || 3306;
const user = process.env.DB_USER || 'root';
const password = process.env.DB_PASSWORD || '';
const database = process.env.DB_NAME || 'prac';

export const db: { User?: any } = {};

initialize();

async function initialize() {
  try {
    // Create database if it doesn't exist
    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    console.log(`Database "${database}" created or already exists.`);
    await connection.end();

    // Connect Sequelize
    const sequelize = new Sequelize(database, user, password, {
      host,
      port,
      dialect: 'mysql',
      logging: false,
    });

    // Initialize models
    db.User = userModel(sequelize);

    // Sync database
    await sequelize.sync({ alter: true });
    console.log('All models were synchronized successfully.');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
}
