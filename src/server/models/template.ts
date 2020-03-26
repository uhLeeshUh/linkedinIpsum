import BaseModel from "./base-model";
import { JSONSchema, Transaction } from "objection";

export default class Template extends BaseModel {
  static tableName = "template";

  static jsonSchema: JSONSchema = {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      updatedAt: { type: "string" },
      createdAt: { type: "string" },
      deletedAt: { type: "string" },
    },
  };

  static async create(txn: Transaction): Promise<Template> {
    return this.query(txn).insertAndFetch({});
  }

  static async getRandomByIndustryId(
    industryId: string,
    txn: Transaction,
  ): Promise<Template> {
    return this.query(txn)
      .select("template.*")
      .leftJoin("industry_template as it", builder =>
        builder.on("template.id", "=", "it.templateId"),
      )
      .where({ "it.industryId": industryId })
      .orderByRaw("random()")
      .first();
  }
}
