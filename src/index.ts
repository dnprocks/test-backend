import { SetupServer } from './server';
import config from 'config';
import logger from '@src/logger';

(async (): Promise<void> => {
  try {
    const server = new SetupServer(config.get('App.port'));
    await server.init();
    server.start();
  } catch (error) {
    logger.info(`App exited with error: ${error}`);
  }
})();
