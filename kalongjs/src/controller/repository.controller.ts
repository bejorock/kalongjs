import { injectable, unmanaged } from "inversify";
import { BaseController } from "./base.controller";
import { BaseRepository } from "../repository";

@injectable()
export class RepositoryController extends BaseController
{
  constructor(@unmanaged() protected repo:BaseRepository) {
    super()
  }

  get repository() { return this.repo }
}