import { Request, Response } from 'express';
import { ClassMiddleware, Controller, Get, Middleware, Post } from '@overnightjs/core';
import { Movie } from '@src/entities/movie';
import mongoose from 'mongoose';
import { authMiddleware } from '@src/middlewares/auth';
import { authRoleAdminMiddleware } from '@src/middlewares/authRole';

@Controller('movie')
@ClassMiddleware(authMiddleware)
export class MovieController {
  @Post('')
  @Middleware(authRoleAdminMiddleware)
  public async create(request: Request, response: Response): Promise<void> {
    try {
      const movie = new Movie(request.body);
      const result = await movie.save();
      response.status(201).send(result);
    } catch (error) {
      console.log(error);
      if (error instanceof mongoose.Error.ValidationError) {
        response.status(422).send({ error: error.message });
      } else {
        response.status(500).send({ error: 'Internal Server Error' });
      }
    }
  }

  @Get()
  public async find(request: Request, response: Response): Promise<void> {
    const query = request.query;
    const movieQueryFilter = new QueryMovie(query).toString();
    const movie = await Movie.find(movieQueryFilter).sort({ title: 1 });
    response.status(200).send(movie);
  }

  @Get(':id')
  public async findById(request: Request, response: Response): Promise<void> {
    const movie = await Movie.findOne({ _id: request.params.id });
    response.status(200).send(movie);
  }

}

export class QueryMovie {
  public title: object | undefined;
  public year: string;
  public genre: string;
  public country: object | undefined;

  constructor(props: Movie) {
    this.title = props.title ? { $regex: props.title, $options: 'i' } : undefined;
    this.year = props.year;
    this.genre = props.genre;
    this.country = props.country ? { $regex: props.country, $options: 'i' } : undefined;
  }

  public toString(): any {
    return JSON.parse(JSON.stringify(this));
  }
}
