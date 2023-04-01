import {
  collection,
  DocumentData,
  getDocs,
  limit,
  orderBy,
  Query,
  query,
  QuerySnapshot,
  startAfter,
  where,
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import { Project } from "../models/project";

export const getProjects = async (
  order: string,
  filterLocation: string,
  filterStudyField: string,
  setLastVisible: React.Dispatch<React.SetStateAction<DocumentData>>,
  lastVisible: DocumentData | null,
  givenLimit: number
) => {
  let queryGetProjects: Query<DocumentData>;
  if (filterLocation === "location" && filterStudyField === "study_field") {
    queryGetProjects = query(
      collection(db, "project"),
      orderBy(order),
      startAfter(lastVisible),
      limit(givenLimit)
    );
  } else if (filterStudyField === "study_field") {
    queryGetProjects = query(
      collection(db, "project"),
      orderBy(order),
      where("location", "==", filterLocation),
      startAfter(lastVisible),
      limit(givenLimit)
    );
  } else if (filterLocation === "location") {
    queryGetProjects = query(
      collection(db, "project"),
      orderBy(order),
      where("studyField", "==", filterStudyField),
      startAfter(lastVisible),
      limit(givenLimit)
    );
  } else {
    queryGetProjects = query(
      collection(db, "project"),
      orderBy(order),
      where("location", "==", filterLocation),
      where("studyField", "==", filterStudyField),
      startAfter(lastVisible),
      limit(givenLimit)
    );
  }
  const docSnapShotUser: QuerySnapshot<DocumentData> = await getDocs(
    queryGetProjects
  );
  const projects: Project[] = [];
  const lastDocument: DocumentData =
    docSnapShotUser.docs[docSnapShotUser.docs.length - 1];
  setLastVisible(lastDocument);
  docSnapShotUser.forEach((doc) => {
    const project = doc.data() as Project;
    project.id = doc.id;
    projects.push(project);
  });
  return projects;
};
