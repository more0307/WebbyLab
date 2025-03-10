import {BaseRepository} from "./base.repository";
import {User} from "../db/models/user.model";

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super(User);
  }
}
