import { Timestamp } from 'firebase/firestore';

export interface experienceReport {
  id: string;
  title: string;
  shortTitle?: string;
  description: string;
  summaryDescription?: string;
  projectId: number | string;
  projectName?: string;
  authorId: number | string;
  authorUsername?: string;
  deadline: Timestamp | { toDate: () => Date };
  studyField: string;
  location: string;
  year?: number;
  duration: number;
  thesisLink?: string;
}