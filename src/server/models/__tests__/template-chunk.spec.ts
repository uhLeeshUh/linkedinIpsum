import { setupTestDb } from "../../helpers/test-helpers";
import { Transaction, transaction } from "objection";
import TemplateChunk from "../template-chunk";
import Template from "../template";
import { getMockAdvertisingTemplateChunks } from "../helpers/spec-helpers";

describe("TemplateChunk model", () => {
  let testDb: ReturnType<typeof setupTestDb>;
  let txn: Transaction;

  beforeAll(async () => {
    testDb = setupTestDb();
  });

  afterAll(async () => {
    await testDb.destroy();
  });

  beforeEach(async () => {
    txn = await transaction.start(TemplateChunk.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe("getAllForTemplate", () => {
    let template: Template;
    let templateChunk0: TemplateChunk;
    let templateChunk1: TemplateChunk;
    let templateChunk2: TemplateChunk;
    let templateChunk3: TemplateChunk;

    beforeEach(async () => {
      ({
        templateChunk0,
        templateChunk1,
        templateChunk2,
        templateChunk3,
      } = await getMockAdvertisingTemplateChunks(txn));
      template = await Template.query(txn).findById(templateChunk0.templateId);
    });

    it("gets all undeleted template chunks for given template", async () => {
      const result = await TemplateChunk.getAllForTemplate(template.id, txn);

      expect(result).toHaveLength(4);
      expect(result).toContainEqual(expect.objectContaining(templateChunk0));
      expect(result).toContainEqual(expect.objectContaining(templateChunk1));
      expect(result).toContainEqual(expect.objectContaining(templateChunk2));
      expect(result).toContainEqual(expect.objectContaining(templateChunk3));
    });

    it("gets all template chunks ordered by index", async () => {
      const result = await TemplateChunk.getAllForTemplate(template.id, txn);

      expect(result[0].id).toBe(templateChunk0.id);
      expect(result[1].id).toBe(templateChunk1.id);
      expect(result[2].id).toBe(templateChunk2.id);
      expect(result[3].id).toBe(templateChunk3.id);
    });
  });
});
