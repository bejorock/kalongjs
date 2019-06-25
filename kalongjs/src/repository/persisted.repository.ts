import { injectable } from "inversify";
import { ReadOnlyRepository } from "./read_only.repository";
import { PersistedModel } from "../model";
import { PersistedDataSource } from "../datasource";

function attachToDs<T extends PersistedModel>(entry:object, ds:PersistedDataSource) {
  let tmp = entry as T
  
  tmp.destroy = async () => {
    await ds.destroyById(tmp.id)
  }

  tmp.save = async () => {
    let i = await ds.upsert(tmp.id, tmp)

    Object.assign(tmp, i)
  }

  tmp.updateAttribute = async (key:string, value:any) => {
    let entry:any = {}
    entry[key] = value

    await tmp.updateAttributes(entry)
  }

  tmp.updateAttributes = async (meta:object) => {
    let i = await ds.updateAll({ id: tmp.id }, meta)
  
    Object.assign(tmp, i)
  }

  return tmp
}

@injectable()
export class PersistedRepository<T extends PersistedModel> extends ReadOnlyRepository<T>
{
  async create(model:T|T[]):Promise<T[]|T> {
    let i = await this.ds.create(model)

    if(Array.isArray(i))
      return i.map(e => this.attach(e))

    return this.attach(i) as T
  }

  async destroyAll(where:object):Promise<T[]> {
    let i = await this.ds.destroyAll(where)

    return i.map(e => this.attach(e))
  }

  async destroyById(id:any):Promise<T> {
    let i = await this.ds.destroyById(id)

    return this.attach(i) as T
  }

  async updateAll(where:object, data:object):Promise<T[]> {
    let i = await this.ds.updateAll(where, data)

    return i.map(e => this.attach(e))
  }

  async upsert(id:any, model:T):Promise<T> {
    let i = await this.ds.upsert(id, model)

    return this.attach(i) as T
  }

  async upsertWithWhere(where:object, model:T):Promise<T> {
    let i = await this.ds.upsertWithWhere(where, model)

    return this.attach(i) as T
  }

  attach(model:Object):T {
    let i = super.attach(model)

    return attachToDs(i, this.ds)
  }
}