// Empties the development database completely.
// This script must never run against production or the test database.

const { sequelize } = require('../src/models');
const env = require('../src/config/env');

async function main() {
  if (env.nodeEnv !== 'development') {
    throw new Error('Database reset is allowed only in development.');
  }

  if (env.db.name !== 'shinobi_quiz_battle') {
    throw new Error(
      `Unsafe database target: ${env.db.name}. Expected shinobi_quiz_battle.`
    );
  }

  await sequelize.query('DROP SCHEMA public CASCADE');
  await sequelize.query('CREATE SCHEMA public');

  console.log(`Development database ${env.db.name} is empty.`);

  await sequelize.close();
}

main().catch(async (error) => {
  console.error('DB RESET FAILED:', error.message);
  await sequelize.close().catch(() => {});
  process.exit(1);
});