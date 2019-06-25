import { BaseApplication } from "./base.application";
import { injectable, Container, unmanaged } from "inversify";
import { Application } from 'express';
import { ModuleLoader } from "./module";
import { BaseMiddleware, BaseErrorMiddleware, PhaseMiddleware } from "./middleware";
import { BaseController, RepositoryController } from "./controller";
import { BaseRepository } from "./repository";
import Logger from 'bunyan';
import { LogFactory } from "./factory";
import { Request, Response } from "express";
import { ControllerOptions, lBConnectorOptions, RouteOptions } from "./decorator";
import { BaseModule } from "./module";
import { DataSource } from "loopback-datasource-juggler";
import { getInstanceMethodNames, getInstanceAttributeNames } from "./util";
import { BaseConnector } from "./connector";
import http from 'http';
import path from 'path';

const loopback = require('loopback')
const connector = require('loopback-connector')
const Connector = connector.Connector
const compile = require('loopback-boot/lib/compiler')
const execute = require('loopback-boot/lib/executor')
const createSwaggerObject = require('loopback-swagger').generateSwaggerSpec

/* Dao.find = function(filter:Object, cb?:Function) {
  console.log('dfdfdfd')
} */

function hideProperties(target:any, filters:any) {
  if(!target)
    return;

  let records = []
  if(Array.isArray(target))
    records = target
  else
    records.push(target)

  //console.log(records)
  for(let j of records) {
    let record = j
    //console.log(record)
    for(let i in filters) {
      let filter = filters[i]
  
      if(!filter)
        delete record[i]
      else if(filter(target, i))
        delete record[i]
    }
  }

  return target
}

export class ControllerConnector extends Connector
{
  protected readonly log:Logger = LogFactory.create(ControllerConnector)

  name:string = 'ControllerConnector'

  constructor() {
    super()

    Connector.call(this, 'controller-connector', {})
  }

  initialize(dataSource:DataSource, cb:Function) {
    this.log.debug('initialize controller connector')

    dataSource.connector = this
  }

  connect(cb:Function) {
    this.log.debug('connect to controller connector')
    cb()
  }

  disconnect(cb:Function) {
    this.log.debug('disconnect from controller connector')
    cb()
  }

  ping(cb:Function) {
    this.log.debug('ping to controller connector')
    cb()
  }
}

export interface LoopbackContext extends Application
{
  registry:any

  middleware(name:string, paths?:string|string[]|RegExp|Function, handler?:Function):void
  model(instance:Object, options?:Object):void
  enableAuth(options?:Object):void
}

export class LoopbackLoader implements ModuleLoader
{
  protected readonly log:Logger = LogFactory.create(LoopbackLoader)
  private connector = new ControllerConnector()
  
  constructor(private app:LoopbackContext, private container:Container, private dataConnector:BaseConnector) {
  
  }

  registerMiddleware(middleware: BaseMiddleware, path?: string | undefined): BaseMiddleware {
    this.log.debug(`load middleware ${middleware.constructor.name}`)

    let handler:Function
    if(middleware instanceof BaseErrorMiddleware)
    {
      handler = async function(err:Error, req:Request, res:Response, next:Function) {
				try {
					await middleware.onRequest.apply(middleware, [err, req, res, next])
				} catch(e) {
					next(e)
				}
			}
    }
    else 
    {
      handler = async function(req:Request, res:Response, next:Function) {
				try {
					await middleware.onRequest.apply(middleware, [req, res, next])
				} catch(e) {
					next(e)
				}
			}
    }

    if(path)
      this.app.middleware('routes', path, handler)
    else if(middleware instanceof BaseErrorMiddleware || middleware instanceof PhaseMiddleware)
      this.app.middleware(middleware.phase, handler)
    else
      this.app.middleware('initial:after', handler) 

    return middleware
  }  
  
