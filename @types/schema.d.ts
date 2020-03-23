declare module "schema" {
  export interface IQuery {
    industries: IIndustry[];
  }

  export interface IMutation {
    bioCreate: IBio;
  }

  export interface IIndustry {
    id: string;
    name: string;
  }

  export interface IBio {
    id: string;
    name: string;
    bioText: string;
  }

  export interface IBioCreateInput {
    industryId: string;
    name: string;
  }
}
