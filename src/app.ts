import * as express from 'express';
import { Request, Response } from 'express';
import { config } from 'dotenv';
import AppDataSource from './DataSource';
import { Offer } from './entity/offer.entity';
import * as controllers from './controller';

config();

// create and setup express app
AppDataSource.initialize().then(() => {
  const app = express();
  app.use(express.json());

  // register routes

  app.get('/', async function (req: Request, res: Response) {
    const response = await AppDataSource.getRepository(Offer).find({
      where: { id: 1 },
    });
    res.status(200).send(response);
  });

  app.get('/outbounddepartureairports', controllers.getAllOutboundDepartureAirports);

  // start express server
  app.listen(process.env.PORT);

  console.log(`Running on port ${process.env.PORT}`);
});
