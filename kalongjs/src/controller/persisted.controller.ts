import { injectable, unmanaged } from "inversify";
import { PersistedModel } from "../model";
import { ReadOnlyController } from "./read_only.controller";
import { PersistedRepository } from "../repository";
import { lBConnectorMethod } from "../decorator";

@injectable()
export class PersistedController<T extends PersistedModel> extends ReadOnlyController<T>
{
  constructor(@unmanaged() protected repo:PersistedRepository<T>) {
    super(repo)
  }

  @lBConnectorMethod
  create(model:T|T[]):Promise<T|T[]> {
    return this.repo.create(model)
  }

  @lBConnectorMethod
  destroyAll(where?:Object):Promise<T[]> {
    return this.repo.destroyAll(where as Object)
  }

  @lBConnectorMethod
  destroyById(id:any):Promise<T> {
    return this.repo.destroyById(id)
  }

  @lBConnectorMethod
  updateAll(where:Object, data:Object):Promise<T[]> {
    return this.repo.updateAll(where, data)
  }

  @lBConnectorMethod
  upsert(id:any, model:T):Promise<T> {
    return this.repo.upsert(id, model)
  }

  @lBConnectorMethod
  upsertWithWhere(where:Object, model:T):Promise<T> {
    return this.repo.upsertWithWhere(where, model)
  }
}