import { setupTestDb } from "../../helpers/test-helpers";
import { Transaction, transaction } from "objection";
import Variable from "../variable";
import VariableCategory from "../variable-category";

describe("Variable model", () => {
  let testDb: ReturnType<typeof setupTestDb>;
  let txn: Transaction;

  beforeAll(async () => {
    testDb = setupTestDb();
  });

  afterAll(async () => {
    await testDb.destroy();
  });

  beforeEach(async () => {
    txn = await transaction.start(Variable.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe("getRandomByCategoryId", () => {
    let variableCategory: VariableCategory;
    let variable0: Variable;
    let variable1: Variable;
    let variable2: Variable;
    let variable3: Variable;

    beforeEach(async () => {
      variableCategory = await VariableCategory.query(txn).findOne({
        categoryName: "high_powered_corporate_professional",
      });
      variable0 = await Variable.query(txn).findOne({ variableText: "banker" });
      variable1 = await Variable.query(txn).findOne({ variableText: "lawyer" });
      variable2 = await Variable.query(txn).findOne({
        variableText: "management consultant",
      });
      variable3 = await Variable.query(txn).findOne({
        variableText: "hedge fund manager",
      });
    });

    it("gets an undeleted variable in given category", async () => {
      const result = await Variable.getRandomByCategoryId(
        { variableCategoryId: variableCategory.id },
        txn,
      );

      expect([variable0, variable1, variable2, variable3]).toContainEqual(
        expect.objectContaining(result),
      );
    });

    it("gets a different variable than the excluded one when excludedVariableId is passed", async () => {
      const result = await Variable.getRandomByCategoryId(
        {
          variableCategoryId: variableCategory.id,
          excludedVariableId: variable0.id,
        },
        txn,
      );

      expect(result!.id).not.toBe(variable0.id);
      expect([variable1, variable2, variable3]).toContainEqual(
        expect.objectContaining(result),
      );
    });

    it("returns undefined when passed excludedVariableId and no other variable exists for the category", async () => {
      await Variable.query(txn).patchAndFetchById(variable1.id, {
        deletedAt: new Date().toISOString(),
      });
      await Variable.query(txn).patchAndFetchById(variable2.id, {
        deletedAt: new Date().toISOString(),
      });
      await Variable.query(txn).patchAndFetchById(variable3.id, {
        deletedAt: new Date().toISOString(),
      });

      const result = await Variable.getRandomByCategoryId(
        {
          variableCategoryId: variableCategory.id,
          excludedVariableId: variable0.id,
        },
        txn,
      );

      expect(result).toBeUndefined();
    });
  });
});
