// Hub Contract rule 7: query finished games from our database tables.
const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');

async function findFinishedGamePlayers(since) {
  const sql = `
    SELECT
      gs."joinCode" AS session_code,
      gs."startTime" AS started_at,
      gs."endTime" AS ended_at,
      u.school_id,
      p.nickname,
      p.chakra AS score,
      (
        COUNT(DISTINCT a."questionId") >= (
          SELECT COUNT(*)
          FROM "Question" q
          WHERE q."questionSetId" = gs."questionSetId"
        )
      ) AS completed
    FROM "GameSession" gs
    JOIN "Player" p
      ON p."sessionId" = gs."sessionId"
    JOIN users u
      ON u.user_id = p.user_id
    LEFT JOIN "Answer" a
      ON a."playerId" = p."playerId"
    WHERE gs."status" = 'CLOSED'
      AND gs."endTime" IS NOT NULL
      AND (
        CAST(:since AS TIMESTAMPTZ) IS NULL
        OR gs."endTime" > CAST(:since AS TIMESTAMPTZ)
      )
    GROUP BY
      gs."sessionId",
      gs."joinCode",
      gs."startTime",
      gs."endTime",
      gs."questionSetId",
      u.school_id,
      p."playerId",
      p.nickname,
      p.chakra
    ORDER BY
      gs."endTime" DESC,
      p.chakra DESC,
      p.nickname ASC;
  `;

  return sequelize.query(sql, {
    type: QueryTypes.SELECT,
    replacements: {
      since: since ? since.toISOString() : null,
    },
  });
}

module.exports = { findFinishedGamePlayers };
