declare module "schema" {
  export interface IQuery {
    industries: IIndustry[];
    bio: IBio;
  }

  export interface IMutation {
    bioCreate: IBio;
    bioOptimize: IBio;
  }

  export interface IIndustry {
    id: string;
    name: string;
  }

  export interface IBio {
    id: string;
    name: string;
    industryId: string;
    bioChunks: IBioChunk[];
  }

  export interface IBioCreateInput {
    industryId: string;
    name: string;
  }

  export interface IBioOptimizeInput {
    bioId: string;
    name: string;
  }

  export interface IBioChunk {
    id: string; // same as templateChunk id
    templateChunk: ITemplateChunk;
    followingVariable: IVariable | null;
  }

  export interface ITemplateChunk {
    id: string;
    index: number;
    chunkText: string;
  }

  export interface IVariable {
    id: string;
    variableText: string;
  }
}
