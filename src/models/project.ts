import { Timestamp } from 'firebase/firestore';

export interface Project {
  id: string;
  deadline: Timestamp;
  title: string;
  shortTitle?: string;
  location: string;
  duration: number; //TODO: Days or credits?
  studyField: string;
  description: string;
  summaryDescription?: string;
  picture?: string;
  status?: string;
  professorId: string;
}
