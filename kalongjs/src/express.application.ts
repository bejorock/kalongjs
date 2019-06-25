import { BaseApplication } from "./base.application";
import { injectable } from "inversify";

@injectable()
export class ExpressApplication extends BaseApplication
{
  start(): Promise<void> {
    throw new Error("Method not implemented.");
  } 
}