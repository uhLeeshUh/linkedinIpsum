import BaseModel from "./base-model";
import { JSONSchema, Transaction } from "objection";

interface IVariableCreateFields {
  variableCategoryId: string;
  variableText: string;
}

export default class Variable extends BaseModel {
  variableCategoryId!: string;
  variableText!: string;

  static tableName = "variable";

  static jsonSchema: JSONSchema = {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      variableCategoryId: { type: "string", format: "uuid" },
      variableText: { type: "string", minLength: 1 },
      updatedAt: { type: "string" },
      createdAt: { type: "string" },
      deletedAt: { type: "string" },
    },
    required: ["variableCategoryId", "variableText"],
  };

  static async getById(
    variableId: string,
    txn: Transaction,
  ): Promise<Variable> {
    const fetchedVariable = await this.query(txn).findById(variableId);

    if (!fetchedVariable) {
      return Promise.reject(
        `No variable exists in database for id ${variableId}`,
      );
    }

    return fetchedVariable;
  }

  static async getRandomByCategoryId(
    variableCategoryId: string,
    txn: Transaction,
  ): Promise<Variable> {
    return this.query(txn)
      .where({ variableCategoryId, deletedAt: null })
      .orderByRaw("random()")
      .first();
  }

  static async create(
    variable: IVariableCreateFields,
    txn: Transaction,
  ): Promise<Variable> {
    return this.query(txn).insertAndFetch(variable);
  }
}
