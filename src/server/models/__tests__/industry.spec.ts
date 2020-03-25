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

  describe("getAll", () => {
    it("gets all industries", async () => {
      const result = await Industry.getAll(txn);

      expect(result).toHaveLength(4);
      expect(result).toContainEqual(expect.objectContaining({ name: "tech" }));
      expect(result).toContainEqual(
        expect.objectContaining({ name: "consulting" }),
      );
      expect(result).toContainEqual(
        expect.objectContaining({ name: "finance" }),
      );
      expect(result).toContainEqual(
        expect.objectContaining({ name: "advertising" }),
      );
    });

    it("does not return a deleted industry", async () => {
      const techIndustry = await Industry.query(txn).findOne({ name: "tech" });
      await techIndustry
        .$query(txn)
        .patchAndFetch({ deletedAt: new Date().toISOString() });
      const result = await Industry.getAll(txn);

      expect(result).toHaveLength(3);
    });
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
