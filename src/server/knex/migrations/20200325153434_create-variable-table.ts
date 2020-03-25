import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.hasTable("variable").then(exists => {
    if (!exists) {
      return knex.schema.createTable("variable", table => {
        table.string("id").primary();
        table
          .string("variableCategoryId")
          .references("id")
          .inTable("variable_category")
          .notNullable()
          .onDelete("CASCADE");
        table.string("variableText").notNullable();

        // timestamps
        table.timestamp("createdAt").defaultTo(knex.raw("now()"));
        table.timestamp("updatedAt").defaultTo(knex.raw("now()"));
        table.timestamp("deletedAt");

        // indexes
        table.unique(["variableCategoryId", "variableText"]);
      });
    }
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.hasTable("variable").then(exists => {
    if (exists) {
      return knex.schema.dropTable("variable");
    }
  });
}
