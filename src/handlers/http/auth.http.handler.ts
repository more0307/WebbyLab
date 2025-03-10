import { Request, Response } from 'express';
import { UserRepository } from '../../repositories/user.repository';
import { AuthException } from '../../exceptions/auth.exception';
import bcrypt from 'bcryptjs';
import { AuthService } from '../../services/auth.service';
import { config } from '../../config/config';

export class AuthHttpHandler {
  protected readonly repository: UserRepository = new UserRepository();
  protected readonly service: AuthService = new AuthService();

  /**
   * Create a new user
   * @POST api/users/register
   * @access public
   */
  public async register(req: Request, res: Response) {
    const { email, password, name } = req.body;

    const candidate = await this.repository.findOne({ where: { email } });

    if (candidate !== null) {
      return res.errorResponse(new AuthException('Email already exists'));
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await this.repository.create({
      name,
      email,
      password: hashPassword,
    });

    const { ac_token, rf_token } = await this.service.authToken(newUser.id);

    res.cookie('_apprftoken', rf_token, config.cookie);

    res.sendResponse({
      data: {
        user: newUser,
        access_token: ac_token,
      },
    });
  }

  /**
   * Authorize user
   * @POST api/users/login
   * @access public
   */
  public async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const user = await this.repository.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.errorResponse(new AuthException());
    }

    const { ac_token, rf_token } = await this.service.authToken(user.id);

    res.cookie('_apprftoken', rf_token, config.cookie);

    res.sendResponse({
      data: {
        user,
        access_token: ac_token,
      },
    });
  }
}
