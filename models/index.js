require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_SSL,
} = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: Number(DB_PORT) || 5432,
  dialect: 'postgres',
  logging: false,
  dialectOptions:
    DB_SSL === 'true'
      ? { ssl: { require: true, rejectUnauthorized: false } }
      : {},
});

const Bouquet = require('./bouquet')(sequelize, DataTypes);

async function connect() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: false });
    console.log('Database connection successful');
  } catch (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  }
}

module.exports = {
  sequelize,
  connect,
  Bouquet,
};
