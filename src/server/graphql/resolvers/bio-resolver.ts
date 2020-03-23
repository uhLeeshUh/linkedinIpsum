import { IBio, IBioCreateInput } from "schema";

export const resolveBio = (
  root: {},
  args: { bioId: string },
  context: {},
): IBio => {
  type BioIds =
    | "123-finance-bio-id"
    | "123-tech-bio-id"
    | "123-advertising-bio-id"
    | "123-consulting-bio-id";

  const bioMap: Record<BioIds, IBio> = {
    "123-finance-bio-id": {
      id: "123-finance-bio-id",
      name: "Test name",
      bioText: "finance bio here",
    },
    "123-tech-bio-id": {
      id: "123-tech-bio-id",
      name: "Test name",
      bioText: "tech bio here",
    },
    "123-advertising-bio-id": {
      id: "123-advertising-bio-id",
      name: "Test name",
      bioText: "advertising bio here",
    },
    "123-consulting-bio-id": {
      id: "123-consulting-bio-id",
      name: "Test name",
      bioText: "consulting bio here",
    },
  };

  return bioMap[args.bioId as BioIds];
};

export const bioCreate = (
  root: {},
  args: { input: IBioCreateInput },
  context: {},
): IBio => {
  type IndustryIds =
    | "123-finance"
    | "123-tech"
    | "123-advertising"
    | "123-consulting";
  const bioMap: Record<IndustryIds, string> = {
    "123-finance": "finance bio here",
    "123-tech": "tech bio here",
    "123-advertising": "advertising bio here",
    "123-consulting": "consulting bio here",
  };
  const mappedBioTextByIndustry = bioMap[args.input.industryId as IndustryIds];
  return {
    id: `${args.input.industryId}-bio-id`,
    name: args.input.name,
    bioText: mappedBioTextByIndustry,
  };
};
