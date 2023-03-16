import { collection, DocumentData, getDocs, orderBy, Query, query, QuerySnapshot, where } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { Project } from "../models/project";

export const  getProjects = async (order: string, filterLocation: string, filterStudyField: string) => {
    let queryGetProjects : Query<DocumentData>;
    if(filterLocation === "location" && filterStudyField === "study_field"){
      queryGetProjects = query(collection(db, "project"), orderBy(order));
    }
    else if(filterStudyField === "study_field"){
      queryGetProjects = query(collection(db, "project"), orderBy(order), where("location","==",filterLocation));
    }
    else if(filterLocation === "location"){
      queryGetProjects = query(collection(db, "project"), orderBy(order), where("studyField","==",filterStudyField));
    }
    else{
      queryGetProjects = query(collection(db, "project"), orderBy(order),  where("location","==",filterLocation), where("studyField","==",filterStudyField));
    }
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