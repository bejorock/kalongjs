import { injectable, unmanaged } from "inversify";
import { Stream } from "stream";
import { Request, Response } from 'express';
import { BaseController } from "./base.controller";
import { StorageRepository } from "../repository";
import { lBConnectorMethod } from "../decorator";

@injectable()
export class StorageController extends BaseController
{
  constructor(@unmanaged() protected repo:StorageRepository) {
    super()
  }

  @lBConnectorMethod
  createContainer(options?:Object):Promise<Object> {
    return this.repo.createContainer(options)
  }

  @lBConnectorMethod
  destroyContainer(container:string):Promise<void> {
    return this.repo.destroyContainer(container)
  }

  @lBConnectorMethod
  download(container:string, file:string, req:Request, res:Response):void {
    return this.repo.download(container, file, req, res)
  }

  @lBConnectorMethod
  downloadStream(container:string, file:string, options?:Object):Stream {
    return this.repo.downloadStream(container, file, options)
  }

  @lBConnectorMethod
  getContainer(container:string):Promise<Object> {
    return this.repo.getContainer(container)
  }

  @lBConnectorMethod
  getContainers():Promise<Object[]> {
    return this.repo.getContainers()
  }

  @lBConnectorMethod
  getFile(container:string, file:string):Promise<Object> {
    return this.repo.getFile(container, file)
  }

  @lBConnectorMethod
  getFiles(container:string, options?:Object):Promise<Object[]> {
    return this.repo.getFiles(container, options)
  }

  @lBConnectorMethod
  removeFile(container:string, file:string):Promise<void> {
    return this.repo.removeFile(container, file)
  }

  @lBConnectorMethod
  upload(container:string, req:Request, res:Response, options?:Object):void {
    return this.repo.upload(container, req, res, options)
  }

  @lBConnectorMethod
  uploadStream(container:string, file:string, options?:Object):Stream {
    return this.repo.uploadStream(container, file, options)
  }
}