
export interface OnInit
{
  onInit():void  
}

export interface OnCreated
{
  onCreated():void
}

export interface OnUpdated
{
  onUpdated():void
}

export interface OnDestroyed
{
  onDestroyed():void
}

/* export class A
{
  greet() {
    console.log('hello world')
  }

  trigger() {
    this.greet()
  }
}

export class B extends A
{
  greet() {
    console.log('not hello')
  }
}

let x = new B()
x.trigger() */

/* export class C
{
  name:string 
}

export class D extends C
{
  name:string = 'D'
}

export class A
{
  protected model:C
  
  greet() {
    console.log(this.model.name)
  }

  setName(model:C) {
    this.model = model
  }

  getName() {
    return this.model
  }
}

export class B extends A
{
  protected model:D

  say() {
    console.log(this.model.name)
  }
}

const d = new D()
//d.name = 'rana'

const b = new B()
b.setName(d)
b.say() */