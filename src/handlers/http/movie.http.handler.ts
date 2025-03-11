import { Request, Response } from 'express';
import { MovieRepository } from '../../repositories/movie.repository';
import { NotFoundException } from '../../exceptions/not-found.exception';
import { FileService } from '../../services/file.service';
import { MovieService } from '../../services/movie.service';
import path from 'path';
import fs from 'fs';
import Actor from '../../db/models/actor.model';
import { ParamException } from '../../exceptions/param.exception';
import { ActorService } from '../../services/actor.service';

export class MovieHttpHandler {
  protected readonly repository: MovieRepository = new MovieRepository();
  protected readonly actorService: ActorService = new ActorService();
  protected readonly service: MovieService = new MovieService();
  protected readonly fileService: FileService = new FileService();

  /**
   * Create a new movie
   * @POST api/movies
   * @access private
   */
  public async create(req: Request, res: Response) {
    const movie = await this.repository.addMovieWithActors(req.body);
    if (!movie) {
      return res.errorResponse(new ParamException());
    }

    res.sendResponse({ data: movie });
  }

  /**
   * List of movies
   * @GET api/movies
   * @access private
   */
  public async list(req: Request, res: Response) {
    const { title } = req.query as { title: string | undefined };

    const movie = await this.service.list(title);

    res.sendResponse({ data: movie });
  }

  /**
   * Show a specific movie
   * @GET api/movies/:id
   * @access private
   */
  public async show(req: Request, res: Response) {
    const movie = await this.repository.findOne({
      where: { id: req.params.id },
      include: [{ model: Actor, as: 'actors' }],
    });

    if (!movie) {
      return res.errorResponse(new NotFoundException());
    }

    res.sendResponse({ data: movie });
  }

  /**
   * Update a specific movie
   * @PATCH api/movies/:id
   * @access private
   */
  public async update(req: Request, res: Response) {
    const [affectedRows] = await this.repository.update(req.body, {
      where: { id: req.params.id },
    });

    if (!affectedRows) {
      return res.errorResponse(new NotFoundException());
    }

    const updatedMovie = await this.repository.findByPk(+req.params.id);
    res.sendResponse({ data: updatedMovie });
  }

  /**
   * Delete a specific movie
   * @DELETE api/movies/:id
   * @access private
   */
  public async delete(req: Request, res: Response) {
    const movie = await this.repository.destroy({ where: { id: req.params.id } });

    res.sendResponse({ data: movie });
  }

  /**
   * Import movies from file
   * @POST api/movies/import
   * @access private
   */
  public async import(req: Request, res: Response) {
    if (!req.file) {
      return res.errorResponse(new ParamException());
    }

    const newFilePath = await this.fileService.save(req.file);
    const fileData = await this.fileService.getMovieData(newFilePath);
    const movies = await this.service.saveImport(fileData);

    res.sendResponse({ data: movies });
  }

  /**
   * Download movie file
   * @DELETE api/movies/download/:fileName
   * @access public
   */
  public async download(req: Request, res: Response) {
    const fileName = req.params.fileName;
    const filePath = path.join(process.cwd(), 'uploads', fileName);

    if (!fs.existsSync(filePath)) {
      return res.errorResponse(new NotFoundException());
    }

    res.download(filePath, fileName);
  }
}
