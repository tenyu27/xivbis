export interface BiSSetItem {
  name: string;
  link: string;
}

export interface BiSSet {
  job: string;
  jobName: string;
  role: 'Tank' | 'Healer' | 'DPS';
  sets: BiSSetItem[];
}

export type SetsData = Record<string, BiSSet[]>;
