import * as _ from 'lodash';
import { BaseController } from '../controller';

export interface ControllerOptions
{
  path?: string,
  alias?: string,
  middlewares?: Function[],
  description?: string
}

export function Controller(options?:ControllerOptions | string) {
	return function(target:Function) {
    if(!(target.prototype instanceof BaseController))
      throw new Error('not valid controller class')

    if(typeof options === 'string')
      options = { path: options }

    options = Object.assign({
      path: _.snakeCase(target.name),
      alias: target.name,
      middlewares: [],
      acls: []
    }, options)

    Reflect.defineMetadata('controller', options, target.prototype)
	}
}

export interface RouteOptions
{
  path: string,
  description?: string,
  accepts?: Object[]
  middlewares?: Function[],
  method?: string,
  returns?: Object
}

export function Get(options:RouteOptions|string) {
	return function(target:Object, key:string) {
    const fn = Reflect.get(target, key)
    if(!(typeof fn === 'function'))
      throw new Error('not valid controller remote method')

    if(typeof options === 'string')
      options = { path: options, method: 'get' }
    else
      options.method = 'get'

    Reflect.defineMetadata('remote', options, target, key)
	}
}

export function Post(options:RouteOptions|string) {
	return function(target:Object, key:string) {
    const fn = Reflect.get(target, key)
    if(!(typeof fn === 'function'))
      throw new Error('not valid controller remote method')

    if(typeof options === 'string')
      options = { path: options, method: 'post' }
    else
      options.method = 'post'

    Reflect.defineMetadata('remote', options, target, key)
	}
}

export function Put(options:RouteOptions|string) {
	return function(target:Object, key:string) {
    const fn = Reflect.get(target, key)
    if(!(typeof fn === 'function'))
      throw new Error('not valid controller remote method')

    if(typeof options === 'string')
      options = { path: options, method: 'put' }
    else
      options.method = 'put'

    Reflect.defineMetadata('remote', options, target, key)
	}
}

export function Delete(options:RouteOptions|string) {
	return function(target:Object, key:string) {
    const fn = Reflect.get(target, key)
    if(!(typeof fn === 'function'))
      throw new Error('not valid controller remote method')

    if(typeof options === 'string')
      options = { path: options, method: 'delete' }
    else
      options.method = 'delete'

    Reflect.defineMetadata('remote', options, target, key)
	}
}

export function Patch(options:RouteOptions|string) {
	return function(target:Object, key:string) {
    const fn = Reflect.get(target, key)
    if(!(typeof fn === 'function'))
      throw new Error('not valid controller remote method')

    if(typeof options === 'string')
      options = { path: options, method: 'patch' }
    else
      options.method = 'patch'

    Reflect.defineMetadata('remote', options, target, key)
	}
}

export function Use(options:RouteOptions|string) {
  return function(target:Object, key:string) {
    const fn = Reflect.get(target, key)
    if(!(typeof fn === 'function'))
      throw new Error('not valid controller remote method')

    if(typeof options === 'string')
      options = { path: options, method: 'use' }
    else
      options.method = 'use'

    Reflect.defineMetadata('remote', options, target, key)
	}
}