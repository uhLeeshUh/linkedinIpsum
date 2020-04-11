import { setupTestDb } from "../../server/helpers/test-helpers";
import { Transaction, transaction, Model } from "objection";
import { loadTemplates } from "../load-templates";
import TemplateChunk from "../../server/models/template-chunk";
import VariableCategory from "../../server/models/variable-category";
import Variable from "../../server/models/variable";

describe("Load templates script", () => {
  let testDb: ReturnType<typeof setupTestDb>;
  let txn: Transaction;

  beforeAll(async () => {
    testDb = setupTestDb();
  });

  afterAll(async () => {
    await testDb.destroy();
  });

  beforeEach(async () => {
    txn = await transaction.start(Model.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe("script correctly loads templates into the database", () => {
    it("loads templates when passed in 'mock-seed-templates.ts' arg", async () => {
      await loadTemplates("mock-seed-templates.ts", txn);

      const templateChunkWithVariables = await TemplateChunk.query(
        txn,
      ).findOne({ chunkText: "I evolve brands faster than my ", index: 0 });
      const secondTemplateChunk = await TemplateChunk.query(txn).findOne({
        chunkText: ".",
        index: 1,
        templateId: templateChunkWithVariables.templateId,
      });
      const variableCategory = await VariableCategory.getByName(
        "things_one_would_evolve",
        txn,
      );
      const variable0 = await Variable.query(txn).findOne({
        variableText: "Pokemon",
      });
      const variable1 = await Variable.query(txn).findOne({
        variableText: "IG story",
      });
      const variable2 = await Variable.query(txn).findOne({
        variableText: "Warby Parkers",
      });
      const variable3 = await Variable.query(txn).findOne({
        variableText: "iPhone",
      });

      const templateChunkWithoutVariables0 = await TemplateChunk.query(
        txn,
      ).findOne({
        chunkText: "I squeeze out insights like Dr. Pimple Popper.",
        index: 0,
      });

      const templateChunkWithoutVariables1 = await TemplateChunk.query(
        txn,
      ).findOne({
        chunkText: "My code is DRY, like my sense of humor.",
        index: 0,
      });

      expect(templateChunkWithVariables).toBeTruthy();
      expect(templateChunkWithVariables.preferredVariableId).toBe(variable0.id);
      expect(secondTemplateChunk).toBeTruthy();
      expect(variableCategory).toBeTruthy();
      expect(variable0).toBeTruthy();
      expect(variable1).toBeTruthy();
      expect(variable2).toBeTruthy();
      expect(variable3).toBeTruthy();
      expect(templateChunkWithoutVariables0).toBeTruthy();
      expect(templateChunkWithoutVariables1).toBeTruthy();
    });

    it("throws error if passed file name cannot be resolved in file tree", async () => {
      await expect(loadTemplates("i-do-not-exist.ts", txn)).resolves.toMatch(
        "Cannot locate file at path",
      );
    });
  });
});
