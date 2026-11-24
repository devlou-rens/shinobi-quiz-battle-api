
const env = require('./env');

const commonSettings = {
  dialect: 'postgres',
  logging: false,

  // Track seeders to prevent duplicate inserts.
  seederStorage: 'sequelize',

  pool: {
    max: 10,
    min: 0,
    idle: 10000,
  },
};

// Local development and test connection.
const localSettings = {
  ...commonSettings,
  username: env.db.user,
  password: env.db.password,
  database: env.db.name,
  host: env.db.host,
  port: env.db.port,
};

// Production connection.
const productionSettings = env.db.url
  ? {
      ...commonSettings,
      url: env.db.url,
      use_env_variable: 'DATABASE_URL',
      dialectOptions: env.db.ssl
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : {},
    }
  : localSettings;

module.exports = {
  development: localSettings,
  test: localSettings,
  production: productionSettings,
};
