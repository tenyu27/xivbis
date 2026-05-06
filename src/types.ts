export interface BiSSetItem {
  name: string;
  link: string;
}

export interface JobData {
  name: string;
  Role: string;
  Sets: Record<string, BiSSetItem[]>;
}

export interface SetsData {
  categories: string[];
  [jobCode: string]: JobData | string[];
}

export interface BiSSet {
  job: string;
  jobName: string;
  role: string;
  sets: BiSSetItem[];
}
