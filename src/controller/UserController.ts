import { IUserRepository } from '@src/repositories/IUserRepository';
import { Request, Response } from 'express';
import { Controller, Post } from '@overnightjs/core';
import { UserRepository } from '@src/repositories/implementation/UserRepository';

@Controller('user')
export class UserController {
  constructor(private userRepository: IUserRepository = new UserRepository()) {
  }

  @Post('')
  public async create(request: Request, response: Response): Promise<void> {
    const { name, email, password } = request.body;

    console.log(name, email, password);

    response.status(201).send(request.body);
  }
}
