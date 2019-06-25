import { PhaseMiddleware } from "./phase.middleware";
import { Request, Response } from "express";
import { injectable } from "inversify";

@injectable()
export class WrapperMiddleware extends PhaseMiddleware
{
  constructor(private fn:Function, phase:string) {
    super(phase)
  }

  async onRequest(req: Request, res: Response, next: Function): Promise<void> {
    this.fn.apply(this, [req, res, next])
  }
}