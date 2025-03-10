import multer from 'multer';
import { NextFunction, Request, Response } from 'express';

export function processFileMiddleware(req: Request, res: Response, next: NextFunction) {
  const upload = multer({
    storage: multer.memoryStorage(),
  }).single('file');

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return next(err);
    } else if (err) {
      return next(err);
    }

    next();
  });
}
