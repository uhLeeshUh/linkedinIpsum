import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.hasTable("bio").then((exists) => {
    if (exists) {
      return knex.schema.alterTable("bio", (table) => {
        table
          .string("industryId")
          .references("id")
          .inTable("industry")
          .notNullable()
          .onDelete("CASCADE");
      });
    }
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.hasTable("bio").then((exists) => {
    if (exists) {
      return knex.schema.alterTable("bio", (table) => {
        table.dropColumn("industryId");
      });
    }
  });
}
