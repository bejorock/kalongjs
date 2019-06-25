import { injectable } from "inversify";
import { BaseRepository } from "./base.repository";
import { Request, Response } from 'express';
import { Stream } from "stream";
import { StorageModel } from "../model";
import { StorageDataSource } from "../datasource";

function attachToDs<T extends StorageModel>(entry:object, ds:StorageDataSource) {
  let tmp = entry as T
  
  tmp.download = (file:string, req:Request, res:Response) => {
    return ds.download(tmp.name as string, file, req, res)
  }

  tmp.downloadStream = (file:string, options:Object) => {
    return ds.downloadStream(tmp.name as string, file, options)
  }

  tmp.getFile = (file:string) => {
    return ds.getFile(tmp.name as string, file)
  }

  tmp.getFiles = (options?:Object) => {
    return ds.getFiles(tmp.name as string, options)
  }
  
  tmp.removeFile = (file:string) => {
    return ds.removeFile(tmp.name as string, file)
  }

  tmp.upload = (req:Request, res:Response, options?:Object) => {
    return ds.upload(tmp.name as string, req, res, options)
  }

  tmp.uploadStream = (file:string, options?:Object) => {
    return ds.uploadStream(tmp.name as string, file, options)
  }

  return tmp
}

@injectable()
export class StorageRepository extends BaseRepository
{
  ds:StorageDataSource
  
  public schema:Function = StorageModel

  async createContainer(options?:Object):Promise<Object> {
    let i = await this.ds.createContainer(options)

    return this.attach(i)
  }

  destroyContainer(container:string):Promise<void> {
    return this.ds.destroyContainer(container)
  }

  download(container:string, file:string, req:Request, res:Response):void {
    return this.ds.download(container, file, req, res)
  }

  downloadStream(container:string, file:string, options?:Object):Stream {
    return this.ds.downloadStream(container, file, options)
  }

  async getContainer(container:string):Promise<Object> {
    let i = await this.ds.getContainer(container)

    return this.attach(i)
  }

  async getContainers():Promise<Object[]> {
    let i = await this.ds.getContainers()

    return i.map(e => this.attach(e))
  }

  getFile(container:string, file:string):Promise<Object> {
    return this.getFile(container, file)
  }

  getFiles(container:string, options?:Object):Promise<Object[]> {
    return this.getFiles(container, options)
  }

  removeFile(container:string, file:string):Promise<void> {
    return this.removeFile(container, file)
  }

  upload(container:string, req:Request, res:Response, options?:Object):void {
    return this.upload(container, req, res, options)
  }

  uploadStream(container:string, file:string, options?:Object):Stream {
    return this.uploadStream(container, file, options)
  }

  attach(model:any):StorageModel {
    let i = Object.assign(this.newModel(), model['__data'])

    return attachToDs(i, this.ds)
  }
}