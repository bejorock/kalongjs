import { BaseRepository } from "../repository";
import { LogFactory } from "../factory";
import Logger from 'bunyan';
import { injectable } from "inversify";

@injectable()
export abstract class BaseConnector
{
  protected readonly log:Logger = LogFactory.create(BaseConnector)

  abstract configure(repo:BaseRepository):void
}