import { injectable } from "inversify";
import { Request, Response } from 'express';

/* export interface BaseErrorMiddleware
{
	phase:string

	onRequest(err, req, res, next):Promise<void>
} */

@injectable()
export abstract class BaseErrorMiddleware
{
	readonly phase = 'final:before'

	abstract onRequest(err:Error, req:Request, res:Response, next:Function):Promise<void>
}