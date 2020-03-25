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
}
