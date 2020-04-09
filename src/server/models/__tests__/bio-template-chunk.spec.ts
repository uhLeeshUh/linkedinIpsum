import { setupTestDb } from "../../helpers/test-helpers";
import { Transaction, transaction } from "objection";
import BioTemplateChunk from "../bio-template-chunk";
import Bio from "../bio";
import TemplateChunk from "../template-chunk";
import Variable from "../variable";
import { getMockAdvertisingTemplateChunks } from "../helpers/spec-helpers";
import Industry from "../industry";

describe("BioTemplateChunk model", () => {
  let testDb: ReturnType<typeof setupTestDb>;
  let txn: Transaction;

  beforeAll(async () => {
    testDb = setupTestDb();
  });

  afterAll(async () => {
    await testDb.destroy();
  });

  beforeEach(async () => {
    txn = await transaction.start(BioTemplateChunk.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe("getAllForBio", () => {
    describe("for bios with interchangeable variables", () => {
      let bio: Bio;
      let templateChunk0: TemplateChunk;
      let templateChunk1: TemplateChunk;
      let templateChunk2: TemplateChunk;
      let templateChunk3: TemplateChunk;
      let variable0: Variable;
      let variable1: Variable;
      let variable2: Variable;
      let bioTemplateChunk0: BioTemplateChunk;
      let bioTemplateChunk1: BioTemplateChunk;
      let bioTemplateChunk2: BioTemplateChunk;
      let bioTemplateChunk3: BioTemplateChunk;

      beforeEach(async () => {
        const industry = await Industry.create({ name: "industry-name" }, txn);
        bio = await Bio.create(
          { name: "Katniss Everdeen", industryId: industry.id },
          txn,
        );

        ({
          templateChunk0,
          templateChunk1,
          templateChunk2,
          templateChunk3,
        } = await getMockAdvertisingTemplateChunks(txn));

        variable0 = await Variable.query(txn).findOne({
          variableText: "banker",
        });
        variable1 = await Variable.query(txn).findOne({
          variableText: "novelist",
        });
        variable2 = await Variable.query(txn).findOne({
          variableText: "baby",
        });

        bioTemplateChunk0 = await BioTemplateChunk.create(
          {
            bioId: bio.id,
            templateChunkId: templateChunk0.id,
            followingVariableId: variable0.id,
          },
          txn,
        );
        bioTemplateChunk1 = await BioTemplateChunk.create(
          {
            bioId: bio.id,
            templateChunkId: templateChunk1.id,
            followingVariableId: variable1.id,
          },
          txn,
        );
        bioTemplateChunk2 = await BioTemplateChunk.create(
          {
            bioId: bio.id,
            templateChunkId: templateChunk2.id,
            followingVariableId: variable2.id,
          },
          txn,
        );
        bioTemplateChunk3 = await BioTemplateChunk.create(
          {
            bioId: bio.id,
            templateChunkId: templateChunk3.id,
          },
          txn,
        );
      });

      it("gets all for bio with associated TemplateChunk (and Variable if exists)", async () => {
        const result = await BioTemplateChunk.getAllForBio(bio.id, txn);

        expect(result).toHaveLength(4);
        expect(result).toContainEqual(
          expect.objectContaining({
            id: bioTemplateChunk0.id,
            templateChunk: expect.objectContaining({ id: templateChunk0.id }),
            followingVariable: expect.objectContaining({ id: variable0.id }),
          }),
        );
        expect(result).toContainEqual(
          expect.objectContaining({
            id: bioTemplateChunk1.id,
            templateChunk: expect.objectContaining({ id: templateChunk1.id }),
            followingVariable: expect.objectContaining({ id: variable1.id }),
          }),
        );
        expect(result).toContainEqual(
          expect.objectContaining({
            id: bioTemplateChunk2.id,
            templateChunk: expect.objectContaining({ id: templateChunk2.id }),
            followingVariable: expect.objectContaining({ id: variable2.id }),
          }),
        );
        expect(result).toContainEqual(
          expect.objectContaining({
            id: bioTemplateChunk3.id,
            templateChunk: expect.objectContaining({ id: templateChunk3.id }),
          }),
        );
      });

      it("gets all for bio ordered by the index of associated TemplateChunk", async () => {
        const result = await BioTemplateChunk.getAllForBio(bio.id, txn);

        expect(result[0]).toMatchObject({
          id: bioTemplateChunk0.id,
        });
        expect(result[1]).toMatchObject({
          id: bioTemplateChunk1.id,
        });
        expect(result[2]).toMatchObject({
          id: bioTemplateChunk2.id,
        });
        expect(result[3]).toMatchObject({
          id: bioTemplateChunk3.id,
        });
      });
    });

    describe("for bios without interchangeable variables", () => {
      let bio: Bio;
      let templateChunk0: TemplateChunk;
      let bioTemplateChunk0: BioTemplateChunk;

      beforeEach(async () => {
        const industry = await Industry.create({ name: "industry-name" }, txn);
        bio = await Bio.create(
          { name: "Neville Longbottom", industryId: industry.id },
          txn,
        );
        templateChunk0 = await TemplateChunk.query(txn).findOne({
          chunkText: "Dangerous when bored.",
        });
        bioTemplateChunk0 = await BioTemplateChunk.create(
          { bioId: bio.id, templateChunkId: templateChunk0.id },
          txn,
        );
      });

      it("gets the first template chunk and followingVariable is null", async () => {
        const result = await BioTemplateChunk.getAllForBio(bio.id, txn);

        expect(result).toHaveLength(1);
        expect(result[0]).toMatchObject({
          id: bioTemplateChunk0.id,
          templateChunk: expect.objectContaining({ id: templateChunk0.id }),
          followingVariable: null,
        });
      });
    });
  });
});
