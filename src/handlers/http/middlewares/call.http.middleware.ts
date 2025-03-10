import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export function CallHttpMiddleware<T>(handlerClass: any, methodName: keyof typeof handlerClass, schema?: ZodSchema<T>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema) {
        const parsed = schema.safeParse(req.body);
        if (!parsed.success) {
          return res.status(400).json({
            message: 'Validation error',
            errors: parsed.error.format(),
          });
        }
        req.body = parsed.data;
      }

      const handler = new handlerClass();
      if (typeof handler[methodName] === 'function') {
        await handler[methodName](req, res, next);
      } else {
        throw new Error(`Method ${String(methodName)} not found in class ${handlerClass.name}`);
      }
    } catch (error) {
      next(error);
    }
  };
}
