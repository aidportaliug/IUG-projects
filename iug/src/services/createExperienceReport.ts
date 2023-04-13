import { addDoc, collection } from "firebase/firestore";
import firebase, { db } from "./firebaseConfig";
import { getAuth } from "firebase/auth";
import { allowedLocations, allowedStudyFields } from "../models/allowedValues";

const storeExperienceReport = async (
  title: string,
  shortTitle: string,
  studyField: string,
  location: string,
  year: number,
  description: string,
  summaryDescription: string,
  projectId: string | undefined,
  studentId: string
) => {
  await addDoc(collection(db, "experienceReport"), {
    title: title,
    shortTitle: shortTitle,
    studyField: studyField,
    location: location,
    year: year,
    description: description,
    summaryDescription: summaryDescription,
    studentId: studentId,
    projectId: projectId,
  });
};

export default async function createExperienceReport(
  title: string,
  shortTitle: string,
  studyField: string,
  location: string,
  year: number,
  description: string,
  summaryDescription: string,
  projectId?: string
) {
  const auth = getAuth(firebase);
  if (auth.currentUser?.getIdToken()) {
    if (
      allowedLocations.includes(location) &&
      allowedStudyFields.includes(studyField)
    ) {
      storeExperienceReport(
        title,
        shortTitle,
        studyField,
        location,
        year,
        description,
        summaryDescription,
        projectId ?? "",
        await auth.currentUser?.getIdToken()
      ).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        throw alert(errorCode + " " + errorMessage);
      });
    } else {
      console.log("not valid location or studyfield");
    }
  }
}
