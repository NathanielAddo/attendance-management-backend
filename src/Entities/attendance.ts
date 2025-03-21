import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity("attendance_schedules") // Explicit table name
export class Attendance_Attendance {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "attendance_schedule_name" })
  attendanceScheduleName!: string;

  @Column()
  country!: string;

  @Column()
  branch!: string;

  @Column({ name: "schedule_category" })
  scheduleCategory!: string;
  
  @Column({ name: "schedule_span" })
  scheduleSpan!: string;
  
  @Column({ name: "clock_in_time" })
  clockInTime!: string;
  
  @Column({ name: "clock_out_time" })
  clockOutTime!: string;

  @Column({ name: "late_time" })
  lateTime!: string;

  @Column({ name: "set_break" })
  setBreak!: string;

  @Column({ name: "start_break_time" })
  startBreakTime!: string;

  @Column({ name: "end_break_time" })
  endBreakTime!: string;

  @Column({ name: "location_type" })
  locationType!: string;

  @Column({ name: "known_locations" })
  knownLocations!: string;

  @Column({ name: "recurring" })
  recurring!: boolean;

  @Column({ name: "recurring_days" })
  recurringDays!: string;

  // Explicitly specify the type as "varchar" and allow null values.
  @Column({ name: "recurring_duration", type: "varchar", nullable: true })
  recurringDuration!: string | null;

  @Column({ name: "non_recurring_dates" })
  nonRecurringDates!: string;

  @Column({ name: "overtime_status" })
  overtimeStatus!: string;

  @Column({ name: "virtual_meeting" })
  virtualMeeting!: boolean;

  @Column({ name: "monthly_clocking_occurrences" })
  monthlyClockingOccurrences!: number;

  @Column({ name: "monthly_min_clocking_occurrences" })
  monthlyMinClockingOccurrences!: number;

  @Column({ name: "unlimited_shadow" })
  unlimitedShadow!: boolean;

  constructor() {
    this.id = "";
    this.attendanceScheduleName = '';
    this.country = '';
    this.branch = '';
    this.scheduleCategory = '';
    this.scheduleSpan = '';
    this.clockInTime = '';
    this.clockOutTime = '';
    this.lateTime = '';
    this.setBreak = '';
    this.startBreakTime = '';
    this.endBreakTime = '';
    this.locationType = '';
    this.knownLocations = '';
    this.recurring = false;
    this.recurringDays = '';
    this.recurringDuration = null; // Now allowed to be null
    this.nonRecurringDates = '';
    this.overtimeStatus = '';
    this.virtualMeeting = false;
    this.monthlyClockingOccurrences = 0;
    this.monthlyMinClockingOccurrences = 0;
    this.unlimitedShadow = false;
  }
}
