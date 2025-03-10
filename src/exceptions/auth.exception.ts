import { HttpException } from './http.exception';

export class AuthException extends HttpException {
  message: string;

  constructor(message = 'Unauthorized') {
    super(message, 401);
    this.message = message;
  }
}
