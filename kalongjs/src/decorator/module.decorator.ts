import { BaseModule } from "../module";

export interface ModuleOptions
{
	imports?:Function[]
	declares?:Function[]
	middlewares?:Function[]
  controllers?:Function[]
  repositories?:Function[]
  //connector?:Function
}

export function Module(options:ModuleOptions) {
	return function(target:Function) {
    if(!(target.prototype instanceof BaseModule))
      throw new Error('not valid module class')

		options = Object.assign({
			imports: [],
			declares: [],
			middlewares: [],
      controllers: [],
      repositories: []
		}, options)

		Reflect.defineMetadata('module', options, target.prototype)
	}
}

export function PreLoad() {
  return function(target:Object, key:string) {
    const fn = Reflect.get(target, key)
    if(!(typeof fn === 'function'))
      throw new Error('not valid module method')

    Reflect.defineMetadata('preload', true, target, key)
  }
}

export function PostLoad() {
  return function(target:Object, key:string) {
    const fn = Reflect.get(target, key)
    if(!(typeof fn === 'function'))
      throw new Error('not valid module method')

    Reflect.defineMetadata('postload', true, target, key)
  }
}