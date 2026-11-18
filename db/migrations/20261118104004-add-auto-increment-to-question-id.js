'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE SEQUENCE IF NOT EXISTS "Question_questionId_seq"
    `);

    await queryInterface.sequelize.query(`
      SELECT setval(
        '"Question_questionId_seq"',
        GREATEST(
          COALESCE((SELECT MAX("questionId") FROM "Question"), 0) + 1,
          1
        ),
        false
      )
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "Question"
      ALTER COLUMN "questionId"
      SET DEFAULT nextval('"Question_questionId_seq"')
    `);

    await queryInterface.sequelize.query(`
      ALTER SEQUENCE "Question_questionId_seq"
      OWNED BY "Question"."questionId"
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE "Question"
      ALTER COLUMN "questionId" DROP DEFAULT
    `);

    await queryInterface.sequelize.query(`
      DROP SEQUENCE IF EXISTS "Question_questionId_seq"
    `);
  },
};
