import { BaseController } from "../dist/controller";
import { injectable } from "inversify";
import { Controller, lBConnector, lBTemplate, Get } from "../dist/decorator";
import { Request, Response } from "express";

@injectable()
@Controller({ alias: 'Sample' })
@lBConnector(lBTemplate.Model)
export class SampleController extends BaseController
{
  @Get({
    path: '/greet',
    accepts: [
      { arg: 'req', type: 'object', 'http': { source: 'req' } },
      { arg: 'res', type: 'object', 'http': { source: 'res' } }
    ]
  })
  greet(req:Request, res:Response) {
    res.send({ greeting: "hello world" })
  }
}