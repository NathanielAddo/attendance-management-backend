import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('attendance_locations') // Specify the table name
export class Location {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  address!: string;

  @Column()
  coordinates!: string; // Assuming coordinates are stored as a string

  @Column('float') // Assuming radius is a floating-point number
  radius!: number;

  @Column()
  country!: string;

  @Column()
  branch!: string;
}
