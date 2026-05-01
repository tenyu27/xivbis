export interface BiSSet {
  job: string;
  role: 'Tank' | 'Healer' | 'DPS';
  link: string;
}

export type SetsData = Record<string, BiSSet[]>;
