module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'QuestionChoice',
    {
      choiceId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      questionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      choiceText: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      position: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: 'QuestionChoice',
      timestamps: false,
    }
  );