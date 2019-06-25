import { injectable } from "inversify";
import { Request } from "express";
import { PersistedRepository } from "./persisted.repository";
import { AccessTokenModel } from "../model";
import { AccessTokenDataSource } from "../datasource";

function attachToDs<T extends AccessTokenModel>(entry:Object, ds:AccessTokenDataSource) {
  let tmp = entry as T
  
  tmp.validate = async () => {
    try {
      let i = await ds.resolve(tmp.id)

      if(i)
        return true
    } catch(e) {}

		return false
	}

  return tmp
}

@injectable()
export class AccessTokenRepository extends PersistedRepository<AccessTokenModel>
{
  /* constructor(@unmanaged() protected ds:AccessTokenDataSource, @unmanaged() schema:Function) {
    super(ds, schema)
  } */

  ds:AccessTokenDataSource
  
  public schema:Function = AccessTokenModel

  createAccessTokenId():Promise<string> {
		return this.ds.createAccessTokenId()
	}

	async findForRequest(req:Request, options?:Object):Promise<AccessTokenModel> {
    let i = await this.ds.findForRequest(req, options)
    
    return this.attach(i)
	}

	getIdForRequest(req:Request, options?:Object):string {
		return this.ds.getIdForRequest(req, options)
	}

	async resolve(id:string):Promise<AccessTokenModel> {
    let i = await this.ds.resolve(id)
    
    return this.attach(i)
  }
  
  attach(model:Object):AccessTokenModel {
    let i = super.attach(model)

    return attachToDs(i, this.ds)
  }
}