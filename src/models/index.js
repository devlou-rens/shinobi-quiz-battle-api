
// One Sequelize instance shared by the entire API.
const { Sequelize, DataTypes } = require('sequelize');
const env = require('../config/env');
const dbConfig = require('../config/database')[env.nodeEnv];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

// Load the models.
const User = require('./user')(sequelize, DataTypes);
const GameSession = require('./game-session')(sequelize, DataTypes);
const Player = require('./player')(sequelize, DataTypes);

// Model Relationships
User.hasMany(GameSession, {
  foreignKey: 'hostId',
  as: 'hostedSessions',
});

GameSession.belongsTo(User, {
  foreignKey: 'hostId',
  as: 'host',
});

GameSession.hasMany(Player, {
  foreignKey: 'sessionId',
  as: 'players',
});

Player.belongsTo(GameSession, {
  foreignKey: 'sessionId',
  as: 'session',
});

User.hasMany(Player, {
  foreignKey: 'user_id',
  as: 'playerRecords',
});

Player.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

module.exports = {
  sequelize,
  Sequelize,
  DataTypes,
  User,
  GameSession,
  Player,
};
