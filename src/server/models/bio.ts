import BaseModel from "./base-model";
import { JSONSchema, Transaction, Modifiers, QueryBuilder } from "objection";

interface IBioCreateFields {
  name: string;
  industryId: string;
  templateId: string;
  sessionId: string;
}

export default class Bio extends BaseModel {
  name!: string;
  industryId!: string;
  templateId!: string;
  sessionId!: string;

  static tableName = "bio";

  static jsonSchema: JSONSchema = {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      name: { type: "string", minLength: 1 },
      industryId: { type: "string", format: "uuid" },
      templateId: { type: "string", format: "uuid" },
      sessionId: { type: "string", format: "uuid" },
      updatedAt: { type: "string" },
      createdAt: { type: "string" },
      deletedAt: { type: "string" },
    },
    required: ["name", "industryId", "templateId", "sessionId"],
  };

  static get modifiers(): Modifiers {
    return {
      biosForSessionAndIndustry(
        queryBuilder: QueryBuilder<Bio, Bio[]>,
        sessionId: string,
        industryId: string,
      ) {
        queryBuilder
          .select(Bio.raw('"templateId", MAX("createdAt") as "createdAt"'))
          .where({ sessionId, industryId, deletedAt: null })
          .groupBy("templateId")
          .orderBy("createdAt", "DESC");
      },
    };
  }

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

  static async getTemplateIdsForSessionAndIndustry(
    sessionId: string,
    industryId: string,
    txn: Transaction,
  ): Promise<string[]> {
    const seenBios = await this.query(txn).modify(
      "biosForSessionAndIndustry",
      sessionId,
      industryId,
    );

    return seenBios.map((seenBio) => seenBio.templateId);
  }

  static async getMostRecentTemplateIdForSessionAndIndustry(
    sessionId: string,
    industryId: string,
    txn: Transaction,
  ): Promise<string> {
    const mostRecentBio = await this.query(txn)
      .modify("biosForSessionAndIndustry", sessionId, industryId)
      .first();

    return mostRecentBio?.templateId;
  }
}
