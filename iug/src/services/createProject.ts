import {
  addDoc,
  arrayUnion,
  collection,
  CollectionReference,
  doc,
  DocumentData,
  getDocs,
  query,
  QuerySnapshot,
  updateDoc,
  where,
} from "firebase/firestore";
import firebase, { db } from "./firebaseConfig";
import { getAuth } from "firebase/auth";
import { allowedLocations, allowedStudyFields } from "../models/allowedValues";

const storeProject = async (
  title: string,
  shortTitle: string,
  studyField: string,
  location: string,
  deadline: Date,
  description: string,
  summaryDescription: string,
  duration: number,
  professorId: string
) => {
  const docRef = await addDoc(collection(db, "project"), {
    title: title,
    shortTitle: shortTitle,
    studyField: studyField,
    location: location,
    deadline: deadline,
    description: description,
    summaryDescription: summaryDescription,
    duration: duration,
    professorId: professorId,
  });

  const queryGetUser: CollectionReference<DocumentData> = collection(
    db,
    "userProfile"
  );
  const q = query(queryGetUser, where("userID", "==", professorId));
  const userProfileSnapshot: QuerySnapshot<DocumentData> = await getDocs(q);
  console.log(professorId);
  console.log(userProfileSnapshot.empty);

  if (!userProfileSnapshot.empty) {
    const userRef = doc(db, "userProfile", userProfileSnapshot.docs[0].id);
    await updateDoc(userRef, {
      "contributionIds.projectID": arrayUnion(docRef.id),
    });
    console.log(userProfileSnapshot);
  }
};

export default async function createProject(
  title: string,
  shortTitle: string,
  studyField: string,
  location: string,
  deadline: Date,
  description: string,
  duration: number,
  summaryDescription: string
) {
  const auth = getAuth(firebase);
  if (auth.currentUser?.getIdToken()) {
    if (
      allowedLocations.includes(location) &&
      allowedStudyFields.includes(studyField)
    ) {
      storeProject(
        title,
        shortTitle,
        studyField,
        location,
        deadline,
        description,
        summaryDescription,
        duration,
        await auth.currentUser.uid
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
