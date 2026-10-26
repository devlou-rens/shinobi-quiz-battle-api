// ONE Sequelize instance (one connection pool) for the whole API.
const { Sequelize, DataTypes } = require('sequelize');
const env = require('../config/env');
const dbConfig = require('../config/database')[env.nodeEnv];

// Create the Sequelize instance first.
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

// Load models after Sequelize has been initialized.
const User = require('./user')(sequelize, DataTypes);

// Export the database connection and models.
module.exports = {
  sequelize,
  Sequelize,
  DataTypes,
  User,
};