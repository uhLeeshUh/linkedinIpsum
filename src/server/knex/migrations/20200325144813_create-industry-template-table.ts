import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.hasTable("industry_template").then(exists => {
    if (!exists) {
      return knex.schema.createTable("industry_template", table => {
        table.string("id").primary();
        table
          .string("industryId")
          .references("id")
          .inTable("industry")
          .notNullable()
          .onDelete("CASCADE");
        table
          .string("templateId")
          .references("id")
          .inTable("template")
          .notNullable()
          .onDelete("CASCADE");

        // timestamps
        table.timestamp("createdAt").defaultTo(knex.raw("now()"));
        table.timestamp("updatedAt").defaultTo(knex.raw("now()"));
        table.timestamp("deletedAt");

        // indexes
        table.unique(["industryId", "templateId"]);
      });
    }
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.hasTable("industry_template").then(exists => {
    if (exists) {
      return knex.schema.dropTable("industry_template");
    }
  });
}
