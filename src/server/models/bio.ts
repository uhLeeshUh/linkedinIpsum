import BaseModel from "./base-model";
import { JSONSchema, Transaction } from "objection";

interface IBioCreateFields {
  name: string;
  industryId: string;
}

export default class Bio extends BaseModel {
  name!: string;
  industryId!: string;

  static tableName = "bio";

  static jsonSchema: JSONSchema = {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      name: { type: "string", minLength: 1 },
      industryId: { type: "string", format: "uuid" },
      updatedAt: { type: "string" },
      createdAt: { type: "string" },
      deletedAt: { type: "string" },
    },
    required: ["name", "industryId"],
  };

  static async getById(bioId: string, txn: Transaction): Promise<Bio> {
    const bio = await this.query(txn).findById(bioId);

    if (!bio) {
      return Promise.reject(`No bio exists in database at id ${bioId}`);
    }

    return bio;
  }

  static async create(
    variable: IBioCreateFields,
    txn: Transaction,
  ): Promise<Bio> {
    return this.query(txn).insertAndFetch(variable);
  }
}
