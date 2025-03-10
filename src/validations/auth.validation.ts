import { z } from 'zod';
import { MovieFormat } from '../enums/movie-format.enum';

export const registerSchema = z
  .object({
    email: z.string().email({ message: 'Invalid email' }),
    name: z.string(),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
    confirmPassword: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});
