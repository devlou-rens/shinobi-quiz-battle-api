'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.addConstraint('Answer', {
      fields: ['playerId', 'questionId'],
      type: 'unique',
      name: 'unique_player_question_answer',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint(
      'Answer',
      'unique_player_question_answer'
    );
  },
};