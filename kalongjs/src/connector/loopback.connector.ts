import { BaseConnector } from "./base.connector";
import { BaseRepository } from "../repository";
import { inject, injectable, Container } from "inversify";
import { DataSource, ModelBuilder } from "loopback-datasource-juggler";
import { RepositoryOptions } from "../decorator";
import { getInstanceMethodNames, getOwnInstanceMethodNames } from "../util";

const loopback = require('loopback')

@injectable()
export class LoopbackConnector extends BaseConnector
{
  private sources:any = {}
  private builder = new ModelBuilder()

  constructor(@inject(Container) protected container:Container) {
    super()
  }

  configure(repo: BaseRepository): void {
    //throw new Error("Method not implemented.");
    this.log.debug(`configure repository ${repo.constructor.name} with loopback connector`)

    let meta = Reflect.getMetadata('repository', repo) as RepositoryOptions

    let lbMeta = meta.settings.loopback

    let ds:DataSource
    if(this.sources[lbMeta.connection])
      ds = this.sources[lbMeta.connection]
    else {
      ds = loopback.createDataSource(lbMeta.connection) //new DataSource(Object.assign({ connector: require(lbMeta.connection) }, lbMeta.options || {}))

      this.sources[lbMeta.connection] = ds
    }

    // extract meta from model
    const properties = {} as any
    const hidden = []
    const relations = {} as any

    const schema = repo.schema

    const modelMeta = Reflect.getMetadata('model', schema.prototype)

    let keys = getInstanceMethodNames(schema.prototype)
    for(let i=0; i<keys.length; i++) {
      const key = keys[i]
      if(Reflect.hasMetadata('property', schema.prototype, key)) {
        const propMeta = Reflect.getMetadata('property', schema.prototype, key)

        properties[key] = propMeta
      }

      if(Reflect.hasMetadata('hidden', schema.prototype, key)) {
        hidden.push(key)
      }

      if(Reflect.hasMetadata('relation', schema.prototype, key)) {
        const relationMeta = Reflect.getMetadata('relation', schema.prototype, key)

        relations[key] = relationMeta
      }
    }

    // prepare loopback model
    const settings = {
      //name: meta.alias,
      public: false,
      base: lbMeta.template || 'Model',
      idInjection: false,
      strict: true,
      //properties: properties,
      hidden: hidden,
      relations: relations
    }

    // create model
    const model = ds.createModel(repo.constructor.name, properties, settings) //this.builder.define(repo.constructor.name, properties, settings)
    //console.log(model)
    const handler = {} as any

    keys = getOwnInstanceMethodNames(model)
    for(let i=0; i<keys.length; i++) {
      const key = keys[i]
      const fn:Function = Reflect.get(model, key)

      if(typeof fn === 'function') {
        handler[key] = function(...args:any[]) {
          return new Promise((resolve, reject) => {
            const cb = (err:Error, instance:any) => {
              if(err) return reject(err)

              return resolve(instance)
            }
            
            args.push(cb)

            fn.call(model, args)
          })
        }
      }
    }

    repo.ds = new Proxy(model, {
      get: function(target, key, receiver) {
        console.log(`call ds method ${key.toString()}`)
        let fn = Reflect.get(target, key) as Function

        if(!(typeof fn === 'function'))
          return fn

        return function(...args:any[]) {
          return new Promise((resolve, reject) => {
            const cb = (err:Error, instance:any) => {
              //console.log(err)
              if(err) return reject(err)
              //console.log(instance)
              return resolve(instance)
            }
            //console.log(args)
            args.push(cb)
            //console.log(args)
            fn.apply(model, args)
          })
        }
      }
    })
  }
}