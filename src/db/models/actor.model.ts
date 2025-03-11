import { Association, DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../init';
import Movie from './movie.model';

interface ActorAttributes {
  id: number;
  name: string;
}

export class Actor extends Model<ActorAttributes, Optional<ActorAttributes, 'id'>> implements ActorAttributes {
  public id!: number;
  public name!: string;

  public static associations: {
    movies: Association<Actor, Movie>;
  };
}

Actor.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: 'actors',
    timestamps: true,
  },
);

export default Actor;
