import { z } from 'zod';
import { MovieFormat } from '../enums/movie-format.enum';

export const movieCreateSchema = z.object({
  title: z.string().min(1, 'Movie title required'),
  year: z.number().int().min(1800, 'The year must not be earlier than 1800'),
  format: z.enum([MovieFormat.VHS, MovieFormat.DVD, MovieFormat.BluRay]),
  actors: z.array(z.string().min(1, 'Actor name cannot be empty')).nonempty('At least one actor must be specified'),
});

export const movieUpdateSchema = movieCreateSchema.partial();

export type MovieCreateDto = z.infer<typeof movieCreateSchema>;
