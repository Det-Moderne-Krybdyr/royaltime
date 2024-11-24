export interface User {
    id: string; // Matches the database's user ID type
    name: string;
  }
  
  export interface Shift {
    id: number;
    startTime: string;
    endTime: string;
    user: User;
    type: "at-work" | "sick-leave" | "day-off";
  }
  
  export interface Day {
    id: number;
    name: string;
    date: string;
    shifts: Shift[];
  }
  
  export interface Week {
    id?: number;
    weekNumber?: number;
    days: Day[];
  }
  export type HolidayRequest = {
    id: number; // Unique identifier for the holiday request
    userId: string; // ID of the user who submitted the request
    user: {
      id: string; // User ID
      name: string; // User name
    };
    startDate: string; // Start date of the holiday (ISO string format)
    endDate: string; // End date of the holiday (ISO string format)
    reason?: string; // Optional reason for the holiday request
    status: "pending" | "approved" | "rejected"; // Status of the request
    createdAt: string; // Date the request was created (ISO string format)
    updatedAt: string; // Date the request was last updated (ISO string format)
  };

  export enum ShiftType {
    AT_WORK = "at-work",
    SICK_LEAVE = "sick-leave",
    DAY_OFF = "day-off",
  }
  
  