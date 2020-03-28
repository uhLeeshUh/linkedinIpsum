import BaseModel from "./base-model";
import { JSONSchema, Transaction } from "objection";

interface IVariableCreateFields {
  variableCategoryId: string;
  variableText: string;
}

interface IVariableRandomFields {
  variableCategoryId: string;
  excludedVariableId?: string; // used for optimizing a bio
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
    { variableCategoryId, excludedVariableId }: IVariableRandomFields,
    txn: Transaction,
  ): Promise<Variable | undefined> {
    const queryBuilder = this.query(txn)
      .where({ variableCategoryId, deletedAt: null })
      .orderByRaw("random()")
      .first();

    if (excludedVariableId) {
      queryBuilder.whereNot({ id: excludedVariableId });
    }

    return queryBuilder;
  }

  static async create(
    variable: IVariableCreateFields,
    txn: Transaction,
  ): Promise<Variable> {
    return this.query(txn).insertAndFetch(variable);
  }
}
