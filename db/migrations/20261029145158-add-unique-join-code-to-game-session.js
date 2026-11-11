'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex('GameSession', ['joinCode'], {
      unique: true,
      name: 'uq_game_session_join_code',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex(
      'GameSession',
      'uq_game_session_join_code'
    );
  },
};