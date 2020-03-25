import Knex from "knex";
import knexConfig from "../knex/db";

const migrateTestDb = async () => {
  const knex = Knex(knexConfig);
  return knex.migrate.latest().then(() => knex.destroy());
};

migrateTestDb();
