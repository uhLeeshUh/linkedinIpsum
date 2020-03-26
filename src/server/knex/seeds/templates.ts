import * as Knex from "knex";
import { transaction, Model } from "objection";
import { setupTestDb } from "../../helpers/test-helpers";
import createTemplatesUtil, {
  ITemplateForCreation,
} from "../../helpers/create-templates-util";

export async function seed(knex: Knex): Promise<any> {
  const setupDb = setupTestDb();

  // delete existing entries in below tables
  await knex("template").del();
  await knex("industry_template").del();
  await knex("template_chunk").del();
  await knex("variable_category").del();
  await knex("variable").del();

  try {
    await transaction(Model.knex(), async txn => {
      return createTemplatesUtil(SEED_TEMPLATES, txn);
    });
  } catch (err) {
    console.error(`ERROR! ${err}`);
  } finally {
    setupDb.destroy();
  }
}

const SEED_TEMPLATES: ITemplateForCreation[] = [
  {
    industries: ["advertising"],
    templateChunks: [
      {
        chunkText: "I am an ex-",
        followingVariableCategoryName: "high_powered_corporate_professional",
        variables: [
          { variableText: "banker", isPreferred: true },
          { variableText: "lawyer" },
          { variableText: "management consultant" },
          { variableText: "hedge fund manager" },
        ],
      },
      {
        chunkText: ", ex-",
        followingVariableCategoryName: "exclusive_low_salary_professional",
        variables: [
          { variableText: "comic", isPreferred: true },
          { variableText: "chef" },
          { variableText: "novelist" },
          { variableText: "actor" },
        ],
      },
      {
        chunkText: ", ex-",
        followingVariableCategoryName:
          "self_describing_noun_you_have_grown_out_of",
        variables: [
          { variableText: "baby", isPreferred: true },
          { variableText: "size 2" },
        ],
      },
      {
        chunkText: " turned creative marketer.",
      },
    ],
  },
  {
    industries: ["advertising", "consulting", "finance"],
    templateChunks: [
      {
        chunkText: "I don't just generate leads, I am a generational leader.",
      },
    ],
  },
  {
    industries: ["advertising", "consulting", "finance", "tech"],
    templateChunks: [
      {
        chunkText: "Dangerous when bored.",
      },
    ],
  },
];
