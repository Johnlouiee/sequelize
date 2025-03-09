const config = require('config.json');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

module.exports = db = {};

initialize();

async function initialize() {
  const { host, port, user, password, database } = config.database;

  try {
  
    const connection = await mysql.createConnection({ host, port, user, password });


    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    console.log(`Database "${database}" created or already exists.`);

 
    await connection.end();


    const sequelize = new Sequelize(database, user, password, {
      host,
      port,
      dialect: 'mysql',
      logging: false,
    });

  
    db.User = require('../users/user.model')(sequelize);

   
    await sequelize.sync({ alter: true });
    console.log('All models were synchronized successfully.');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
}