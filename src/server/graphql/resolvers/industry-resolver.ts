import { IIndustry } from "schema";
import { IGraphQLContext } from "../helpers/graphql-utils";
import Industry from "../../models/industry";

export const resolveIndustries = async (
  root: {},
  args: {},
  { getDatabaseTransaction, testTransaction }: IGraphQLContext,
): Promise<IIndustry[]> => {
  return getDatabaseTransaction(testTransaction, async txn => {
    return Industry.getAll(txn);
  });
};
