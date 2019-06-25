import { injectable } from 'inversify';
import { PersistedModel } from './persisted.model';
import { Property, Model } from '../decorator';

// alson known as role mapping
@injectable()
@Model()
export class RoleModel extends PersistedModel
{
	@Property('string')
	name?:string

	@Property('string')
	description?:string
}