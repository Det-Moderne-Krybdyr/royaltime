export interface User {
  id: string; // Matches the database's user ID type
  name: string;
  email: string;
  role: "admin" | "user";
}

export interface Shift {
  id: number;
  startTime: string;
  endTime: string;
  user: User;
  type: "at-work" | "sick-leave" | "day-off";
  break: number;
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
export interface HolidayRequest {
  id: number; // Matches Prisma's Int type
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  startDate: string; // DateTime as ISO string
  endDate: string; // DateTime as ISO string
  reason?: string; // Optional reason
  status: string; // Defaults to "pending", "approved", or "rejected"
  createdAt: string; // ISO string for DateTime
  updatedAt: string; // ISO string for DateTime
}

export enum ShiftType {
  AT_WORK = "at-work",
  SICK_LEAVE = "sick-leave",
  DAY_OFF = "day-off",
}