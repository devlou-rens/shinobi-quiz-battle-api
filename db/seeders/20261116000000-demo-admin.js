'use strict';

const bcrypt = require('bcryptjs');

const ADMIN = {
  school_id: '24179001',
  full_name: 'Demo Administrator',
  email: 'admin@example.test',
  password: 'shinobi123',
  role: 'ADMIN',
};

const EXTRA_PLAYERS = [
  {
    school_id: '24179002',
    full_name: 'Demo Player Eight',
    email: 'demoplayer8@example.test',
    role: 'PLAYER',
  },
  {
    school_id: '24179003',
    full_name: 'Demo Player Nine',
    email: 'demoplayer9@example.test',
    role: 'PLAYER',
  },
];

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface) {
    const passwordHash = await bcrypt.hash(ADMIN.password, 10);

    await queryInterface.bulkInsert('users', [
      ...EXTRA_PLAYERS.map((player) => ({
        ...player,
        password_hash: passwordHash,
      })),
      {
        school_id: ADMIN.school_id,
        full_name: ADMIN.full_name,
        email: ADMIN.email,
        password_hash: passwordHash,
        role: ADMIN.role,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(
      'users',
      {
        school_id: [
          ...EXTRA_PLAYERS.map((player) => player.school_id),
          ADMIN.school_id,
        ],
      },
      {}
    );
  },
};