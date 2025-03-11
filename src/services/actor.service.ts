import { Op, Sequelize } from 'sequelize';
import Movie from '../db/models/movie.model';
import { ActorRepository } from '../repositories/actor.repository';
import Actor from '../db/models/actor.model';

export class ActorService {
  protected readonly repository: ActorRepository = new ActorRepository();

  /**
   * Retrieves a list of actors with optional name search.
   * @param {string | undefined} name - Optional name search query.
   * @returns {Promise<Actor[]>} A promise that resolves with the list of movies.
   */
  public async list(name?: string): Promise<Actor[]> {
    const whereClause = name
      ? {
          name: {
            [Op.iLike]: `%${name.toLowerCase()}%`,
          },
        }
      : {};

    return this.repository.findAll({
      where: whereClause,
      include: [
        {
          model: Movie,
          as: 'movies',
        },
      ],
      order: [[Sequelize.fn('LOWER', Sequelize.col('name')), 'ASC']],
    });
  }
}
