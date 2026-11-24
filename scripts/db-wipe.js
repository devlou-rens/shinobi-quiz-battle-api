
// Empties the database completely.
// This script is allowed to run ONLY on dedicated test databases.

const { sequelize } = require('../src/models');
const env = require('../src/config/env');

async function main() {
  const isLocalTestDatabase =
    env.nodeEnv === 'test' &&
    env.db.name === 'shinobi_quiz_battle_test';

  const isGitHubActionsDatabase =
    process.env.GITHUB_ACTIONS === 'true' &&
    env.nodeEnv === 'development' &&
    env.db.name === 'ci_game';

  if (!isLocalTestDatabase && !isGitHubActionsDatabase) {
    throw new Error(
      `Unsafe database target: ${env.db.name}. ` +
      'DB wipe is allowed only on the dedicated test database.'
    );
  }

  await sequelize.query('DROP SCHEMA public CASCADE');
  await sequelize.query('CREATE SCHEMA public');

  console.log(`Dedicated database ${env.db.name} is empty.`);

  await sequelize.close();
}

main().catch(async (error) => {
  console.error('DB WIPE FAILED:', error.message);
  await sequelize.close().catch(() => {});
  process.exit(1);
});
