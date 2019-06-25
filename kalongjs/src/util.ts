export function hasMethod (obj:Object, name:string) {
	const desc = Object.getOwnPropertyDescriptor (obj, name);
	return !!desc && typeof desc.value === 'function';
}

export function getInstanceMethodNames(obj:Object, stop?:any) {
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
		proto = Object.getPrototypeOf(proto);
	}
	
	return array;
}

export function getOwnInstanceMethodNames(obj:Object, stop?:any) {
	let array:any[] = [];
	let proto = Object.getPrototypeOf(obj);
	
	Object.getOwnPropertyNames(proto)
		.forEach (name => {
			if (name !== 'constructor') {
				if (hasMethod(proto, name)) {
					array.push (name);
				}
			}
		});
	
	return array;
}

export function getInstanceAttributeNames(obj:Object, stop?:any) {
	let array:any[] = [];
	let proto = Object.getPrototypeOf(obj);
	while (proto && proto !== stop) {
		Object.getOwnPropertyNames(proto)
			.forEach (name => {
				if (name !== 'constructor') {
					if (!hasMethod(proto, name)) {
						array.push (name);
					}
				}
			});
		proto = Object.getPrototypeOf(proto);
	}
	
	return array;
}

/* export function Relations(model:Function, descriptions:string) {
  return function(target:Object, key:string) {
    //console.log(descriptions)
    //console.log(model())
  }
} */