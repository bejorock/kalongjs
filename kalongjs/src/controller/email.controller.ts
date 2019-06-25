import { injectable, unmanaged } from "inversify";
import { BaseController } from "./base.controller";
import { EmailRepository } from "../repository";
import { lBConnectorMethod } from "../decorator";

@injectable()
export class EmailController extends BaseController
{
  constructor(@unmanaged() protected repo:EmailRepository) {
    super()
  }

  @lBConnectorMethod
  send(options?:Object):Promise<void> {
    return this.repo.send(options)
  }
}