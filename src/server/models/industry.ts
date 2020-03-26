import BaseModel from "./base-model";
import { JSONSchema, Transaction } from "objection";

interface IIndustryCreateFields {
  name: string;
}

export default class Industry extends BaseModel {
  name!: string;

  static tableName = "industry";

  static jsonSchema: JSONSchema = {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      name: { type: "string", minLength: 1 },
      updatedAt: { type: "string" },
      createdAt: { type: "string" },
      deletedAt: { type: "string" },
    },
    required: ["name"],
  };

  static async getAll(txn: Transaction): Promise<Industry[]> {
    return this.query(txn).whereNull("deletedAt");
  }

  static async getByName(
    name: string,
    txn: Transaction,
  ): Promise<Industry | undefined> {
    return this.query(txn).findOne({ name });
  }

  static async create(
    industry: IIndustryCreateFields,
    txn: Transaction,
  ): Promise<Industry> {
    return this.query(txn).insertAndFetch(industry);
  }
}
