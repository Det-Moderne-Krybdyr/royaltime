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
  