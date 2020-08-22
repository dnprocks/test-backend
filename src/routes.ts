import { Request, Response, Router } from 'express';

const router = Router();

router.get('/', (_: Request, res: Response) => {
  return res.status(200).send('ok');
});

export { router };
