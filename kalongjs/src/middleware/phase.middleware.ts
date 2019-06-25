import { injectable } from "inversify";
import { BaseMiddleware } from "./base.middleware";

@injectable()
export abstract class PhaseMiddleware extends BaseMiddleware
{
  constructor(private __phase:string) {
    super()
  }

  get phase() { return this.__phase }
}