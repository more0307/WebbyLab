import { BaseRepository } from './base.repository';
import { Actor } from '../db/models/actor.model';

export class ActorRepository extends BaseRepository<Actor> {
  constructor() {
    super(Actor);
  }
}
