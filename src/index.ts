import { SetupServer } from './server';

(async (): Promise<void> => {
  try {
    const server = new SetupServer(3000);
    server.init();
    server.start();
  } catch (error) {
    console.log(`App exited with error: ${error}`);
  }
})();
