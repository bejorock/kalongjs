import Logger from 'bunyan';
import { injectable } from 'inversify';
import { LogFactory } from '../factory';
import { Hidden, Property } from '../decorator';

@injectable()
export class BaseModel 
{	
	@Hidden()
	@Property('any')
	protected readonly log:Logger = LogFactory.create(BaseModel)
}