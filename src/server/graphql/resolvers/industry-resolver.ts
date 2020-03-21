import { IIndustry } from "schema";

export const resolveIndustries = (
  root: {},
  args: {},
  context: {},
): IIndustry[] => {
  return [
    { id: "123-finance", name: "finance" },
    { id: "123-tech", name: "tech" },
    { id: "123-advertising", name: "advertising" },
    { id: "123-consulting", name: "consulting" },
  ];
};
