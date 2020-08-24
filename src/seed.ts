import './util/module-alias';
import * as database from '@src/./database';
import { ROLE, User } from '@src/entities/user';
import config from 'config';
import logger from '@src/logger';

export class Seed {
  public async init(): Promise<void> {
    await this.setupDatabase();
    const user = new User({
      name: config.get('Seed.user.name'),
      email: config.get('Seed.user.email'),
      password: config.get('Seed.user.password'),
      role: ROLE.ADMIN,
    });
    await User.deleteOne({ email: user.email });
    await user.save();
    await this.close();
  }

  private async setupDatabase(): Promise<void> {
    await database.connect();
  }

  public async close(): Promise<void> {
    await database.close();
  }
}

(async (): Promise<void> => {
  try {
    const seed = new Seed();
    await seed.init();
    logger.info('User created by seed');
  } catch (error) {
    logger.info(`App exited with error: ${error}`);
  }
})();
