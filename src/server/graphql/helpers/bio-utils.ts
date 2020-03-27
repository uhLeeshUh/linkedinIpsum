import { Transaction } from "objection";
import TemplateChunk from "../../models/template-chunk";
import BioTemplateChunk, {
  IBioTemplateChunkCreateFields,
} from "../../models/bio-template-chunk";
import Bio from "../../models/bio";
import Variable from "../../models/variable";
import { IBioChunk } from "schema";
import { pick } from "lodash";

interface ICreateBioChunksArgs {
  templateChunksForTemplate: TemplateChunk[];
  createdBio: Bio;
}

export const createBioChunks = async (
  { templateChunksForTemplate, createdBio }: ICreateBioChunksArgs,
  txn: Transaction,
): Promise<IBioChunk[]> => {
  const BIO_CHUNKS: IBioChunk[] = [];

  for (const templateChunk of templateChunksForTemplate) {
    const { preferredVariableId, followingVariableCategoryId } = templateChunk;

    // fetch associated variable if template chunk has a variable
    let followingVariable;
    if (preferredVariableId) {
      followingVariable = await Variable.getById(preferredVariableId, txn);
    } else if (followingVariableCategoryId) {
      followingVariable = await Variable.getRandomByCategoryId(
        followingVariableCategoryId,
        txn,
      );
    }

    let bioTemplateChunkArgs: IBioTemplateChunkCreateFields = {
      bioId: createdBio.id,
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

    BIO_CHUNKS.push({
      id: templateChunk.id,
      templateChunk: pick(templateChunk, ["id", "index", "chunkText"]),
      followingVariable: followingVariable
        ? pick(followingVariable, ["id", "variableText"])
        : null,
    });
  }
  return BIO_CHUNKS;
};
