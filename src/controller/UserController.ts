import { IUserRepository } from '@src/repositories/IUserRepository';
import { Request, Response } from 'express';
import { UserRepository } from '../repositories/implementation/UserRepository';


export class UserController {
  constructor(private userRepository: IUserRepository = new UserRepository()) {
  }

  public async create(request: Request, response: Response): Promise<void> {
    const { name, email, password } = request.body;

    console.log(name, email, password);

    response.status(201).send(request.body);
  }
}
