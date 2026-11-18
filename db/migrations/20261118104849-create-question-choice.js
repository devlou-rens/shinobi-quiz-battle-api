'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('QuestionChoice', {
      choiceId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
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
      choiceText: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      position: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });

    await queryInterface.addConstraint('QuestionChoice', {
      fields: ['questionId', 'position'],
      type: 'unique',
      name: 'uq_question_choice_position',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('QuestionChoice');
  },
};