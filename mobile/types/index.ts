export interface User {
  id: string;
  name: string;
  email: string;
  level: string;
  points: number;
}

export interface Activity {
  id: string;
  title: string;
  co2Saved: number;
  points: number;
  date: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  color: string;
}
