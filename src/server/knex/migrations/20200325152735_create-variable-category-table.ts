import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.hasTable("variable_category").then(exists => {
    if (!exists) {
      return knex.schema.createTable("variable_category", table => {
        table.string("id").primary();
        table
          .string("categoryName")
          .notNullable()
          .unique();

        // timestamps
        table.timestamp("createdAt").defaultTo(knex.raw("now()"));
        table.timestamp("updatedAt").defaultTo(knex.raw("now()"));
        table.timestamp("deletedAt");
      });
    }
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.hasTable("variable_category").then(exists => {
    if (exists) {
      return knex.schema.dropTable("variable_category");
    }
  });
}
