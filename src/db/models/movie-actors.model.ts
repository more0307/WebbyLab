import sequelize from '../init';
import Actor from './actor.model';
import Movie from './movie.model';
import { DataTypes } from 'sequelize';

const MovieActor = sequelize.define(
  'MovieActor',
  {
    movieId: {
      type: DataTypes.INTEGER,
      references: {
        model: Movie,
        key: 'id',
      },
    },
    actorId: {
      type: DataTypes.INTEGER,
      references: {
        model: Actor,
        key: 'id',
      },
    },
  },
  { tableName: 'movie_actors', timestamps: false },
);

export default MovieActor;
