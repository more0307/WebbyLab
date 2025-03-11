import sequelize from '../init';
import { Association, BulkCreateOptions, DataTypes, Model, Optional } from 'sequelize';
import { MovieFormat } from '../../enums/movie-format.enum';
import Actor from './actor.model';
import MovieActor from './movie-actors.model';

export interface MovieAttributes {
  id: number;
  title: string;
  year: number;
  source?: string;
  format: MovieFormat;
}

export class Movie extends Model<MovieAttributes, Optional<MovieAttributes, 'id'>> implements MovieAttributes {
  public id!: number;
  public title!: string;
  public year!: number;
  public format!: MovieFormat;
  public source!: string;

  public static associations: {
    actors: Association<Actor, Movie>;
  };

  public addActors!: (actors: Actor[], options: BulkCreateOptions) => Promise<void>;
}

Movie.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    format: {
      type: DataTypes.ENUM('DVD', 'BluRay', 'Digital'),
      allowNull: false,
    },
    source: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { sequelize, tableName: 'movies', timestamps: true },
);

Movie.belongsToMany(Actor, {
  through: MovieActor,
  foreignKey: 'movieId',
  otherKey: 'actorId',
  as: 'actors',
});

Actor.belongsToMany(Movie, {
  through: MovieActor,
  foreignKey: 'actorId',
  otherKey: 'movieId',
  as: 'movies',
});

export default Movie;
