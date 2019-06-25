import { injectable } from "inversify";
import { BaseModule } from "../dist/module";
import { Module } from "../dist/decorator";
import { SampleController } from "./sample.controller";
import { UserRepository, AccessTokenRepository } from "../dist/repository";
import { UserController } from "../dist/controller";

@injectable()
@Module({
  imports: [],
  declares: [
    UserRepository,
    AccessTokenRepository,

    SampleController,
    UserController
  ],
  repositories: [
    UserRepository
  ],
  middlewares: [],
  controllers: [
    SampleController,
    UserController
  ]
})
export class MainModule extends BaseModule
{

}