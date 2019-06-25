import { Request } from "express";
import { PersistedDataSource } from "./persisted.datasource";

export interface AccessTokenDataSource extends PersistedDataSource
{
  createAccessTokenId():Promise<string>
	findForRequest(req:Request, options?:Object):Promise<Object>
	getIdForRequest(req:Request, options?:Object):string
	resolve(id:string):Promise<Object>
}