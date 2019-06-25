import { injectable } from 'inversify';
import { PersistedModel } from './persisted.model';
import { Property, Model, Relation } from '../decorator';
import { UserModel } from './user.model';

@injectable()
@Model()
export class AccessTokenModel extends PersistedModel
{
	@Property('number', true)
	ttl?:number

	@Property('any', true)
	userId:any

	@Property('number', true)
	expired?:number

	@Relation('belongsTo', () => UserModel)
	user:UserModel

	validate(cb?:Function):Promise<boolean> {
		throw new Error('model not connected to repository')
	}
}