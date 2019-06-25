import { injectable } from "inversify";
import { PersistedRepository } from "./persisted.repository";
import { RoleModel } from "../model";
import { RoleDataSource } from "../datasource";

@injectable()
export class RoleRepository extends PersistedRepository<RoleModel>
{
	ds:RoleDataSource
	
	public schema:Function = RoleModel

  getRoles(context:Object):Promise<string[]> {
    return this.ds.getRoles(context)
	}

	isAuthenticated(context:Object):Promise<boolean> {
    return this.ds.isAuthenticated(context)
	}

	isInRole(role:string, context:Object):Promise<boolean> {
		return this.ds.isInRole(role, context)
	}

	isOwner(modelClass:Function, modelId:any, userId:any, principalType:string, options?:Object):Promise<boolean> {
		return this.ds.isOwner(modelClass, modelId, userId, principalType, options)
	}

	registerResolver(role:string, resolver:Function):void {
		this.ds.registerResolver(role, resolver)
	}
}