import { setupTestDb } from "../../helpers/test-helpers";
import { Transaction, transaction } from "objection";
import Industry from "../industry";

describe("Industry model", () => {
  let testDb: ReturnType<typeof setupTestDb>;
  let txn: Transaction;

  beforeAll(async () => {
    testDb = setupTestDb();
  });

  afterAll(async () => {
    await testDb.destroy();
  });

  beforeEach(async () => {
    txn = await transaction.start(Industry.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe("create", () => {
    it("creates an industry", async () => {
      const allIndustries = await Industry.query(txn);
      const result = await Industry.create({ name: "accounting" }, txn);
      const allIndustriesPlusNew = await Industry.query(txn);

      expect(allIndustries).toHaveLength(4);
      expect(result.name).toBe("accounting");
      expect(allIndustriesPlusNew).toHaveLength(5);
    });
  });
});
