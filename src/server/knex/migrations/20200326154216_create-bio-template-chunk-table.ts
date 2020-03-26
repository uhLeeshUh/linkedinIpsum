import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.hasTable("bio_template_chunk").then(exists => {
    if (!exists) {
      return knex.schema.createTable("bio_template_chunk", table => {
        table.string("id").primary();
        table
          .string("bioId")
          .references("id")
          .inTable("bio")
          .notNullable()
          .onDelete("CASCADE");
        table
          .string("templateChunkId")
          .references("id")
          .inTable("template_chunk")
          .notNullable()
          .onDelete("CASCADE");
        table
          .string("followingVariableId")
          .references("id")
          .inTable("variable")
          .onDelete("CASCADE");

        // timestamps
        table.timestamp("createdAt").defaultTo(knex.raw("now()"));
        table.timestamp("updatedAt").defaultTo(knex.raw("now()"));
        table.timestamp("deletedAt");

        // indexes
        table.unique(["templateChunkId", "bioId"]);
      });
    }
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.hasTable("bio_template_chunk").then(exists => {
    if (exists) {
      return knex.schema.dropTable("bio_template_chunk");
    }
  });
}
