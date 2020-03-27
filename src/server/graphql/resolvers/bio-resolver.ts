import { IBioCreateInput } from "schema";
import Bio from "../../models/bio";
import { IGraphQLContext } from "../helpers/graphql-utils";
import Template from "../../models/template";
import TemplateChunk from "../../models/template-chunk";
import { createBioChunks } from "../helpers/bio-utils";
import BioTemplateChunk from "../../models/bio-template-chunk";
import { pick } from "lodash";

export const resolveBio = async (
  root: {},
  args: { bioId: string },
  { getDatabaseTransaction, testTransaction }: IGraphQLContext,
) => {
  return getDatabaseTransaction(testTransaction, async txn => {
    const resolvedBio = await Bio.getById(args.bioId, txn);
    const bioTemplateChunks = await BioTemplateChunk.getAllForBio(
      args.bioId,
      txn,
    );
    const bioChunks = bioTemplateChunks.map(bioTemplateChunk => ({
      id: bioTemplateChunk.templateChunk.id,
      templateChunk: pick(bioTemplateChunk.templateChunk, [
        "id",
        "index",
        "chunkText",
      ]),
      followingVariable: bioTemplateChunk.followingVariable
        ? pick(bioTemplateChunk.followingVariable, ["id", "variableText"])
        : null,
    }));

    return { id: resolvedBio.id, name: resolvedBio.name, bioChunks };
  });
};

export const bioCreate = async (
  root: {},
  args: { input: IBioCreateInput },
  { getDatabaseTransaction, testTransaction }: IGraphQLContext,
) => {
  return getDatabaseTransaction(testTransaction, async txn => {
    const { name, industryId } = args.input;

    const createdBio = await Bio.create({ name }, txn);

    const randomTemplateForBio = await Template.getRandomByIndustryId(
      industryId,
      txn,
    );

    const templateChunksForTemplate = await TemplateChunk.getAllForTemplate(
      randomTemplateForBio.id,
      txn,
    );

    const bioChunks = await createBioChunks(
      { templateChunksForTemplate, createdBio },
      txn,
    );

    return { id: createdBio.id, name: createdBio.name, bioChunks };
  });
};

// export const bioOptimize = async (){
// create a BIO CHUNKS array that starts as empty
// loop through those bio_template_chunks
//  X    if followingVariableCategoryId, load a random Variable with that category where deletedAt = null THAT IS DIFFERENT FROM THE CURRENT ID, add that on to query builder optionally
//      NOTE: should look up how to select randomly in SQL
//      if there is no other variable than the one in the current bio, use the current one
//  X    create a BioTemplateChunk entry with BIO id, TEMPLATE CHUNK id and possibly followingVariableId
//  X    push into BIO CHUNKS array { id: template_chunk.id, TEMPLATE CHUNK (picked), potentially FOLLOWING VARIABLE (picked)}
// return Bio graphql type

// }
