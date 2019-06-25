import { injectable, Container } from "inversify";
import { LogFactory } from "./factory";
import Logger from 'bunyan';

@injectable()
export abstract class BaseApplication
{
  protected readonly log:Logger = LogFactory.create(BaseApplication)
  protected container:Container

  constructor() {
    this.container = new Container({ autoBindInjectable: true })

    this.container.bind(Container).toConstantValue(this.container)
  }

  abstract start():Promise<void>
}