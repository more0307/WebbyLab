import { Request, Response } from 'express';
import { ActorService } from '../../services/actor.service';

export class ActorHttpHandler {
  protected readonly actorService: ActorService = new ActorService();

  /**
   * List of actors
   * @GET api/movies
   * @access private
   */
  public async list(req: Request, res: Response) {
    const { name } = req.query as { name: string | undefined };

    const actors = await this.actorService.list(name);

    res.sendResponse({ data: actors });
  }
}
