declare module "schema" {
  export interface IQuery {
    industries: IIndustry[];
  }

  export interface IIndustry {
    id: string;
    name: string;
  }
}
