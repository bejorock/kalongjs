import Logger from 'bunyan';
import { LogFactory } from '../factory';
import { injectable } from 'inversify';

@injectable()
export class BaseController
{
  protected readonly log:Logger = LogFactory.create(BaseController)
}