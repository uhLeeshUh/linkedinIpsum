import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.hasTable("bio").then((exists) => {
    if (exists) {
      return knex.schema.alterTable("bio", (table) => {
        table
          .string("templateId")
          .references("id")
          .inTable("template")
          .notNullable()
          .onDelete("CASCADE");
        table.string("sessionId").notNullable();
      });
    }
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.hasTable("bio").then((exists) => {
    if (exists) {
      return knex.schema.alterTable("bio", (table) => {
        table.dropColumn("templateId");
        table.dropColumn("sessionId");
      });
    }
  });
}
