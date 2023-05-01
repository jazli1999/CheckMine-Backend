import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Offer {
  @PrimaryColumn()
  id: number;

  @Column()
  hotelid: number;

  @Column()
  countadults: number;

  @Column()
  countchildren: number;

  @Column()
  price: number;

  @Column()
  outbounddeparturedatetime: string;

  @Column()
  outbounddepartureairport: string;

  @Column()
  outboundarrivaldatetime: string;

  @Column()
  outboundarrivalairport: string;

  @Column()
  inbounddeparturedatetime: string;

  @Column()
  inbounddepartureairport: string;

  @Column()
  inboundarrivaldatetime: string;

  @Column()
  inboundarrivalairport: string;

  @Column()
  mealtype: string;

  @Column()
  oceanview: number;

  @Column()
  roomtype: string;
}
