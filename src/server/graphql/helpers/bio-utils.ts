import { Transaction } from "objection";
import TemplateChunk from "../../models/template-chunk";
import BioTemplateChunk, {
  IBioTemplateChunkCreateFields,
} from "../../models/bio-template-chunk";
import Bio from "../../models/bio";
import Variable from "../../models/variable";
import { IBioChunk } from "schema";
import pick from "lodash/pick";

interface ICreateBioChunksArgs {
  templateChunksForTemplate: TemplateChunk[];
  createdBio: Bio;
}

interface ICreateOptimizedBioChunksArgs {
  oldBioTemplateChunks: BioTemplateChunk[];
  optimizedBio: Bio;
}

export const createBioChunks = async (
  { templateChunksForTemplate, createdBio }: ICreateBioChunksArgs,
  txn: Transaction,
): Promise<IBioChunk[]> => {
  const BIO_CHUNKS: IBioChunk[] = [];

  for (const templateChunk of templateChunksForTemplate) {
    const { preferredVariableId, followingVariableCategoryId } = templateChunk;

    // fetch associated variable if template chunk has a variable
    let followingVariable: Variable | undefined;
    if (preferredVariableId) {
      followingVariable = await Variable.getById(preferredVariableId, txn);
    } else if (followingVariableCategoryId) {
      followingVariable = await Variable.getRandomByCategoryId(
        { variableCategoryId: followingVariableCategoryId },
        txn,
      );
    }

    const bioChunk = await createBioChunk(
      createdBio.id,
      templateChunk,
      followingVariable,
      txn,
    );

    BIO_CHUNKS.push(bioChunk);
  }
  return BIO_CHUNKS;
};

export const createOptimizedBioChunks = async (
  { oldBioTemplateChunks, optimizedBio }: ICreateOptimizedBioChunksArgs,
  txn: Transaction,
) => {
  const BIO_CHUNKS: IBioChunk[] = [];

  for (const bioTemplateChunk of oldBioTemplateChunks) {
    const { templateChunk, followingVariable } = bioTemplateChunk;

    let optimizedVariable: Variable | undefined | null;
    if (templateChunk.followingVariableCategoryId && followingVariable) {
      optimizedVariable = await Variable.getRandomByCategoryId(
        {
          variableCategoryId: templateChunk.followingVariableCategoryId,
          excludedVariableId: followingVariable.id,
        },
        txn,
      );
    }

    // if there is no other variable than the one in the current bio, use the current one
    optimizedVariable = optimizedVariable
      ? optimizedVariable
      : followingVariable;

    const bioChunk = await createBioChunk(
      optimizedBio.id,
      templateChunk,
      optimizedVariable,
      txn,
    );

    BIO_CHUNKS.push(bioChunk);
  }
  return BIO_CHUNKS;
};

const createBioChunk = async (
  bioId: string,
  templateChunk: TemplateChunk,
  followingVariable: Variable | null | undefined,
  txn: Transaction,
) => {
  let bioTemplateChunkArgs: IBioTemplateChunkCreateFields = {
    bioId,
    templateChunkId: templateChunk.id,
  };

  if (followingVariable) {
    bioTemplateChunkArgs = {
      ...bioTemplateChunkArgs,
      followingVariableId: followingVariable.id,
    };
  }

  // create a BioTemplateChunk
  await BioTemplateChunk.create(bioTemplateChunkArgs, txn);

  // return BioChunk for API
  return {
    id: templateChunk.id,
    templateChunk: pick(templateChunk, ["id", "index", "chunkText"]),
    followingVariable: followingVariable
      ? pick(followingVariable, ["id", "variableText"])
      : null,
  };
};
