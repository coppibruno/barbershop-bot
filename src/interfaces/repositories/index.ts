export interface OptionsQuery {
  where?: any;
  orderBy?: any;
}

export interface IRepository {
  create?(entity: any): any;

  find?(where: OptionsQuery): any;

  save?(entity: string): any;

  delete?(): any;
}
