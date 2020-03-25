import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.hasTable("template_chunk").then(exists => {
    if (!exists) {
      return knex.schema.createTable("template_chunk", table => {
        table.string("id").primary();
        table.integer("index").notNullable();
        table.string("chunkText").notNullable();
        table
          .string("templateId")
          .references("id")
          .inTable("template")
          .notNullable()
          .onDelete("CASCADE");
        table
          .string("preferredVariableId")
          .references("id")
          .inTable("variable")
          .onDelete("CASCADE");
        table
          .string("followingVariableCategoryId")
          .references("id")
          .inTable("variable_category")
          .onDelete("CASCADE");

        // timestamps
        table.timestamp("createdAt").defaultTo(knex.raw("now()"));
        table.timestamp("updatedAt").defaultTo(knex.raw("now()"));
        table.timestamp("deletedAt");

        // indexes
        table.unique(["templateId", "index"]);
      });
    }
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.hasTable("template_chunk").then(exists => {
    if (exists) {
      return knex.schema.dropTable("template_chunk");
    }
  });
}
