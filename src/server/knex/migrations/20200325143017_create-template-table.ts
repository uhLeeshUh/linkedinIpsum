import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.hasTable("template").then(exists => {
    if (!exists) {
      return knex.schema.createTable("template", table => {
        table.string("id").primary();

        // timestamps
        table.timestamp("createdAt").defaultTo(knex.raw("now()"));
        table.timestamp("updatedAt").defaultTo(knex.raw("now()"));
        table.timestamp("deletedAt");
      });
    }
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.hasTable("template").then(exists => {
    if (exists) {
      return knex.schema.dropTable("template");
    }
  });
}
