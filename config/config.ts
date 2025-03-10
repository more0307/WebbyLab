import dotenv from 'dotenv';

dotenv.config();

export const config = {
  development: {
    dialect: process.env.DB_DIALECT,
    storage: process.env.DB_STORAGE,
  },
  test: {
    dialect: process.env.DB_DIALECT,
    storage: process.env.DB_STORAGE,
  },
  production: {
    dialect: process.env.DB_DIALECT,
    storage: process.env.DB_STORAGE,
  },
};
