export interface WhereRepository {
  where?: any;
}

export default interface IRepository {
  create(entity: any): any;

  find(where: WhereRepository): any;

  save(entity: string): any;

  delete(): any;
}
