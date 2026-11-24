
// Loads .env once and fails fast when a required key is missing.
require('dotenv').config({ quiet: true });

const hasDatabaseUrl =
  Boolean(process.env.DATABASE_URL) && process.env.NODE_ENV !== 'test';

const REQUIRED = [
  'HUB_API_KEY',
  'JWT_SECRET',
  'CORS_ORIGINS',
  ...(hasDatabaseUrl
    ? []
    : ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD']),
];

const missing = REQUIRED.filter((key) => !process.env[key]);

if (missing.length > 0) {
  throw new Error(
    `Missing required .env keys: ${missing.join(', ')}. ` +
      'Copy .env.example to .env and fill in your own values.'
  );
}

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 3001,
  hubApiKey: process.env.HUB_API_KEY,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS) || 10,
  corsOrigins: process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim()),
  db: {
    url:
      process.env.NODE_ENV === 'test'
        ? null
        : process.env.DATABASE_URL || null,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    name:
      process.env.NODE_ENV === 'test'
        ? `${process.env.DB_NAME}_test`
        : process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.DB_SSL === 'true',
  },
};
