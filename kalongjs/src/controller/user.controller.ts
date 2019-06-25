import { unmanaged, inject } from "inversify";
import { UserModel } from "../model";
import { PersistedController } from "./persisted.controller";
import { UserRepository } from "../repository";
import { lBConnectorMethod, Controller, lBTemplate, lBConnector } from "../decorator";

@Controller({ alias: 'User' })
@lBConnector(lBTemplate.User)
export class UserController extends PersistedController<UserModel>
{
  constructor(@inject(UserRepository) protected repo:UserRepository) {
    super(repo)
  }

  @lBConnectorMethod
  changePassword(userId:any, oldPassword:string, newPassword:string, options?:Object):Promise<void> {
    return this.repo.changePassword(userId, oldPassword, newPassword, options as Object)
  }

  @lBConnectorMethod
	confirm(userId:any, token:string, redirect:string):Promise<void> {
    return this.repo.confirm(userId, token, redirect)
  }

  @lBConnectorMethod
	generateVerificationToken(user:Object, options?:Object):Promise<string> {
    return this.repo.generateVerificationToken(user, options)
  }

  @lBConnectorMethod
	login(credentials:Object, include?:string[]|string):Promise<Object> {
    return this.repo.login(credentials, include)
  }

  @lBConnectorMethod
	logout(accessTokenID:string):Promise<void> {
    return this.repo.logout(accessTokenID)
  }

  @lBConnectorMethod
	resetPassword(options:Object):Promise<void> {
    return this.repo.resetPassword(options)
  }

  @lBConnectorMethod
	setPassword(userId:any, newPassword:string, options?:Object):Promise<void> {
    return this.repo.setPassword(userId, newPassword, options as Object)
  }
}