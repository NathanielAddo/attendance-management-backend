// attendanceStat.entity.ts

export interface AttendanceStat {
    date: Date;
    totalEmployees: number;
    onTime: number;
    absent: number;
    lateArrivals: number;
    earlyDepartures: number;
    overtimeEmployees: number;
    totalHours: number;
    overtimeHours: number;
  }
  