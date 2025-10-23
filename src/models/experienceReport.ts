import { Timestamp } from "firebase/firestore";

export interface experienceReport {
  id: string;
  title: string;
  deadline: Timestamp;
  shortTitle?: string;
  description: string;
  summaryDescription?: string;
  studyField: string;
  picture?: string;
  status?: string;
  studentId: string;
  projectId: string;
}
