import BaseModel from "./base-model";
import { JSONSchema, Transaction } from "objection";

interface IVariableCategoryCreateFields {
  categoryName: string;
}

export default class VariableCategory extends BaseModel {
  categoryName!: string;

  static tableName = "variable_category";

  static jsonSchema: JSONSchema = {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      categoryName: { type: "string", minLength: 1 },
      updatedAt: { type: "string" },
      createdAt: { type: "string" },
      deletedAt: { type: "string" },
    },
    required: ["categoryName"],
  };

  static async getByName(
    categoryName: string,
    txn: Transaction,
  ): Promise<VariableCategory | undefined> {
    return this.query(txn).findOne({ categoryName });
  }

  static async create(
    variableCategory: IVariableCategoryCreateFields,
    txn: Transaction,
  ): Promise<VariableCategory> {
    return this.query(txn).insertAndFetch(variableCategory);
  }
}
