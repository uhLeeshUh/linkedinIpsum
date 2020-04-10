export interface IIndustriesData {
  industries: IIndustry[];
}

export interface IIndustry {
  id: string;
  name: string;
}

export interface IBioCreateVariables {
  name: string;
  industryId: string;
}

export interface IBioCreateData {
  bioCreate: IBio;
}

export interface IBioOptimizeVariables {
  bioId: string;
}

export interface IBioOptimizeData {
  bioOptimize: IBio;
}

export interface IBioResolveVariables {
  bioId: string;
}

export interface IBioData {
  bio: IBio;
}

export interface IBio {
  id: string;
  name: string;
  industryId: string;
  bioChunks: IBioChunk[];
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
