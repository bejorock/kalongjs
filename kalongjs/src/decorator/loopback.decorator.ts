import { BaseController } from "../controller";

export enum lBTemplate
{
  Model = 'Model',
  PersistedModel = 'PersistedModel',
  Email = 'Email',
  Storage = 'Storage',
  User = 'User',
  Role = 'Role',
  AccessToken = 'AccessToken'
}

export interface lBConnectorOptions
{
  template:string|lBTemplate,
  acls?: Object[]
}

export function lBConnector(options:lBConnectorOptions|string) {
	return function(target:Function) {
    if(!(target.prototype instanceof BaseController))
      throw new Error('not valid loopback controller class')

    if(typeof options === 'string')
      options = { template: options }

    options = Object.assign({
      template: lBTemplate.Model,
      acls: []
    }, options)

    Reflect.defineMetadata('lbconnector', options, target.prototype)
	}
}

export function lBConnectorMethod(target:Object, key:string) {
  const fn = Reflect.get(target, key)
  if(!(typeof fn === 'function'))
    throw new Error('not valid loopback remote method')

  Reflect.defineMetadata('lbconnectormethod', true, target, key)
}