'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('users', [
      {
        school_id: '24179444',
        full_name: 'Shikamaru Nara',
        email: 'shikamaru@example.test',
        role: 'host',
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(
      'users',
      { school_id: '24179444' },
      {}
    );
  },
};