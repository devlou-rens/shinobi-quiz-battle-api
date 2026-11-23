
module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'PlayerQuestion',
    {
      playerQuestionId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      playerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      questionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      questionStartedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      answeredAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'PlayerQuestion',
      timestamps: false,
    }
  );
