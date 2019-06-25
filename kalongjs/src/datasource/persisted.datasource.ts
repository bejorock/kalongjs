export interface QueryFilter
{
  fields?:Object|string[]|Object[]|string
  where:Object
  include?:Object|string[]|Object[]|string,
  limit?:number,
  order?:Object|string
  skip?:number
} 

export interface PersistedDataSource
{
  create(model:Object|Object[]):Promise<Object[]>
  count(where?:Object):Promise<number>
  destroyAll(where?:Object):Promise<Object[]>
  destroyById(id:any):Promise<Object>
  exists(where:Object):Promise<boolean>
  find(queryFilter?:QueryFilter):Promise<Object[]>
  findById(id:any, queryFilter?:QueryFilter):Promise<Object>
  findOne(queryFilter:QueryFilter):Promise<Object>
  findOrCreate(where:Object, model:Object):Promise<Object>
  updateAll(where:Object, data:Object):Promise<Object[]>
  upsert(id:any, model:Object):Promise<Object>
  upsertWithWhere(where:Object, model:Object):Promise<Object>
}