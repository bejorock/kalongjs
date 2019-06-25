import { BaseRepository } from "../repository";

export interface LoopbackRepositorySettings
{
  connection: string,
  idInjection?: boolean,
  template?: string,
  mixins?: Function[],
  options?: Object
}

export interface RepositorySettings
{
  mongoose?: Object
  loopback?: LoopbackRepositorySettings
}

export interface RepositoryOptions
{
  //connection: string,
  //template?: string,
  //idInjection?: boolean
  tableName?: string,
  //mixins?: Function[],
  settings?: RepositorySettings
}

export function Repository(options?:RepositoryOptions) {
	return function(target:Function) {
    if(!(target.prototype instanceof BaseRepository))
      throw new Error('not valid repository class')

    options = options || {}

		/* options = Object.assign({
      //idInjection: true,
      //mixins: [],
      settings: {}
		}, options) */

		Reflect.defineMetadata('repository', options, target.prototype)
	}
}

export function Hook(name:string) {
	return function(target:Object, key:string) {
    const fn = Reflect.get(target, key)
    if(!(typeof fn === 'function'))
      throw new Error('not valid repository method')

		Reflect.defineMetadata('hook', name, target, key)
	}
}