// One Sequelize instance for the entire API.
const { Sequelize, DataTypes } = require('sequelize');
const env = require('../config/env');
const dbConfig = require('../config/database')[env.nodeEnv];

// Initialize the database connection first.
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

// Load models.
const User = require('./user')(sequelize, DataTypes);
const QuestionSet = require('./question-set')(sequelize, DataTypes);
const GameSession = require('./game-session')(sequelize, DataTypes);
const Player = require('./player')(sequelize, DataTypes);
const Question = require('./question')(sequelize, DataTypes);
const QuestionChoice = require('./question-choice')(sequelize, DataTypes);
const Answer = require('./answer')(sequelize, DataTypes);
const PlayerQuestion = require('./player-question')(sequelize, DataTypes);

// Existing relationships.
User.hasMany(QuestionSet, { foreignKey: 'hostId' });
QuestionSet.belongsTo(User, { foreignKey: 'hostId', as: 'host' });

User.hasMany(GameSession, { foreignKey: 'hostId' });
GameSession.belongsTo(User, { foreignKey: 'hostId', as: 'host' });

QuestionSet.hasMany(GameSession, { foreignKey: 'questionSetId' });
GameSession.belongsTo(QuestionSet, { foreignKey: 'questionSetId' });

GameSession.hasMany(Player, { foreignKey: 'sessionId' });
Player.belongsTo(GameSession, { foreignKey: 'sessionId' });

User.hasMany(Player, { foreignKey: 'user_id' });
Player.belongsTo(User, { foreignKey: 'user_id' });

// Question Bank relationships.
QuestionSet.hasMany(Question, {
  foreignKey: 'questionSetId',
  as: 'questions',
});
Question.belongsTo(QuestionSet, {
  foreignKey: 'questionSetId',
  as: 'questionSet',
});

Question.hasMany(QuestionChoice, {
  foreignKey: 'questionId',
  as: 'choices',
});
QuestionChoice.belongsTo(Question, {
  foreignKey: 'questionId',
  as: 'question',
});

// Answer relationships.
Player.hasMany(Answer, {
  foreignKey: 'playerId',
});
Answer.belongsTo(Player, {
  foreignKey: 'playerId',
});

Question.hasMany(Answer, {
  foreignKey: 'questionId',
});
Answer.belongsTo(Question, {
  foreignKey: 'questionId',
});

// Player question progress relationships.
Player.hasMany(PlayerQuestion, {
  foreignKey: 'playerId',
});
PlayerQuestion.belongsTo(Player, {
  foreignKey: 'playerId',
});

Question.hasMany(PlayerQuestion, {
  foreignKey: 'questionId',
});
PlayerQuestion.belongsTo(Question, {
  foreignKey: 'questionId',
});

module.exports = {
  sequelize,
  Sequelize,
  DataTypes,
  User,
  QuestionSet,
  GameSession,
  Player,
  Question,
  QuestionChoice,
  Answer,
  PlayerQuestion,
};
