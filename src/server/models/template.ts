import BaseModel from "./base-model";
import Bio from "./bio";
import { JSONSchema, Transaction, Modifiers, QueryBuilder } from "objection";
import isEmpty from "lodash/isEmpty";

interface IGetRandomByIndustryArgs {
  industryId: string;
  seenTemplateIds: string[];
  sessionId: string;
}

export default class Template extends BaseModel {
  static tableName = "template";

  static jsonSchema: JSONSchema = {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      updatedAt: { type: "string" },
      createdAt: { type: "string" },
      deletedAt: { type: "string" },
    },
  };

  static get modifiers(): Modifiers {
    return {
      randomByIndustryId(
        queryBuilder: QueryBuilder<Template, Template[]>,
        industryId: string,
      ) {
        queryBuilder
          .select("template.*")
          .leftJoin("industry_template as it", (builder) =>
            builder.on("template.id", "=", "it.templateId"),
          )
          .where({ "it.industryId": industryId })
          .orderByRaw("random()");
      },
    };
  }

  static async create(txn: Transaction): Promise<Template> {
    return this.query(txn).insertAndFetch({});
  }

  static async getRandomByIndustryId(
    { industryId, seenTemplateIds, sessionId }: IGetRandomByIndustryArgs,
    txn: Transaction,
  ): Promise<Template> {
    let randomTemplate = await Template.getRandomTemplateFilteredBySeen(
      industryId,
      seenTemplateIds,
      txn,
    );

    if (!randomTemplate && !isEmpty(seenTemplateIds)) {
      randomTemplate = await Template.getRandomTemplateDifferentFromLast(
        industryId,
        sessionId,
        txn,
      );
    }

    if (!randomTemplate) {
      return Promise.reject(
        `No template exists in database for industryId: ${industryId}`,
      );
    }

    return randomTemplate;
  }

  static async getRandomTemplateFilteredBySeen(
    industryId: string,
    seenTemplateIds: string[],
    txn: Transaction,
  ) {
    return this.query(txn)
      .modify("randomByIndustryId", industryId)
      .whereNotIn("templateId", seenTemplateIds)
      .first();
  }

  static async getRandomTemplateDifferentFromLast(
    industryId: string,
    sessionId: string,
    txn: Transaction,
  ) {
    const mostRecentTemplateIdForSessionAndIndustry = await Bio.getMostRecentTemplateIdForSessionAndIndustry(
      sessionId,
      industryId,
      txn,
    );
    return this.query(txn)
      .modify("randomByIndustryId", industryId)
      .whereNot("templateId", mostRecentTemplateIdForSessionAndIndustry)
      .first();
  }
}
