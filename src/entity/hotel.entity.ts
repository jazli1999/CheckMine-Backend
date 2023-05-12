import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Hotel {
  @PrimaryColumn()
  hotelid: number;

  @Column()
  hotelname: string;

  @Column()
  hotelstars: number;
}
