import { IBio, IBioCreateInput } from "schema";

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
