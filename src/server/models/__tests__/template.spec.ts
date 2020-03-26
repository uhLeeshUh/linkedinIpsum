import { setupTestDb } from "../../helpers/test-helpers";
import { Transaction, transaction } from "objection";
import Template from "../template";
import Industry from "../industry";
import IndustryTemplate from "../industry-template";

describe("Template model", () => {
  let testDb: ReturnType<typeof setupTestDb>;
  let txn: Transaction;

  beforeAll(async () => {
    testDb = setupTestDb();
  });

  afterAll(async () => {
    await testDb.destroy();
  });

  beforeEach(async () => {
    txn = await transaction.start(Template.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe("create", () => {
    it("creates a template", async () => {
      const result = await Template.create(txn);

      expect(result.id).not.toBeNull();
      expect(result.deletedAt).toBeNull();
      expect(result.createdAt).not.toBeNull();
      expect(result.updatedAt).not.toBeNull();
    });
  });

  describe("getRandomByIndustryId", () => {
    let industry: Industry;
    let template0: Template;
    let template1: Template;
    let template2: Template;

    beforeEach(async () => {
      industry = await Industry.create({ name: "my new industry" }, txn);

      template0 = await Template.create(txn);
      template1 = await Template.create(txn);
      template2 = await Template.create(txn);

      await IndustryTemplate.create(
        { industryId: industry.id, templateId: template0.id },
        txn,
      );
      await IndustryTemplate.create(
        { industryId: industry.id, templateId: template1.id },
        txn,
      );
      await IndustryTemplate.create(
        { industryId: industry.id, templateId: template2.id },
        txn,
      );
    });

    it("gets a template for which there is a matching industry_template entry", async () => {
      const result = await Template.getRandomByIndustryId(industry.id, txn);

      expect([template0, template1, template2]).toContainEqual(
        expect.objectContaining(result),
      );
    });
  });
});
