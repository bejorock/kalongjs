import { injectable } from "inversify";
import { BaseRepository } from "./base.repository";
import { EmailModel } from "../model";
import { EmailDataSource } from "../datasource";

function attachToDs<T extends EmailModel>(entry:object, ds:EmailDataSource) {
  let tmp = entry as T
  
  tmp.send = () => {
    return ds.send(tmp)
  }

  return tmp
}

@injectable()
export class EmailRepository extends BaseRepository
{
  ds:EmailDataSource
  
  public schema:Function = EmailModel

  send(options?:Object):Promise<void> {
    return this.ds.send(options)
  }

  attach(model:any):EmailModel {
    let i = Object.assign(this.newModel(), model['__data'])

    return attachToDs(i, this.ds)
  }
}