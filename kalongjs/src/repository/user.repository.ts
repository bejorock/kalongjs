import { injectable, inject } from "inversify";
import { AccessTokenRepository } from "./access_token.repository";
import { PersistedRepository } from "./persisted.repository";
import { UserModel, AccessTokenModel } from "../model";
import { UserDataSource } from "../datasource";
import { Repository } from "../decorator";

let bcrypt:any;
try {
  // Try the native module first
  bcrypt = require('bcrypt');
  // Browserify returns an empty object
  if (bcrypt && typeof bcrypt.compare !== 'function') {
    bcrypt = require('bcryptjs');
  }
} catch (err) {
  // Fall back to pure JS impl
  bcrypt = require('bcryptjs');
}

interface TtlArgs
{
  ttl:number
  scopes?:string[]
}

function attachToDs<T extends UserModel>(entry:Object, ds:UserDataSource, tokenRepo:AccessTokenRepository) {
  let tmp = entry as T
  
  tmp.changePassword = (oldPassword:string, newPassword:string, options?:Object) => {
		return ds.changePassword(tmp.id, oldPassword, newPassword, options)
	}

	tmp.createAccessToken = (data:TtlArgs|number, options?:Object) => {
		if(typeof data === 'number')
      data = { ttl: data }

    let i = new AccessTokenModel()
    i.ttl = data.ttl
    i.created = new Date()
    i.userId = tmp.id
    i.expired = Date.now() + (data.ttl * 1000)

    return tokenRepo.create(i)
	}

	tmp.hasPassword = (password:string) => {
		return new Promise((resolve, reject) => {
      bcrypt.compare(password, tmp.password, function(err:Error, isMatch:boolean) {
        if (err) return reject(err);
        resolve(isMatch)
      });
    })
	}

	tmp.setPassword = (newPassword:string, options?:Object) => {
		return ds.setPassword(tmp.id, newPassword, options)
	}

	tmp.verify = (verifyOptions:Object) => {
    let source = entry as any
    
    if(!source.verify)
      throw new Error('method not properly configured')

    return new Promise((resolve, reject) => {
      source.verify(verifyOptions, (options:Object, err:Error, result:any) => {
        if(err) return reject(err)
        resolve(result)
      })
    })
	}

  return tmp
}

@injectable()
@Repository({
  settings: {
    loopback: {
      connection: 'memory',
      template: 'User'
    }
  }
})
export class UserRepository extends PersistedRepository<UserModel>
{
  ds:UserDataSource
  
  public schema:Function = UserModel

  constructor(@inject(AccessTokenRepository) protected tokenRepo:AccessTokenRepository) {
    super()
  }

  changePassword(userId:any, oldPassword:string, newPassword:string, options:Object):Promise<void> {
		return this.ds.changePassword(userId, oldPassword, newPassword, options)
	}

	confirm(userId:any, token:string, redirect:string):Promise<void> {
		return this.ds.confirm(userId, token, redirect)
	}

	generateVerificationToken(user:Object, options?:Object):Promise<string> {
		return this.ds.generateVerificationToken(user, options)
	}

	login(credentials:Object, include?:string[]|string):Promise<Object> {
		return this.ds.login(credentials, include)
	}

	logout(accessTokenID:string):Promise<void> {
		return this.ds.logout(accessTokenID)
	}

	resetPassword(options?:Object):Promise<void> {
		return this.ds.resetPassword(options as Object)
	}

	setPassword(userId:any, newPassword:string, options:Object):Promise<void>	{
		return this.ds.setPassword(userId, newPassword, options)
  }
  
  attach(model:Object):UserModel {
    let i = super.attach(model)

    return attachToDs(i, this.ds, this.tokenRepo)
  }
}