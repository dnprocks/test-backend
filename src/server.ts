import './util/module-alias';
import { Server } from '@overnightjs/core';
import bodyParser from 'body-parser';
import { UserController } from '@src/controller/UserController';
import * as database from '@src/./database';


export class SetupServer extends Server {

  constructor(private port = 3000) {
    super();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.setupControllers();
    await this.setupDatabase();
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json());
  }

  private setupControllers(): void {
    const userController = new UserController();
    this.addControllers([userController]);
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log('Server listening on port: ' + this.port);
    });
  }

  private async setupDatabase(): Promise<void> {
    await database.connect()
  }

  public async close(): Promise<void> {
    await database.close();
  }
}
