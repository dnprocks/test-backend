import { Request, Response } from 'express';
import {
  ClassMiddleware,
  Controller,
  Middleware,
  Post,
} from '@overnightjs/core';
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
}