  registerController(controller: BaseController): BaseController {
    this.log.debug(`load controller ${controller.constructor.name}`)

    const meta = Reflect.getMetadata('controller', controller) as ControllerOptions
    const lbMeta = Reflect.getMetadata('lbconnector', controller) as lBConnectorOptions

    // prepare loopback model for api interfaces
    const middlewares = meta.middlewares || []
    middlewares.forEach(i => this.registerMiddleware(this.container.get(i), `${this.app.get('restApiRoot')}/${meta.path}`))
    
    // prepare datasource
    
    let properties = {} as any
    let hidden = [] as any
    let relations = {} as any
    if(controller instanceof RepositoryController) {
      let repoController = controller as RepositoryController

      // extract meta from model
      const schema = repoController.repository.schema

      //const modelMeta = Reflect.getMetadata('model', schema.prototype)

      //console.log(Reflect.getMetadata('properties', schema.prototype))
      //console.log(Reflect.getMetadata('hiddens', schema.prototype))
      //console.log(Reflect.getMetadata('relations', schema.prototype))

      /* const keys = getInstanceAttributeNames(schema.prototype)
      for(let i=0; i<keys.length; i++) {
        const key = keys[i]
        //console.log(key)
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
      } */

      if(Reflect.hasMetadata('properties', schema.prototype))
        properties = Reflect.getMetadata('properties', schema.prototype)
      
      if(Reflect.hasMetadata('hiddens', schema.prototype))
        hidden = Reflect.getMetadata('hiddens', schema.prototype)

      if(Reflect.hasMetadata('relations', schema.prototype))
        relations = Reflect.getMetadata('relations', schema.prototype).map((e:any) => { e.model = e.model(); return e; })
    }

    // extract meta from controller
    const Dao:any = function() {}
    const remotes:any = {}
    const keys = getInstanceMethodNames(controller)
    for(let i=0; i<keys.length; i++) {
      const key = keys[i]
      if(Reflect.hasMetadata('remote', controller, key) && !Reflect.hasMetadata('lbconnectormethod', controller, key)) {
        const remoteMeta = Reflect.getMetadata('remote', controller, key) as RouteOptions

        if(remoteMeta.method !== 'use') {
          remotes[key] = {
            accepts: remoteMeta.accepts || [],
            returns: remoteMeta.returns || { type: 'Object', root: true },
            http: { verb: remoteMeta.method, path: remoteMeta.path },
            description: remoteMeta.description
          }
        }
      } else if(Reflect.hasMetadata('lbconnectormethod', controller, key)) {
        Dao[key] = function(...args:any[]) {
          console.log(args)
          const fn = Reflect.get(controller, key) as Function
          //console.log(fn)
          if(args.length == 0) 
            return fn.apply(controller, args).then((results:any) => hideProperties(results, hidden))

          const cb = args[args.length - 1] as Function

          if(!(typeof cb === 'function'))
            return fn.apply(controller, args).then((results:any) => hideProperties(results, hidden))

          args = args.slice(0, -1)

          const promise = fn.apply(controller, args) as Promise<any>
          //console.log(promise)
          promise.then((results) => 
            {
              cb.apply(Dao, [null, hideProperties(results, hidden)])
            }
          ).catch((err) => cb.call(Dao, err))
        }
      }
    }
    
    // prepare loopback model
    const settings = {
      name: meta.alias,
      description: meta.description,
      base: lbMeta.template,
      idInjection: false,
      strict: true,
      //properties: properties,
      //hidden: hidden,
      relations: relations,
      acls: lbMeta.acls,
      methods: remotes
    }
    //console.log(properties)
    //console.log(settings)
    const ds:DataSource = loopback.createDataSource(new Proxy(this.connector, this.buildProxyHandler(controller, Dao))) //new DataSource(new Proxy(this.connector, this.buildProxyHandler(controller)))
    const model = ds.createModel(meta.alias as string, properties, settings) as any

    //console.log(model)
    //model.dataSource = ds
    //ds.attach(model)
    
    for(let key in remotes) {
      (model as any)[key] = async function(...args:any[]) {
        const fn = Reflect.get(controller, key) as Function
        
        const result = fn.apply(controller, args)
        
        if(result && result instanceof Promise)
        return await result
        
        return result
      }
    }
    
    //model.attachTo(ds)
    //this.__models.push(model)
    
    this.app.model(model, { public: true, dataSource: ds })
    
    /* if(model.find) {
      //console.log(model)
      model.find({}, (err:Error, instance:any) => { console.log(err); console.log(instance) })
    } */

    //ds.attach(model)
    
    return controller
  }

