import { HttpException } from './http.exception';

export class NotFoundException extends HttpException {
  message: string;

  constructor(message = 'Data not found') {
    super(message, 404);
    this.message = message;
  }
}
