import { injectable } from "inversify";
import { PersistedModel } from "./persisted.model";
import { Property, Model } from "../decorator";

@injectable()
@Model()
export class RoleMappingModel extends PersistedModel
{
  @Property('string')
  principalType?:string

  @Property('any')
  principalId:any

  @Property('any')
  roleId:any
}