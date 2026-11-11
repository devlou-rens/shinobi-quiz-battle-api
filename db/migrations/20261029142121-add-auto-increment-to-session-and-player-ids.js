'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Make GameSession.sessionId generate IDs automatically.
    await queryInterface.sequelize.query(`
      CREATE SEQUENCE IF NOT EXISTS "GameSession_sessionId_seq"
    `);

    await queryInterface.sequelize.query(`
      SELECT setval(
        '"GameSession_sessionId_seq"',
        GREATEST(COALESCE((SELECT MAX("sessionId") FROM "GameSession"), 0) + 1, 1),
        false
      )
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "GameSession"
      ALTER COLUMN "sessionId"
      SET DEFAULT nextval('"GameSession_sessionId_seq"')
    `);

    await queryInterface.sequelize.query(`
      ALTER SEQUENCE "GameSession_sessionId_seq"
      OWNED BY "GameSession"."sessionId"
    `);

    // Make Player.playerId generate IDs automatically.
    await queryInterface.sequelize.query(`
      CREATE SEQUENCE IF NOT EXISTS "Player_playerId_seq"
    `);

    await queryInterface.sequelize.query(`
      SELECT setval(
        '"Player_playerId_seq"',
        GREATEST(COALESCE((SELECT MAX("playerId") FROM "Player"), 0) + 1, 1),
        false
      )
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "Player"
      ALTER COLUMN "playerId"
      SET DEFAULT nextval('"Player_playerId_seq"')
    `);

    await queryInterface.sequelize.query(`
      ALTER SEQUENCE "Player_playerId_seq"
      OWNED BY "Player"."playerId"
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE "Player"
      ALTER COLUMN "playerId" DROP DEFAULT
    `);

    await queryInterface.sequelize.query(`
      DROP SEQUENCE IF EXISTS "Player_playerId_seq"
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "GameSession"
      ALTER COLUMN "sessionId" DROP DEFAULT
    `);

    await queryInterface.sequelize.query(`
      DROP SEQUENCE IF EXISTS "GameSession_sessionId_seq"
    `);
  },
};