  registerRepository(repository: BaseRepository): BaseRepository {
    this.log.debug(`load repository ${repository.constructor.name}`)

    if(this.dataConnector)
      this.dataConnector.configure(repository)

    //console.log(repository.ds)
    
    return repository
  } 

  private buildProxyHandler(controller:BaseController, Dao:any):Object {
    return {
      get: (target:Object, key:string, receiver:any) => {
        let fn:Function = Reflect.get(controller, key) //controller[key]
        //console.log(`called ${key} with result ${fn} or ${Reflect.get(target, key)}`)

        if(fn) {
          this.log.debug(`found property ${key} in controller`)

          if(!(typeof fn === 'function'))
            return fn
          
          return function(model:string, ...args:any[]) {
            fn.apply(controller, args)
          }
        }

        //this.log.debug(`property ${key} is not available for controller ${controller.constructor.name}`)

        fn = Reflect.get(target, key, receiver)

        if(!fn)
          fn = function(...args:any[]) {
            console.log(args)
          }

        if(key.toString() === 'DataAccessObject')
          return Dao

        this.log.debug(`found property ${key.toString()} in connector`)
        //console.log(fn)

        return fn
      }
    }
  }
}

export interface LoopbackConfig
{
  rootDir: string,
  configDir:string,
  mixinsDir:string[]
}

@injectable()
export class LoopbackApplication extends BaseApplication
{
  protected ctx:LoopbackContext
  private dataConnector:BaseConnector
  private loader:ModuleLoader
  private module:BaseModule
  
  constructor(@unmanaged() private moduleClass:Function, @unmanaged() private connectorClass?:Function, @unmanaged() private lbConfig?:LoopbackConfig) {
    super()

    if(!this.lbConfig)
      this.lbConfig = {
        rootDir: process.cwd(),
        configDir: path.resolve(__dirname, 'config', 'loopback'),
        mixinsDir: []
      }
  }

  start(): Promise<void> {
    const port = this.ctx.get('port')
    const server = http.createServer(this.ctx)
    
    return new Promise((resolve, reject) => {
      server.listen(port, () => {
        var baseUrl = 'http://' + this.ctx.get('host') + ':' + port;
        //module.getContext().emit('started', baseUrl);
        //var baseUrl = app.get('url').replace(/\/$/, '');
        this.log.info('Web server listening at: %s', baseUrl);
        this.log.info('Browse your REST API at %s%s', baseUrl, '/explorer');

        resolve()
      })
    })
  }

  setup() {
    this.ctx = loopback()

    if(this.connectorClass)
      this.dataConnector = this.container.resolve(this.connectorClass as any)

    this.loader = new LoopbackLoader(this.ctx, this.container, this.dataConnector)

    this.container.bind(ModuleLoader).toConstantValue(this.loader)

    this.module = this.container.resolve(this.moduleClass as any)

    const instructions = compile(
    { 
      appRootDir: this.lbConfig.rootDir, 
      appConfigRootDir: this.lbConfig.configDir,
      dsRootDir: this.lbConfig.configDir,
      modelsRootDir: this.lbConfig.configDir,
      middlewareRootDir: this.lbConfig.configDir,
      componentRootDir: this.lbConfig.configDir,
      mixinDirs: this.lbConfig.mixinsDir 
    })
    //console.log(instructions)
    return new Promise((resolve, reject) => {
			execute(this.ctx, instructions, () => {
        this.module.load()
        
        const spec = createSwaggerObject(this.ctx)

        for(let pathKey in spec.paths) {
          let path = spec.paths[pathKey]

          for(let methodKey in path) {
            let method = path[methodKey]

            method.operationId = method.operationId.replace('.', '_')
            //console.log(method)
          }
        }
        
        this.ctx.get('/explorer/swagger-sdk.json', (req:Request, res:Response) => {
          res.send(spec)
        })
        //console.log(JSON.stringify(spec, null, 2))

        resolve()
      });
		})
  }

  get loopbackContext() { return this.ctx }
}