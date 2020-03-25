import { setupTestDb } from "../../helpers/test-helpers";
import { Transaction, transaction } from "objection";
import Template from "../template";

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
});
