import { DataSource } from "./datasource";
import { Request, Response } from "express";
import { Stream } from "stream";

export interface StorageDataSource extends DataSource
{
  createContainer(options?:Object):Promise<Object>
  destroyContainer(container:string):Promise<void>
  download(container:string, file:string, req:Request, res:Response):void
  downloadStream(container:string, file:string, options?:Object):Stream
  getContainer(container:string):Promise<Object>
  getContainers():Promise<Object[]>
  getFile(container:string, file:string):Promise<Object>
  getFiles(container:string, options?:Object):Promise<Object[]>
  removeFile(container:string, file:string):Promise<void>
  upload(container:string, req:Request, res:Response, options?:Object):void
  uploadStream(container:string, file:string, options?:Object):Stream
}