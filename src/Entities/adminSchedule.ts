export interface AdminSchedule {
    id?: number; // Optional for new schedules
    name: string;
    branch: string;
    start_time: string; // Assuming time is stored as a string (e.g., "HH:MM:SS")
    closing_time: string;
    assigned_users: number[]; // Array of user IDs
    locations: string[]; // Array of location strings
    duration: number; // Duration in minutes
  }
  
  export interface AdminScheduleResponse {
    success: boolean;
    message: string;
    data?: AdminSchedule | AdminSchedule[] | null;
    error?: string;
  }
  
  export interface DeleteScheduleResponse {
    success: boolean;
    message: string;
    deletedItem?: AdminSchedule;
    error?: string;
  }
  