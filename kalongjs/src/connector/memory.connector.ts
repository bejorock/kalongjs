import { injectable } from "inversify";
import { BaseConnector } from "./base.connector";
import { BaseRepository } from "../repository";

@injectable()
export class MemoryConnector extends BaseConnector
{
  configure(repo: BaseRepository): void {
    

    throw new Error("Method not implemented.");
  }
  
}