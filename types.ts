export interface User {
  id: string; // Matches the database's user ID type
  name: string;
  email: string;
  role: "admin" | "user";
}

export interface JobType {
  id: number;
  name: string; // Name of the job type (e.g., "Bærbar", "Macbook", "Butik")
  color: string; // HEX color code or CSS color value
}

export interface Shift {
  id: number;
  startTime: string; // ISO string for DateTime
  endTime: string; // ISO string for DateTime
  user: User;
  type: "På arbejde" | "Syg" | "Fridag"; // Enum for shift types
  break: number; // Break duration in minutes
  jobType: JobType; // Associated job type
}

export interface Day {
  id: number;
  name: string; // Name of the day (e.g., "Mandag", "Tirsdag")
  date: string; // ISO string for DateTime
  shifts: Shift[]; // List of shifts for the day
}

export interface Week {
  id?: number; // Week ID (optional for API responses)
  weekNumber?: number; // ISO week number
  days: Day[]; // List of days in the week
}

export interface HolidayRequest {
  id: number; // Matches Prisma's Int type
  userId: string; // User ID
  user: {
    id: string;
    name: string;
    email: string;
  };
  startDate: string; // DateTime as ISO string
  endDate: string; // DateTime as ISO string
  reason?: string; // Optional reason
  status: "pending" | "approved" | "rejected"; // Request status
  createdAt: string; // ISO string for DateTime
  updatedAt: string; // ISO string for DateTime
}

export enum ShiftType {
  AT_WORK = "På arbejde",
  SICK_LEAVE = "Syg",
  DAY_OFF = "Fridag",
}
