
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RewardRound', {
      rewardRoundId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
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
      duration: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      chakraEarned: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('RewardRound');
  },
};
