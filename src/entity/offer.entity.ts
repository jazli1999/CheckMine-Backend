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

  @Column({ type: 'timestamp' })
  outbounddeparturedatetime: Date;

  @Column()
  outbounddepartureairport: string;

  @Column({ type: 'timestamp' })
  outboundarrivaldatetime: Date;

  @Column()
  outboundarrivalairport: string;

  @Column({ type: 'timestamp' })
  inbounddeparturedatetime: Date;

  @Column()
  inbounddepartureairport: string;

  @Column({ type: 'timestamp' })
  inboundarrivaldatetime: Date;

  @Column()
  inboundarrivalairport: string;

  @Column()
  mealtype: string;

  @Column()
  oceanview: boolean;

  @Column()
  roomtype: string;

  @Column()
  duration: number;
}
