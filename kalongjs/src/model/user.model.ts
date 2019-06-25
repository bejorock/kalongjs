import { injectable } from 'inversify';
import { PersistedModel } from './persisted.model';
import { Property, Model, Hidden } from '../decorator';

@injectable()
@Model()
export class UserModel extends PersistedModel
{
	@Property('string', true)
	username?:string

	@Property('string', true)
	@Hidden()
	password?:string

	@Property('string', true)
	email?:string

	@Property('string')
	emailVerified?:boolean

	@Property('string')
	verificationToken?:string

	@Property('string')
	realm?:string

	changePassword(oldPassword:string, newPassword:string, options:Object, cb?:Function):Promise<void> {
		throw new Error('model not connected to repository')
	}

	createAccessToken(data:Object|number, options:Object, cb?:Function):Promise<Object> {
		throw new Error('model not connected to repository')
	}

	hasPassword(password:string, cb?:Function):Promise<boolean> {
		throw new Error('model not connected to repository')
	}

	setPassword(newPassword:string, options:Object, cb?:Function):Promise<void> {
		throw new Error('model not connected to repository')
	}

	verify(verifyOptions:Object):Promise<Object> {
		throw new Error('model not connected to repository')
	}
}