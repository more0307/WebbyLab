import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../init';

interface ActorAttributes {
  id: number;
  name: string;
}

interface ActorCreationAttributes extends Optional<ActorAttributes, 'id'> {}

export class Actor extends Model<ActorAttributes, ActorCreationAttributes> implements ActorAttributes {
  public id!: number;
  public name!: string;
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
