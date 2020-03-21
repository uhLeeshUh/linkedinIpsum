import "graphql-import-node";
import { resolveIndustries } from "./resolvers/industry-resolver";
import typeDefs from "./schema.graphql";

const resolvers = {
  Query: {
    industries: resolveIndustries,
  },
};

const schema = { typeDefs, resolvers };

export default schema;
