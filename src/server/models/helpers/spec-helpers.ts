import { Transaction } from "objection";
import TemplateChunk from "../template-chunk";

export const getMockAdvertisingTemplateChunks = async (txn: Transaction) => {
  const templateChunk0 = await TemplateChunk.query(txn).findOne({
    chunkText: "I am an ex-",
    index: 0,
  });
  const templateChunk1 = await TemplateChunk.query(txn).findOne({
    chunkText: ", ex-",
    index: 1,
  });
  const templateChunk2 = await TemplateChunk.query(txn).findOne({
    chunkText: ", ex-",
    index: 2,
  });
  const templateChunk3 = await TemplateChunk.query(txn).findOne({
    chunkText: " turned creative marketer.",
    index: 3,
  });

  return { templateChunk0, templateChunk1, templateChunk2, templateChunk3 };
};
