import { Request, Response, Router } from 'express';
import { UserController } from './controller/UserController';

const router = Router();

router.post('/', new UserController().create);

export { router };
