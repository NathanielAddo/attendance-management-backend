import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Attendance_Attendance {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  attendanceScheduleName!: string;

  @Column()
  country!: string;

  @Column()
  branch!: string;

  @Column()
  scheduleCategory!: string;

  @Column()
  scheduleSpan!: string;

  @Column()
  clockInTime!: string;

  @Column()
  clockOutTime!: string;

  @Column()
  lateTime!: string;

  @Column()
  setBreak!: string;

  @Column()
  locationType!: string;

  @Column()
  knownLocations!: string;

  @Column()
  recurring!: boolean;

  @Column()
  recurringDuration!: string;

  @Column()
  overtimeStatus!: string;

  @Column()
  virtualMeeting!: boolean;

  @Column()
  monthlyClockingOccurrences!: number;

  @Column()
  monthlyMinClockingOccurrences!: number;

  @Column()
  unlimitedShadow!: boolean;

  constructor() {
    // Ensure all required fields are initialized here
    this.id = 0;
    this.attendanceScheduleName = '';
    this.country = '';
    this.branch = '';
    this.scheduleCategory = '';
    this.scheduleSpan = '';
    this.clockInTime = '';
    this.clockOutTime = '';
    this.lateTime = '';
    this.setBreak = '';
    this.locationType = '';
    this.knownLocations = '';
    this.recurring = false;
    this.recurringDuration = '';
    this.overtimeStatus = '';
    this.virtualMeeting = false;
    this.monthlyClockingOccurrences = 0;
    this.monthlyMinClockingOccurrences = 0;
    this.unlimitedShadow = false;
  }
}
