import { NextFunction, Request, Response } from 'express';
import { config } from '../../../config/config';
import { AuthException } from '../../../exceptions/auth.exception';
import jwt from 'jsonwebtoken';
import { User } from '../../../db/models/user.model';

interface DecodedToken {
  id: number;
}

export function AuthenticateHttpMiddleware(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new AuthException();
  }

  const token = authorization.split(' ')[1];

  if (!token) {
    return res.errorResponse(new AuthException('Token is missing'));
  }

  jwt.verify(token, config.jwt.accessSecret, async (err, decoded) => {
    if (err) {
      return res.errorResponse(new AuthException('Invalid or expired token'));
    }
    const decodedToken = decoded as DecodedToken;

    const user = await User.findOne({ where: { id: decodedToken.id } });
    if (!user) {
      return res.errorResponse(new AuthException());
    }

    req.user = user.dataValues;

    next();
  });
}
