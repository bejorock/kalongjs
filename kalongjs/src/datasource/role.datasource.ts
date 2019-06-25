import { PersistedDataSource } from "./persisted.datasource";

export interface RoleDataSource extends PersistedDataSource
{
  getRoles(context:Object):Promise<string[]>
	isAuthenticated(context:Object):Promise<boolean>
	isInRole(role:string, context:Object):Promise<boolean>
	isOwner(modelClass:Function, modelId:any, userId:any, principalType:string, options?:Object):Promise<boolean>
	registerResolver(role:string, resolver:Function):void
}