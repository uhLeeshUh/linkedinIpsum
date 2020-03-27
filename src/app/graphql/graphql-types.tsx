export interface IIndustriesData {
  industries: IIndustry[];
}

export interface IIndustry {
  id: string;
  name: string;
}

export interface IBioCreateData {
  bioCreate: IBio;
}

export interface IBioData {
  bio: IBio;
}

export interface IBio {
  id: string;
  name: string;
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
