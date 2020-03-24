const config: Record<string, any> = {
  ext: "ts",
  development: {
    client: "pg",
    connection: {
      application_name: "linkedin ipsum dev",
      database: "linkedin",
      host: "127.0.0.1",
      timezone: "UTC",
    },
    migrations: {
      directory: __dirname + "/migrations",
      extension: "ts",
    },
    pool: {
      acquireTimeoutMillis: 10000,
      idleTimeoutMillis: 1000,
      max: 50,
      min: 1,
    },
  },
};

export default config;

// knex migration script requires commonjs syntax
// https://stackoverflow.com/questions/52093618/knex-required-configuration-option-client-is-missing-error
module.exports = config;
