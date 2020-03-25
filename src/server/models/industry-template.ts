import BaseModel from "./base-model";
import { JSONSchema, Transaction } from "objection";

interface IIndustryTemplateCreateFields {
  industryId: string;
  templateId: string;
}

export default class IndustryTemplate extends BaseModel {
  industryId!: string;
  templateId!: string;

  static tableName = "industry_template";

  static jsonSchema: JSONSchema = {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      industryId: { type: "string", format: "uuid" },
      templateId: { type: "string", format: "uuid" },
      updatedAt: { type: "string" },
      createdAt: { type: "string" },
      deletedAt: { type: "string" },
    },
    required: ["industryId", "templateId"],
  };

  static async create(
    industryTemplate: IIndustryTemplateCreateFields,
    txn: Transaction,
  ): Promise<IndustryTemplate> {
    return this.query(txn).insertAndFetch(industryTemplate);
  }
}
