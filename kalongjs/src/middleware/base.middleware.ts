import { injectable } from "inversify";
import { Request, Response } from 'express';

/* export interface BaseMiddleware
{
	phase:string
	path:string
	protocol:string

	onRequest(req, res, next):Promise<void>
}
 */

@injectable()
export abstract class BaseMiddleware
{
	abstract onRequest(req:Request, res:Response, next:Function):Promise<void>
}