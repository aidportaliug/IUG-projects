import { collection, DocumentData, getDocs, Query, query, QuerySnapshot } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { Project } from "../models/project";

export const  getProjects = async () => {
    const queryGetProjects : Query<DocumentData> = query(collection(db, "project"));
    const docSnapShotUser : QuerySnapshot<DocumentData> = await getDocs(queryGetProjects)
    const projects : Project[] = [];
    docSnapShotUser.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        const project = doc.data() as Project;
        project.id = doc.id;
        projects.push(project);
      });
    return projects;
}