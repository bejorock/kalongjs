import { injectable } from "inversify";
import { BaseRepository } from "./base.repository";
import { ReadOnlyModel } from "../model";
import { PersistedDataSource, QueryFilter } from "../datasource";

function attachToDs<T extends ReadOnlyModel>(entry:object, ds:PersistedDataSource) {
  let tmp = entry as T
  
  tmp.reload = async () => {
    let i = await ds.findById(tmp.id)

    Object.assign(tmp, i)
  }

  return tmp
}

@injectable()
export class ReadOnlyRepository<T extends ReadOnlyModel> extends BaseRepository
{
  ds:PersistedDataSource

  count(where:object):Promise<number> {
    return this.ds.count(where)
  }

  exists(where:object):Promise<boolean> {
    return this.ds.exists(where)
  }

  async find(queryFilter:QueryFilter):Promise<T[]> {
    let i = await this.ds.find(queryFilter)

    return i.map(e => this.attach(e))
  }

  async findById(id:any, queryFilter:QueryFilter):Promise<T> {
    let i = await this.ds.findById(id, queryFilter)

    return this.attach(i) as T
  }

  async findOne(queryFilter:QueryFilter):Promise<T> {
    let i = await this.ds.findOne(queryFilter)

    return this.attach(i) as T
  }

  async findOrCreate(where:object, model:T):Promise<T> {
    let i = await this.ds.findOrCreate(where, model)

    return this.attach(i) as T
  }

  attach(model:any):T {
    let i = Object.assign(this.newModel(), model['__data'])

    return attachToDs(i, this.ds)
  }

  setDataSource(ds:PersistedDataSource) {
    this.ds = ds
  }

  getDataSource() {
    return this.ds
  }
} 