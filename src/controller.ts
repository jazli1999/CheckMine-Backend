import { Request, Response } from 'express';
import AppDataSource from './DataSource';
import { Offer } from './entity/offer.entity';
import { EntityColumns } from './constants';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Hotel } from './entity/hotel.entity';

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

  const count = await AppDataSource.getRepository(Offer)
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
    .groupBy('offer.hotelid')
    .getRawMany();

  const offers = AppDataSource.getRepository(Offer)
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
    .groupBy('offer.hotelid')
    .skip((Number(page) - 1) * Number(limit))
    .take(Number(limit));

  const results = await AppDataSource.createQueryBuilder()
    .select('*')
    .from(`(${offers.getQuery()})`, 'offers')
    .leftJoinAndSelect(Hotel, 'hotel', 'offers.hotelid = hotel.hotelid')
    .setParameters(offers.getParameters())
    .getRawMany();

  res.status(200).send({ count: count.length, data: results });
};

export const getHotelOffers = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { airport, page, limit, children, adults, duration, start, end } =
    req.query;

  const hotel = await AppDataSource.getRepository(Hotel).findOneBy({
    hotelid: parseInt(id),
  });
  const count = await AppDataSource.getRepository(Offer)
    .createQueryBuilder('offer')
    .where({
      hotelid: id,
      [EntityColumns.OUT_DEP_AIRPORT]: airport,
      duration: Number(duration),
      [EntityColumns.IN_ARR_AIRPORT]: airport,
      countadults: Number(adults),
      countchildren: Number(children),
      [EntityColumns.OUT_DEP_DATETIME]: MoreThanOrEqual(start),
      [EntityColumns.IN_ARR_DATETIME]: LessThanOrEqual(end),
    })
    .getCount();

  const offers = await AppDataSource.getRepository(Offer)
    .createQueryBuilder('offer')
    .where({
      hotelid: id,
      [EntityColumns.OUT_DEP_AIRPORT]: airport,
      duration: Number(duration),
      [EntityColumns.IN_ARR_AIRPORT]: airport,
      countadults: Number(adults),
      countchildren: Number(children),
      [EntityColumns.OUT_DEP_DATETIME]: MoreThanOrEqual(start),
      [EntityColumns.IN_ARR_DATETIME]: LessThanOrEqual(end),
    })
    .orderBy({ offer_price: 'ASC' })
    .skip((Number(page) - 1) * Number(limit))
    .take(Number(limit))
    .getRawMany();

  res.status(200).send({ hotel, count, offers });
};
