// history.ts

export interface Attendance_HistorySummary {
    id: string;
    name: string;
    userType: string;
    country: string;
    branch: string;
    category: string;
    group_name: string;
    subgroup: string;
    schedule: string;
    clockIns: number;
    clockOuts: number;
    adminClockIns: number;
    adminClockOuts: number;
    totalHours: number;
    overtimeHours: number;
    lateHours: number;
    breakOverstayHrs: number;
    clockOutBeforeTimeHrs: number;
  }
  
  export interface BreakdownRecord {
    date: string;
    clockIn: string;
    clockOut: string;
    clockedBy: string;
    hours: number;
    overtimeHours: number;
    lateHours: number;
    breakOverstayHours: number;
    earlyDepartureHours: number;
  }
  
  export interface HistoryBreakdown {
    id: string;
    name: string;
    userType: string;
    country: string;
    branch: string;
    category: string;
    group_name: string;
    subgroup: string;
    schedule: string;
    records: BreakdownRecord[];
  }
  
  export interface UserValidation {
    userIds: string[];
    validatedBy: string;
  }
  
  