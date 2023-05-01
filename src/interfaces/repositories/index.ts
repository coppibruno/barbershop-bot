export interface WhereRepository {
  where?: any;
}

export interface IRepository {
  create?(entity: any): any;

  find?(where: WhereRepository): any;

  save?(entity: string): any;

  delete?(): any;
}
