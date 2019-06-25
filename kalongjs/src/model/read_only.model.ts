import { injectable } from "inversify";
import { BaseModel } from "./base.model";
import { Property } from "../decorator";

@injectable()
export class ReadOnlyModel extends BaseModel
{
  @Property('any')
	id:any

  reload():Promise<void> {
    throw new Error('model not connected to repository')
  }
}