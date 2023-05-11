import { Request, Response } from 'express';
import AppDataSource from './DataSource';
import { Offer } from './entity/offer.entity';
import { EntityColumns } from './constants';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

export const getAllOutboundDepartureAirports = async (
  _: Request,
  res: Response
) => {
  const results = await AppDataSource.getRepository(Offer)
    .createQueryBuilder('offer')
    .select(`DISTINCT(${EntityColumns.OUT_DEP_AIRPORT})`)
    .orderBy(EntityColumns.OUT_DEP_AIRPORT)
    .getRawMany();
  res
    .status(200)
    .send(results.map((rawRes) => rawRes[EntityColumns.OUT_DEP_AIRPORT]));
};

export const getSampleOffers = async (_: Request, res: Response) => {
  const results = await AppDataSource.getRepository(Offer).find({
    where: { oceanview: true },
    take: 3,
  });
  res.status(200).send(results);
};

export const getOffers = async (req: Request, res: Response) => {
  const { airport, page, limit, children, adults, duration, start, end } =
    req.query;
  console.log(req.query);
  const results = await AppDataSource.getRepository(Offer)
    .createQueryBuilder('offer')
    .select('hotelid, count(*), min(price)')
    .where({
      [EntityColumns.OUT_DEP_AIRPORT]: airport,
      duration: Number(duration),
      [EntityColumns.IN_ARR_AIRPORT]: airport,
      countadults: Number(adults),
      countchildren: Number(children),
      [EntityColumns.OUT_DEP_DATETIME]: MoreThanOrEqual(start),
      [EntityColumns.IN_ARR_DATETIME]: LessThanOrEqual(end),
    })
    .groupBy('hotelid')
    .skip((Number(page) - 1) * Number(limit))
    .take(Number(limit))
    .getRawMany();
  res.status(200).send(results);
};
