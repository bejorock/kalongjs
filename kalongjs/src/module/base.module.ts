import { injectable, Container, inject } from "inversify";
import Logger from 'bunyan';
import { LogFactory } from "../factory";
import { BaseMiddleware } from "../middleware";
import { BaseController } from "../controller";
import { ModuleOptions } from "../decorator";
import { BaseRepository } from "../repository";
import { ModuleLoader } from "./module.loader";

function hasMethod (obj:object, name:string) {
	const desc = Object.getOwnPropertyDescriptor (obj, name);
	return !!desc && typeof desc.value === 'function';
}

function getInstanceMethodNames(obj:object, stop?:any) {
	let array:any[] = [];
	let proto = Object.getPrototypeOf(obj);
	while (proto && proto !== stop) {
		Object.getOwnPropertyNames(proto)
			.forEach (name => {
				if (name !== 'constructor') {
					if (hasMethod(proto, name)) {
						array.push (name);
					}
				}
			});
		proto = Object.getPrototypeOf (proto);
	}
	return array;
}

@injectable()
export abstract class BaseModule
{
	protected readonly log:Logger = LogFactory.create(BaseModule)

	private __middlewares:BaseMiddleware[]
	private __controllers:BaseController[]
	private __repositories:BaseRepository[]

	constructor(@inject(Container) protected container:Container, @inject(ModuleLoader) protected loader:ModuleLoader) {
		this.__middlewares = []
		this.__controllers = []
		this.__repositories = []
	}

	private executePreLoad() {
    const keys = getInstanceMethodNames(this)
    
    for(let i=0; i<keys.length; i++) {
      let key = keys[i]
      if(key === 'load')
        continue;
      
      let fn:any = Reflect.get(this, key)
      if(Reflect.getMetadata('preload', this, key))
        fn.apply(this)
    }
  }

  private executePostLoad() {
    const keys = getInstanceMethodNames(this)
    
    for(let i=0; i<keys.length; i++) {
      let key = keys[i]
      if(key === 'load')
        continue;
      
      let fn:any = Reflect.get(this, key)
      if(Reflect.getMetadata('postload', this, key))
        fn.apply(this)
    }
	}
	
	load() {
		this.executePreLoad()

		this.log.debug(`load module ${this.constructor.name}`)
		
		let meta = Reflect.getMetadata('module', this) as ModuleOptions

		// bind all
		const imports = meta.imports || []
		imports.forEach(i => {
			let module = this.container.resolve(i as any) as BaseModule

			module.load()
		})

		const declares = meta.declares || []
		declares.forEach(i => this.container.bind(i).toSelf().inSingletonScope().onActivation((ctx, instance) => {
			if(instance.onInit)
				instance.onInit()			

			return instance
		}))

		/* const connector = this.container.get(meta.connector as Function) as BaseConnector

		if(connector) {
			const repositories = meta.repositories || []
			this.__repositories = repositories.map(i => {
				const repo = this.container.get(i)

				connector.configure(repo)

				return repo
			})
		} */
		const repositories = meta.repositories || []
		this.__repositories = repositories.map(i => {
			let e = this.container.get(i)

			if(!e)
				e = i

			return this.loader.registerRepository(e)
		})

		const middlewares = meta.middlewares || []
		this.__middlewares = middlewares.map(i => {
			let e = this.container.get(i)

			if(!e)
				e = i

			return this.loader.registerMiddleware(e)
		})

		const controllers = meta.controllers || []
		this.__controllers = controllers.map(i => {
			let e = this.container.get(i)

			if(!e)
				e = i

			return this.loader.registerController(e)
		})

		this.executePostLoad()
	}

	get middlewares() { return this.__middlewares }

	get controllers() { return this.__controllers }

	get repositories() { return this.__repositories }

	//abstract registerMiddleware(middleware:BaseMiddleware, path?:string):BaseMiddleware
	
	//abstract registerController(controller:BaseController):BaseController
}