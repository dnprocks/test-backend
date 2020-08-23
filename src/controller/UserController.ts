import { IUserRepository } from '@src/repositories/IUserRepository';
import { Request, Response } from 'express';
import { Controller, Post } from '@overnightjs/core';
import { User } from '@src/entities/user';
import { UserRepository } from '@src/repositories/implementation/UserRepository';
import mongoose from "mongoose";

@Controller('user')
export class UserController {
  constructor(private userRepository: IUserRepository = new UserRepository()) {
  }

  @Post('')
  public async create(request: Request, response: Response): Promise<void> {
    try {
      const user = new User(request.body);
      const newUser = await user.save();
      response.status(201).send(newUser);
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        response.status(422).send({ error: error.message });
      } else {
        response.status(500).send({ error: 'Internal Server Error' });
      }
    }
  }
}
