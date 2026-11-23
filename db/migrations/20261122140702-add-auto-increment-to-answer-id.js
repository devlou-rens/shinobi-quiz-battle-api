'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE SEQUENCE IF NOT EXISTS "Answer_answerId_seq";

      SELECT setval(
        '"Answer_answerId_seq"',
        COALESCE((SELECT MAX("answerId") FROM "Answer"), 0) + 1,
        false
      );

      ALTER TABLE "Answer"
      ALTER COLUMN "answerId"
      SET DEFAULT nextval('"Answer_answerId_seq"');

      ALTER SEQUENCE "Answer_answerId_seq"
      OWNED BY "Answer"."answerId";
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE "Answer"
      ALTER COLUMN "answerId" DROP DEFAULT;

      DROP SEQUENCE IF EXISTS "Answer_answerId_seq";
    `);
  },
};