
// Empties the database completely.
// This script is allowed to run ONLY on the dedicated test database.

const { sequelize } = require('../src/models');
const env = require('../src/config/env');

async function main() {
  const expectedDatabase = 'shinobi_quiz_battle_test';

  if (env.nodeEnv !== 'test') {
    throw new Error('DB wipe is allowed only in the test environment.');
  }

  if (env.db.name !== expectedDatabase) {
    throw new Error(
      `Unsafe database target: ${env.db.name}. Expected ${expectedDatabase}.`
    );
  }

  await sequelize.query('DROP SCHEMA public CASCADE');
  await sequelize.query('CREATE SCHEMA public');

  console.log(`Test database ${env.db.name} is empty.`);

  await sequelize.close();
}

main().catch(async (error) => {
  console.error('DB WIPE FAILED:', error.message);
  await sequelize.close().catch(() => {});
  process.exit(1);
});
