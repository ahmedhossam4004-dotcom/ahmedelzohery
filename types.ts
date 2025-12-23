
export type Role = 'Admin' | 'Team Lead' | 'Supervisor' | 'User';

export type Team = 'A' | 'B' | 'C' | 'D';

export interface User {
  id: string;
  username: string;
  role: Role;
  team?: Team;
}

export interface AbsenceLog {
  id: string;
  workerId: string;
  startTime: number;
  endTime: number | null;
  duration: number; // in seconds
  reason?: string;
  date: string; // YYYY-MM-DD
}

export interface Worker {
  id: string;
  pcNumber: string;
  name: string;
  team: Team;
  status: 'Active' | 'Away';
  lastAbsenceStart?: number;
  totalAbsenceToday: number; // seconds
}

export interface ShiftConfig {
  startTime: string; // HH:mm
  durationHours: number;
  alertThresholdMinutes: number;
}
