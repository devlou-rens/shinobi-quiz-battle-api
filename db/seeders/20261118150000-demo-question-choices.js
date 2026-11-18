
'use strict';

module.exports = {
  async up(queryInterface) {
    const choices = [
      // Question 1
      ['Chakra', 'Ki', 'Mana', 'Nen'],

      // Question 2
      ['10 minutes', '5 minutes', '15 minutes', '20 minutes'],

      // Question 3
      ['5 seconds', '10 seconds', '15 seconds', '20 seconds'],

      // Question 4
      ['Balloon', 'Chest', 'Bomb', 'Scroll'],

      // Question 5
      ['Kage', 'Jonin', 'Chunin', 'Genin'],
    ];

    const rows = [];

    choices.forEach((questionChoices, questionIndex) => {
      questionChoices.forEach((choiceText, position) => {
        rows.push({
          questionId: questionIndex + 1,
          choiceText,
          position,
        });
      });
    });

    await queryInterface.bulkInsert('QuestionChoice', rows);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('QuestionChoice', {
      questionId: [1, 2, 3, 4, 5],
    });
  },
};
