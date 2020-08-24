import { Request, Response } from 'express';
import { Controller, Delete, Middleware, Post, Put } from '@overnightjs/core';
import { ROLE, User } from '@src/entities/user';
import AuthService from '@src/util/AuthService';
import { authMiddleware } from '@src/middlewares/auth';
import { BaseController } from '@src/controller/index';
import { authRoleAdminMiddleware } from '@src/middlewares/authRole';

@Controller('user')
export class UserController extends BaseController {
  @Post('')
  public async create(request: Request, response: Response): Promise<void> {
    try {
      const { name, email, password } = request.body;
      const user = new User();
      user.name = name;
      user.password = password;
      user.email = email;
      const newUser = await user.save();
      response.status(201).send(newUser);
    } catch (error) {
      this.sendCreateUpdateErrorResponse(response, error);
    }
  }

  @Post('admin')
  @Middleware([authMiddleware, authRoleAdminMiddleware])
  public async createAdmin(
    request: Request,
    response: Response,
  ): Promise<void> {
    try {
      const user = new User(request.body);
      const newUser = await user.save();
      response.status(201).send(newUser);
    } catch (error) {
      this.sendCreateUpdateErrorResponse(response, error);
    }
  }

  @Post('authenticate')
  public async authenticate(req: Request, res: Response): Promise<Response> {
    const user = await User.findOne({ email: req.body.email, active: true });
    if (!user) {
      return this.sendErrorResponse(res, {
        code: 401,
        message: 'User not found!',
        description: 'Try verifying your email address.',
      });
    }
    if (
      !(await AuthService.comparePasswords(req.body.password, user.password))
    ) {
      return this.sendErrorResponse(res, {
        code: 401,
        message: 'Password does not match!',
      });
    }
    const token = AuthService.generateToken(user.toJSON());

    return res.send({ ...user.toJSON(), ...{ token } });
  }

  @Put(':id')
  @Middleware(authMiddleware)
  public async update(request: Request, response: Response): Promise<void> {
    try {
      const { name, password } = request.body;
      const user = await User.findOne({ _id: request.params.id });
      if (user !== null) {
        user.name = name;
        user.password = password;
        // Only admin update roles
        if (request.decoded?.role === ROLE.ADMIN) {
          this.checkValidRole(request.body.role, response);
          user.role = request.body.role;
        }
        const newUser = await User.findOneAndUpdate(
          { _id: request.params.id },
          user.toJSON(),
          { new: true },
        );
        response.status(201).send(newUser);
      } else {
        this.sendErrorResponse(response, {
          code: 404,
          message: 'User not found!',
        });
      }
    } catch (error) {
      this.sendCreateUpdateErrorResponse(response, error);
    }
  }

  @Delete(':id')
  @Middleware(authMiddleware)
  public async delete(request: Request, response: Response): Promise<void> {
    try {
      const user = await User.findOne({ _id: request.params.id, active: true });
      if (!user) {
        this.sendErrorResponse(response, {
          code: 404,
          message: 'User not found!',
        });
        return;
      }

      await User.findOneAndUpdate(
        { _id: request.params.id },
        { active: false },
      );
      response.status(204).send();
    } catch (error) {
      this.sendErrorResponse(response, {
        code: 500,
        message: 'Something went wrong',
      });
    }
  }

  private checkValidRole(role: string, response: Response): void {
    if (!Object.values(ROLE).includes(role)) {
      this.sendErrorResponse(response, {
        code: 400,
        message: 'Invalid role!',
      });
      return;
    }
  }
}
