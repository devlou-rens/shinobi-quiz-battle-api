'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Allow players to answer the same question again in future cycles.
    await queryInterface.removeConstraint(
      'Answer',
      'unique_player_question_answer'
    );

    // Track each player's current and completed questions.
    await queryInterface.createTable('PlayerQuestion', {
      playerQuestionId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      playerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Player',
          key: 'playerId',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      questionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Question',
          key: 'questionId',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      questionStartedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      answeredAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    await queryInterface.addConstraint('PlayerQuestion', {
      fields: ['playerId', 'questionId'],
      type: 'unique',
      name: 'unique_player_question_progress',
    });
  },

 async down(queryInterface) {
  // Remove progress tracking.
  await queryInterface.dropTable('PlayerQuestion');

  // Restore the original Answer constraint.
  await queryInterface.addConstraint('Answer', {
    fields: ['playerId', 'questionId'],
    type: 'unique',
    name: 'unique_player_question_answer',
  });
},
};
