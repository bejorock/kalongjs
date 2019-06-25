import { DataSource } from "./datasource";

export interface EmailDataSource extends DataSource
{
  send(options?:Object):Promise<void>
}