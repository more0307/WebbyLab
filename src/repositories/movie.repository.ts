import { BaseRepository } from './base.repository';
import { MovieCreateDto } from '../validations/movie.validation';
import sequelize from '../db/init';
import Movie, { MovieAttributes } from '../db/models/movie.model';
import { ActorRepository } from './actor.repository';
import Actor from '../db/models/actor.model';

export class MovieRepository extends BaseRepository<Movie> {
  protected readonly actorRepository: ActorRepository = new ActorRepository();

  constructor() {
    super(Movie);
  }

  /**
   * Insert records about films and actors into the DB
   */
  async addMovieWithActors(movieData: MovieCreateDto): Promise<(MovieAttributes & { actors: Actor[] }) | false> {
    const transaction = await sequelize.transaction();

    try {
      const movie = await this.create(movieData, { transaction });

      const actorPromises = movieData.actors.map((actorName) =>
        this.actorRepository.findOrCreate({
          where: { name: actorName },
          transaction,
        }),
      );

      const results = await Promise.all(actorPromises);
      const actors = results.map((result) => result[0]);
      await movie.addActors(actors, { transaction });

      await transaction.commit();

      return { ...movie.dataValues, actors };
    } catch (error) {
      await transaction.commit();
      console.error('Error adding movie:', error);
      return false;
    }
  }
}
