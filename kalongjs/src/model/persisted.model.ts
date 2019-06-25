import { injectable } from 'inversify';
import { ReadOnlyModel } from './read_only.model';
import { Property } from '../decorator';

@injectable()
export class PersistedModel extends ReadOnlyModel
{	
	@Property('date')
	created?:Date

	@Property('date')
	modified?:Date

	@Property('any')
	createdBy:any

	@Property('any')
	modifiedBy:any

	destroy():Promise<void> {
    throw new Error('model not connected to repository')
  }

  save():Promise<void> {
    throw new Error('model not connected to repository')
  }

  updateAttribute(key:string, value:any):Promise<void> {
    throw new Error('model not connected to repository')
  }

  updateAttributes(meta:Object):Promise<void> {
    throw new Error('model not connected to repository')
  }
}