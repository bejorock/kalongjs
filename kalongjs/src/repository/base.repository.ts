import Logger from 'bunyan';
import { injectable, inject, Container } from 'inversify';
import { LogFactory } from '../factory';
import { DataSource } from '../datasource';

@injectable()
export class BaseRepository
{
  protected readonly log:Logger = LogFactory.create(BaseRepository)
 
  ds:DataSource

  public schema:Function

  @inject(Container)
  public container:Container

  newModel():Object {
    return this.container.resolve(this.schema as any)
  }
}