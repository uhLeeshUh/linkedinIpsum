import BaseModel from "./base-model";
import { JSONSchema, Transaction, Modifiers, QueryBuilder } from "objection";
import isEmpty from "lodash/isEmpty";

interface IGetRandomByIndustryArgs {
  industryId: string;
  seenTemplateIds: string[];
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
    { industryId, seenTemplateIds }: IGetRandomByIndustryArgs,
    txn: Transaction,
  ): Promise<Template> {
    let randomTemplateFilteredBySeen = await this.query(txn)
      .modify("randomByIndustryId", industryId)
      .whereNotIn("templateId", seenTemplateIds)
      .first();

    if (!randomTemplateFilteredBySeen && !isEmpty(seenTemplateIds)) {
      randomTemplateFilteredBySeen = await this.query(txn)
        .modify("randomByIndustryId", industryId)
        .first();
    }

    if (!randomTemplateFilteredBySeen) {
      return Promise.reject(
        `No template exists in database for industryId: ${industryId}`,
      );
    }

    return randomTemplateFilteredBySeen;
  }
}
