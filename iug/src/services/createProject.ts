
import { addDoc, collection} from "firebase/firestore";
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
    professorId: string,
  ) => {
    await addDoc(collection(db, "project"), {
      title: title,
      shortTitle: shortTitle,
      studyField: studyField,
      location: location,
      deadline: deadline,
      description: description,
      summaryDescription: summaryDescription,
      duration: duration,
      professorId:professorId
    });
  };

  export default async function createProject( 
    title: string,
    shortTitle: string,
    studyField: string,
    location: string,
    deadline: Date,
    description: string,
    duration: number,
    summaryDescription: string,
  ){
    const auth = getAuth(firebase);
    if(auth.currentUser?.getIdToken()){
      if(allowedLocations.includes(location) && allowedStudyFields.includes(studyField)){
        storeProject(title ,shortTitle, studyField , location , deadline, description, summaryDescription, duration, await auth.currentUser?.getIdToken())
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          throw alert(errorCode + " " + errorMessage);
        });
      }
      else{
        console.log("not valid location or studyfield")
      }
    }
}
