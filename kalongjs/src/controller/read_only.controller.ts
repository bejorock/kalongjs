import { injectable, unmanaged } from "inversify";
import { ReadOnlyModel } from "../model";
import { RepositoryController } from "./repository.controller";
import { ReadOnlyRepository } from "../repository";
import { lBConnectorMethod } from "../decorator";
import { QueryFilter } from "../datasource";

@injectable()
export class ReadOnlyController<T extends ReadOnlyModel> extends RepositoryController
{
  constructor(@unmanaged() protected repo:ReadOnlyRepository<T>) {
    super(repo)
  }

  @lBConnectorMethod
  count(where?:Object):Promise<number> {
    return this.repo.count(where as Object)
  }

  @lBConnectorMethod
  exists(where:Object):Promise<boolean> {
    return this.repo.exists(where)
  }

  @lBConnectorMethod
  find(queryFilter?:QueryFilter):Promise<T[]> {
    return this.repo.find(queryFilter as QueryFilter)
  }

  @lBConnectorMethod
  findById(id:any, queryFilter?:QueryFilter):Promise<T> {
    return this.repo.findById(id, queryFilter as QueryFilter)
  }

  @lBConnectorMethod
  findOne(queryFilter:QueryFilter):Promise<T> {
    return this.repo.findOne(queryFilter)
  }

  @lBConnectorMethod
  findOrCreate(where:Object, model:T):Promise<T> {
    return this.repo.findOrCreate(where, model)
  }
}