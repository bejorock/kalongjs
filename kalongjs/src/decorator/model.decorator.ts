import { BaseModel } from "../model";

export interface ModelOptions
{
	name?:string
}

export function Model(options?:ModelOptions) {
	return function(target:Function) {
    options = options || {}
		//setTimeout(() => console.log(BaseModel), 100)
    if(!(target.prototype instanceof BaseModel))
      throw new Error('not valid model class')

		options = Object.assign({
			name: target.name,
		}, options)

		Reflect.defineMetadata('model', options, target.prototype)
	}
}

export function Property(meta:Object|string, required:boolean = false) {
	if(typeof meta === 'string')
		meta = {type: meta, required}

	return function(target:Object, key:string) {
		const fn = Reflect.get(target, key)
    if(typeof fn === 'function')
      throw new Error('not valid model property')

		let properties = {} as any
		if(Reflect.hasMetadata('properties', target))
			properties = Reflect.getMetadata('properties', target)
		
		properties[key] = meta

		Reflect.defineMetadata('properties', properties, target)
		//Reflect.defineMetadata('property', meta, target, key)
	}
}

export function Hidden(fn?:Function) {
	return function(target:Object, key:string) {
		const fn = Reflect.get(target, key)
    if(typeof fn === 'function')
      throw new Error('not valid model property')

		let hiddens = {} as any
		if(Reflect.hasMetadata('hiddens', target))
			hiddens = Reflect.getMetadata('hiddens', target)

		hiddens[key] = fn

		Reflect.defineMetadata('hiddens', hiddens, target)
		
    //Reflect.defineMetadata('hidden', fn || {}, target, key)
  }
}

export function Relation(type:string, model:Function, foreignKey:string = "", primaryKey:string = "") {
	return function(target:Object, key:string) {
		const fn = Reflect.get(target, key)
    if(typeof fn === 'function')
      throw new Error('not valid model property')

		let relations = {} as any
		if(Reflect.hasMetadata('relations', target))
			relations = Reflect.getMetadata('relations', target)

		//relations[key] = { type, model:Symbol.keyFor(model), foreignKey }
		relations[key] = { type, model, foreignKey }

		Reflect.defineMetadata('relations', relations, target)
		//Reflect.defineMetadata('relation', { type, model:Symbol.keyFor(model), foreignKey }, target, key)
	}
}

export function Validation(fn:Function) {
	return function(target:Object, key:string) {
		const fn = Reflect.get(target, key)
    if(typeof fn === 'function')
      throw new Error('not valid model property')
			
		let validations = {} as any
		if(Reflect.hasMetadata('validations', target))
			validations = Reflect.getMetadata('validations', target)

		validations[key] = fn

		Reflect.defineMetadata('validations', fn, target)

		//Reflect.defineMetadata('validation', fn, target, key)
	}
}