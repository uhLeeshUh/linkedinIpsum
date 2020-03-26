import BaseModel from "./base-model";
import { JSONSchema, Transaction } from "objection";

interface IBioCreateFields {
  name: string;
}

export default class Bio extends BaseModel {
  name!: string;

  static tableName = "bio";

  static jsonSchema: JSONSchema = {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      name: { type: "string", minLength: 1 },
      updatedAt: { type: "string" },
      createdAt: { type: "string" },
      deletedAt: { type: "string" },
    },
  };

  static async create(
    variable: IBioCreateFields,
    txn: Transaction,
  ): Promise<Bio> {
    return this.query(txn).insertAndFetch(variable);
  }
}
