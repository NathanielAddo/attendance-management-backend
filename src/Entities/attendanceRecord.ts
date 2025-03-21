import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity("attendance_attendance") // Table for attendance events
export class AttendanceRecord {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "schedule_id", type: "uuid" })
  scheduleId!: string;

  @Column({ name: "user_id" })
  userId!: number;

  @Column({ name: "clock_in_time", type: "timestamp", nullable: true })
  clockInTime!: Date | null;

  @Column({ name: "clock_out_time", type: "timestamp", nullable: true })
  clockOutTime!: Date | null;

  @Column({ name: "coordinates", type: "jsonb", nullable: true })
  coordinates!: object | null;

  @Column({ name: "device_info", type: "jsonb", nullable: true })
  deviceInfo!: object | null;
}
