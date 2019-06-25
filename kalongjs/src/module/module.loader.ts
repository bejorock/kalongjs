import { BaseMiddleware } from "../middleware";
import { BaseController } from "../controller";
import { BaseRepository } from "../repository";

export abstract class ModuleLoader
{
  abstract registerMiddleware(middleware:BaseMiddleware, path?:string):BaseMiddleware
	
  abstract registerController(controller:BaseController):BaseController
  
  abstract registerRepository(repository:BaseRepository):BaseRepository
}