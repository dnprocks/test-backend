import { Request, Response } from 'express';
import { ClassMiddleware, Controller, Get, Middleware, Post } from '@overnightjs/core';
import { Movie } from '@src/entities/movie';
import { authMiddleware } from '@src/middlewares/auth';
import { authRoleAdminMiddleware } from '@src/middlewares/authRole';
import { BaseController } from '@src/controller/index';

@Controller('movie')
@ClassMiddleware(authMiddleware)
export class MovieController extends BaseController {
  @Post('')
  @Middleware(authRoleAdminMiddleware)
  public async create(request: Request, response: Response): Promise<void> {
    try {
      const movie = new Movie(request.body);
      const result = await movie.save();
      response.status(201).send(result);
    } catch (error) {
      this.sendCreateUpdateErrorResponse(response, error);
    }
  }

  @Get()
  public async find(request: Request, response: Response): Promise<void> {
    try {
      const query = request.query;
      const movieQueryFilter = new QueryMovie(query).toString();
      const movie = await Movie.find(movieQueryFilter).sort({ title: 1 });
      response.status(200).send(movie);
    } catch (error) {
      this.sendErrorResponse(response, {
        code: 500,
        message: 'Something went wrong',
      });
    }
  }

  @Get(':id')
  public async findById(request: Request, response: Response): Promise<void> {
    try {
      const movie = await Movie.findOne({ _id: request.params.id });
      response.status(200).send(movie);
    } catch (error) {
      this.sendErrorResponse(response, {
        code: 500,
        message: 'Something went wrong',
      });
    }
  }

}

export class QueryMovie {
  public title: object | undefined;
  public year: string;
  public genre: string;
  public country: object | undefined;

  // @ts-ignore
  constructor(props: QueryString.ParsedQs ) {
    this.title = props.title ? { $regex: props.title, $options: 'i' } : undefined;
    this.year = props.year;
    this.genre = props.genre;
    this.country = props.country ? { $regex: props.country, $options: 'i' } : undefined;
  }

  public toString(): any {
    return JSON.parse(JSON.stringify(this));
  }
}
