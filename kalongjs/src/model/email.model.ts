import { injectable } from "inversify";
import { BaseModel } from "./base.model";
import { Property, Model } from "../decorator";

@injectable()
@Model()
export class EmailModel extends BaseModel
{
  @Property('string', true)
  to?:string

  @Property('string', true)
  from?:string

  @Property('string', true)
  subject?:string

  @Property('string')
  text?:string

  @Property('string')
  html?:string

  send():Promise<void> {
    throw new Error('model not connected to repository')
  }
}