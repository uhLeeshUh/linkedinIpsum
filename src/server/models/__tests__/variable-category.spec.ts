import { setupTestDb } from "../../helpers/test-helpers";
import { Transaction, transaction } from "objection";
import VariableCategory from "../variable-category";

describe("VariableCategory model", () => {
  let testDb: ReturnType<typeof setupTestDb>;
  let txn: Transaction;

  beforeAll(async () => {
    testDb = setupTestDb();
  });

  afterAll(async () => {
    await testDb.destroy();
  });

  beforeEach(async () => {
    txn = await transaction.start(VariableCategory.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe("create", () => {
    it("creates a variable category", async () => {
      const result = await VariableCategory.create(
        { categoryName: "song_with_bad_lyrics" },
        txn,
      );

      expect(result.categoryName).toBe("song_with_bad_lyrics");
      expect(result.deletedAt).toBeNull();
    });
  });

  describe("getByName", () => {
    it("gets a variable category by name", async () => {
      const createdCategory = await VariableCategory.create(
        { categoryName: "song_with_bad_lyrics" },
        txn,
      );
      const result = await VariableCategory.getByName(
        "song_with_bad_lyrics",
        txn,
      );

      expect(result!.id).toBe(createdCategory.id);
      expect(result!.categoryName).toBe("song_with_bad_lyrics");
    });

    it("returns undefined if the variable category does not exist", async () => {
      const result = await VariableCategory.getByName(
        "song_with_bad_lyrics",
        txn,
      );

      expect(result).toBeUndefined();
    });
  });
});
