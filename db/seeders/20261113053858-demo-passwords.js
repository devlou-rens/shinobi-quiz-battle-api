'use strict';

const bcrypt = require('bcryptjs');

const DEMO_PASSWORD = 'shinobi123';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface) {
    const hash = await bcrypt.hash(DEMO_PASSWORD, 10);

    await queryInterface.bulkUpdate(
      'users',
      { password_hash: hash },
      { password_hash: null }
    );
  },

  async down() {
    // Intentionally do not erase passwords that users may have changed.
  },
};