import { Request, Response } from 'express';
import AppDataSource from './DataSource';
import { Offer } from './entity/offer.entity';
import { EntityColumns } from './constants';

export const getAllOutboundDepartureAirports = async (
  _: Request,
  res: Response
) => {
  const response = await AppDataSource.getRepository(Offer)
    .createQueryBuilder('offer')
    .select(`DISTINCT(${EntityColumns.OUT_DEP_AIRPORT})`)
    .orderBy(EntityColumns.OUT_DEP_AIRPORT)
    .getRawMany();
  res
    .status(200)
    .send(response.map((rawRes) => rawRes[EntityColumns.OUT_DEP_AIRPORT]));
};

export const getSampleOffers = async (_: Request, res: Response) => {
  const response = await AppDataSource.getRepository(Offer).find({
    take: 3,
  });
  res.status(200).send(response);
};
