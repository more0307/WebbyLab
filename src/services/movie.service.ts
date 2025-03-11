import { MovieRepository } from '../repositories/movie.repository';
import { Op, Sequelize } from 'sequelize';
import Movie, { MovieAttributes } from '../db/models/movie.model';
import { MovieImportInterface } from '../interfaces/movie-import.interface';
import { MovieCreateDto } from '../validations/movie.validation';
import { MovieFormat } from '../enums/movie-format.enum';
import Actor from '../db/models/actor.model';

export class MovieService {
  protected readonly repository: MovieRepository = new MovieRepository();

  /**
   * Retrieves a list of movies with optional title search.
   * @param {string | undefined} title - Optional title search query.
   * @returns {Promise<Movie[]>} A promise that resolves with the list of movies.
   */
  public async list(title?: string): Promise<Movie[]> {
    const whereClause = title
      ? {
          title: {
            [Op.iLike]: `%${title.toLowerCase()}%`,
          },
        }
      : {};

    return this.repository.findAll({
      where: whereClause,
      order: [[Sequelize.fn('LOWER', Sequelize.col('title')), 'ASC']],
    });
  }

  /**
   * Saves imported movies to the database.
   * @param {MovieImportInterface[]} movies - The list of movies to be imported.
   * @returns {Promise<(MovieAttributes & { actors: Actor[] })[]>} A promise that resolves with the saved movie data.
   */
  public async saveImport(movies: MovieImportInterface[]): Promise<(MovieAttributes & { actors: Actor[] })[]> {
    const movieList = this.transformMovies(movies);
    const movieData = [];
    for (const movie of movieList) {
      const createdMovie = await this.repository.addMovieWithActors(movie);
      if (createdMovie) {
        movieData.push(createdMovie);
      }
    }

    return movieData;
  }

  /**
   * Transforms raw movie data into a structured format.
   * @param {MovieImportInterface[]} movies - The raw list of movies.
   * @returns {MovieCreateDto[]} - An array of transformed movie objects.
   */
  private transformMovies(movies: MovieImportInterface[]): MovieCreateDto[] {
    return movies.map((movie) => ({
      title: movie.Title || '',
      year: parseInt(movie['Release Year'] || '', 10),
      format: (movie.Format as MovieFormat) || '',
      source: movie.source || '',
      actors: [
        movie.Stars.split(', ')[0].trim(),
        ...movie.Stars.split(', ')
          .slice(1)
          .map((star: string) => star.trim()),
      ],
    }));
  }
}
