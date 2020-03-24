import Knex from "knex";
import { transaction } from "objection";
import Industry from "../../models/industry";
import { setupTestDb } from "../../helpers/test-helpers";

export async function seed(knex: Knex): Promise<any> {
  const INDUSTRIES = ["finance", "tech", "advertising", "consulting"];
  const setupDb = setupTestDb();

  // Deletes ALL existing entries
  return knex("industry")
    .del()
    .then(async () => {
      // Insert seed entries
      try {
        await transaction(Industry.knex(), async txn => {
          const createdIndustries = INDUSTRIES.map(
            async industry => await Industry.create({ name: industry }, txn),
          );
          await Promise.all(createdIndustries);
        });
      } catch (err) {
        console.log("Error seeding industries: ", err);
      } finally {
        setupDb.destroy();
      }
    });
}
