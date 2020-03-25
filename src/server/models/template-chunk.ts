import BaseModel from "./base-model";
import { JSONSchema, Transaction } from "objection";

interface ITemplateChunkCreateFields {
  index: number;
  chunkText: string;
  templateId: string;
  preferredVariableId?: string;
  followingVariableCategoryId?: string;
}

export default class TemplateChunk extends BaseModel {
  index!: number;
  chunkText!: string;
  templateId!: string;
  preferredVariableId!: string | null;
  followingVariableCategoryId!: string | null;

  static tableName = "template_chunk";

  static jsonSchema: JSONSchema = {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      index: { type: "integer" },
      chunkText: { type: "string", minLength: 1 },
      templateId: { type: "string", format: "uuid" },
      preferredVariableId: { type: ["string", "null"], format: "uuid" },
      followingVariableCategoryId: { type: ["string", "null"], format: "uuid" },
      updatedAt: { type: "string" },
      createdAt: { type: "string" },
      deletedAt: { type: "string" },
    },
    required: ["index", "chunkText", "templateId"],
  };

  static async create(
    templateChunk: ITemplateChunkCreateFields,
    txn: Transaction,
  ): Promise<TemplateChunk> {
    return this.query(txn).insertAndFetch(templateChunk);
  }
}
