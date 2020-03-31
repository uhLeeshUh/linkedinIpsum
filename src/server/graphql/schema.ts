import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Query {
    industries: [Industry!]!
    bio(bioId: ID!): Bio!
  }

  type Mutation {
    bioCreate(input: BioCreateInput!): Bio!
    bioOptimize(input: BioOptimizeInput!): Bio!
  }

  type Industry {
    id: ID!
    name: String!
  }

  type Bio {
    id: ID!
    name: String!
    bioChunks: [BioChunk!]!
  }

  input BioCreateInput {
    industryId: ID!
    name: String!
  }

  input BioOptimizeInput {
    bioId: ID!
    name: String!
  }

  type BioChunk {
    id: ID! # same as TemplateChunk id
    templateChunk: TemplateChunk!
    followingVariable: Variable
  }

  type TemplateChunk {
    id: ID!
    index: Int!
    chunkText: String!
  }

  type Variable {
    id: ID!
    variableText: String!
  }
`;

export default typeDefs;
