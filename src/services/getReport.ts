import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { experienceReport } from "../models/experienceReport";

export async function getReport(id: string): Promise<experienceReport | null> {
  const projectDoc = doc(collection(db, "report"), id);
  const reportSnap = await getDoc(projectDoc);
  if (!reportSnap.exists) {
    return null;
  }
  const report = reportSnap.data() as experienceReport;
  report.id = reportSnap.id;
  return report;
}
