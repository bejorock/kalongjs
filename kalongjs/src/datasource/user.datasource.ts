import { PersistedDataSource } from "./persisted.datasource";

export interface UserDataSource extends PersistedDataSource
{
  changePassword(userId:any, oldPassword:string, newPassword:string, options?:Object):Promise<void>
	confirm(userId:any, token:string, redirect:string):Promise<void>
	generateVerificationToken(user:Object, options?:Object):Promise<string>
	login(credentials:Object, include?:string[]|string):Promise<Object>
	logout(accessTokenID:string):Promise<void>
	resetPassword(options:Object):Promise<void>
	setPassword(userId:any, newPassword:string, options?:Object):Promise<void>
}