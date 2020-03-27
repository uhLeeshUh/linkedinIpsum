import "graphql-import-node";
import { resolveIndustries } from "./resolvers/industry-resolver";
import { bioCreate, resolveBio, bioOptimize } from "./resolvers/bio-resolver";
import typeDefs from "./schema.graphql";

const resolvers = {
  Query: {
    industries: resolveIndustries,
    bio: resolveBio,
  },
  Mutation: {
    bioCreate,
    bioOptimize,
  },
};

const schema = { typeDefs, resolvers };

export default schema;
