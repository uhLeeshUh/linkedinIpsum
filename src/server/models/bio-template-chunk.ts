import BaseModel from "./base-model";
import { JSONSchema, Transaction, RelationMappings, Model } from "objection";
import TemplateChunk from "./template-chunk";
import Variable from "./variable";

export interface IBioTemplateChunkCreateFields {
  bioId: string;
  templateChunkId: string;
  followingVariableId?: string;
}

export default class BioTemplateChunk extends BaseModel {
  bioId!: string;
  templateChunkId!: string;
  followingVariableId!: string | null;

  static tableName = "bio_template_chunk";

  static jsonSchema: JSONSchema = {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      bioId: { type: "string", format: "uuid" },
      templateChunkId: { type: "string", format: "uuid" },
      followingVariableId: { type: "string", format: "uuid" },
      updatedAt: { type: "string" },
      createdAt: { type: "string" },
      deletedAt: { type: "string" },
    },
    required: ["bioId", "templateChunkId"],
  };

  static get relationMappings(): RelationMappings {
    return {
      templateChunk: {
        relation: Model.HasOneRelation,
        modelClass: TemplateChunk,
        join: {
          from: "bio_template_chunk.templateChunkId",
          to: "template_chunk.id",
        },
      },
      followingVariable: {
        relation: Model.HasOneRelation,
        modelClass: Variable,
        join: {
          from: "bio_template_chunk.followingVariableId",
          to: "variable.id",
        },
      },
    };
  }

  static async create(
    bioTemplateChunk: IBioTemplateChunkCreateFields,
    txn: Transaction,
  ): Promise<BioTemplateChunk> {
    return this.query(txn).insertAndFetch(bioTemplateChunk);
  }

  static async getAllForBio(
    bioId: string,
    txn: Transaction,
  ): Promise<BioTemplateChunk[]> {
    return this.query(txn)
      .withGraphFetched("[templateChunk, followingVariable]")
      .where({ bioId, "bio_template_chunk.deletedAt": null })
      .leftJoin("template_chunk as tc", builder =>
        builder.on("bio_template_chunk.templateChunkId", "=", "tc.id"),
      )
      .orderBy("tc.index", "ASC");
  }
}
