import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('attendance_locations')
export class Location {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  address!: string;

  @Column()
  coordinates!: string; // Stored as "latitude,longitude"

  @Column('float')
  radius!: number;

  @Column()
  country!: string;

  @Column()
  branch!: string;

  @Column({ nullable: true })
  wifiId?: string;

  @Column({ nullable: true })
  bluetoothDeviceId?: string;

  @Column({ nullable: true })
  locationType?: string;

  @Column({ nullable: true })
  lastUpdated?: string;

  @Column({ nullable: true })
  updatedBy?: string;
}
