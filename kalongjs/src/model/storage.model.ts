import { injectable } from "inversify";
import { BaseModel } from "./base.model";
import { Stream } from "stream";
import { Request, Response } from "express";
import { Property, Model } from "../decorator";

@injectable()
@Model()
export class StorageModel extends BaseModel
{
  @Property('string')
  name?:string

  download(file:string, req:Request, res:Response):void {
    throw new Error('model not connected to repository')
  }

  downloadStream(file:string, options?:Object):Stream {
    throw new Error('model not connected to repository')
  }

  getFile(file:string):Promise<Object> {
    throw new Error('model not connected to repository')
  }
  
  getFiles(options?:Object):Promise<Object[]> {
    throw new Error('model not connected to repository')
  }

  removeFile(file:string):Promise<void> {
    throw new Error('model not connected to repository')
  }

  upload(req:Request, res:Response, options?:Object):void {
    throw new Error('model not connected to repository')
  }

  uploadStream(file:string, options?:Object):Stream {
    throw new Error('model not connected to repository')
  }
}