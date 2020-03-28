import { IBioCreateInput, IBioOptimizeInput } from "schema";
import Bio from "../../models/bio";
import { IGraphQLContext } from "../helpers/graphql-utils";
import Template from "../../models/template";
import TemplateChunk from "../../models/template-chunk";
import {
  createBioChunks,
  createOptimizedBioChunks,
} from "../helpers/bio-utils";
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

export const bioOptimize = async (
  root: {},
  args: { input: IBioOptimizeInput },
  { getDatabaseTransaction, testTransaction }: IGraphQLContext,
) => {
  return getDatabaseTransaction(testTransaction, async txn => {
    const { bioId, name } = args.input;

    const optimizedBio = await Bio.create({ name }, txn);

    const oldBioTemplateChunks = await BioTemplateChunk.getAllForBio(
      bioId,
      txn,
    );

    const bioChunks = await createOptimizedBioChunks(
      { oldBioTemplateChunks, optimizedBio },
      txn,
    );

    return { id: optimizedBio.id, name: optimizedBio.name, bioChunks };
  });
};
