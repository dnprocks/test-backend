import { Request, Response } from 'express';
import { Controller, Delete, Middleware, Post, Put } from '@overnightjs/core';
import { ROLE, User } from '@src/entities/user';
import mongoose from 'mongoose';
import AuthService from '@src/util/AuthService';
import { authMiddleware } from '@src/middlewares/auth';

@Controller('user')
export class UserController {

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

  @Post('authenticate')
  public async authenticate(req: Request, res: Response): Promise<Response> {
    const user = await User.findOne({ email: req.body.email, active: true });
    if (!user) {
      return res.status(401).send({ error: 'Try verifying your email address.' });
    }
    if (
      !(await AuthService.comparePasswords(req.body.password, user.password))
    ) {
      return res.status(401).send({ error: 'Password does not match!' });
    }
    const token = AuthService.generateToken(user.toJSON());

    return res.send({ ...user.toJSON(), ...{ token } });
  }

  // TODO: Validade old password - Refactoring
  @Put(':id')
  @Middleware(authMiddleware)
  public async update(request: Request, response: Response): Promise<void> {
    try {
      const { name, password } = request.body;
      let role;
      if (request.decoded?.role == ROLE.ADMIN) {
        role = request.body.role;
        if (!Object.values(ROLE).includes(role)) {
          response.status(400).send({ error: 'invalid role' });
          return;
        }
      }
      const user = await User.findOne({ '_id': request.params.id }).select('+password');

      if (user !== null) {
        user.name = name;
        user.password = password;
        if (role !== undefined) {
          user.role = role;
        }
        const newUser = await User.findOneAndUpdate({ '_id': request.params.id }, user.toJSON(), { new: true });
        response.status(201).send(newUser);
      } else {
        response.status(400).send({ error: 'user not found' });
      }

    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        response.status(422).send({ error: error.message });
      } else {
        console.log(error);
        response.status(500).send({ error: 'Internal Server Error' });
      }
    }
  }

  @Delete(':id')
  @Middleware(authMiddleware)
  public async delete(request: Request, response: Response): Promise<void> {
    try {
      const user = await User.findOne({ '_id': request.params.id });
      if (user !== null) {
        user.active = false;
        await User.findOneAndUpdate({ '_id': request.params.id }, user.toJSON());
        response.status(204).send();
      } else {
        response.status(400).send({ error: 'user not found' });
      }
    } catch (error) {
      response.status(400).send({ error: error.message });
    }
  }

}
