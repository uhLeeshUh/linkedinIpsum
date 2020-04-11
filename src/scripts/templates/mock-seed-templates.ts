import { ITemplateForCreation } from "../../util/create-templates-util";

const mockSeedTemplates: ITemplateForCreation[] = [
  {
    industries: ["advertising"],
    templateChunks: [
      {
        chunkText: "I evolve brands faster than my ",
        followingVariableCategoryName: "things_one_would_evolve",
        variables: [
          { variableText: "Pokemon", isPreferred: true },
          { variableText: "IG story" },
          { variableText: "Warby Parkers" },
          { variableText: "iPhone" },
        ],
      },
      {
        chunkText: ".",
      },
    ],
  },
  {
    industries: ["advertising", "consulting"],
    templateChunks: [
      {
        chunkText: "I squeeze out insights like Dr. Pimple Popper.",
      },
    ],
  },
  {
    industries: ["tech"],
    templateChunks: [
      {
        chunkText: "My code is DRY, like my sense of humor.",
      },
    ],
  },
];

export default mockSeedTemplates;
