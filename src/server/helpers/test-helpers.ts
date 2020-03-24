import Knex from "knex";
import knexConfig from "../knex/db";
import { Model } from "objection";

export const setupTestDb = () => {
  const knex = Knex(knexConfig);
  Model.knex(knex);
  return {
    destroy: async () => {
      try {
        await knex.destroy();
      } catch (err) {
        console.error(err.message);
      }
    },
  };
};
