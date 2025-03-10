import {
  Model,
  FindOptions,
  UpdateOptions,
  DestroyOptions,
  ModelStatic,
  CreationAttributes,
  BulkCreateOptions,
  CreateOptions,
} from 'sequelize';

export class BaseRepository<T extends Model> {
  constructor(private model: ModelStatic<T>) {}

  async findAll(params?: FindOptions): Promise<T[]> {
    return this.model.findAll(params);
  }

  async findByPk(id: number): Promise<T | null> {
    return this.findOne({
      where: { id },
    });
  }

  async findOne(params: FindOptions): Promise<T | null> {
    return this.model.findOne(params);
  }

  async findOrCreate(params: FindOptions, options?: CreateOptions): Promise<[T, boolean]> {
    return this.model.findOrCreate({ ...params, ...options });
  }

  async create(data: CreationAttributes<T>, options?: CreateOptions): Promise<T> {
    return this.model.create(data, options);
  }

  async createMany(data: CreationAttributes<T>[], options?: BulkCreateOptions): Promise<T[]> {
    return this.model.bulkCreate(data, options);
  }

  async update(data: Partial<T>, options: UpdateOptions): Promise<[affectedCount: number]> {
    return this.model.update(data, options);
  }

  async destroy(options: DestroyOptions): Promise<number> {
    return this.model.destroy(options);
  }
}
