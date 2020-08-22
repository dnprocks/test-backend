import { SetupServer } from './server';
import  config from 'config';

(async (): Promise<void> => {
  try {
    const server = new SetupServer(config.get("App.port"));
    server.init();
    server.start();
  } catch (error) {
    console.log(`App exited with error: ${error}`);
  }
})();
