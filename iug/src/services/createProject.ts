
import { addDoc, collection} from "firebase/firestore";
import firebase, { db } from "./firebaseConfig";
import { getAuth } from "firebase/auth";

const allowedLocations=["europe", "asia", "africa", "southAmerica", "northAmerica"]
const allowedStudyFields=["IT","Construction and infrastructure","Geotechnics","Machine and process engineering","Clean energy","Water and sanitation"]

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
    console.log("Hallo");
    await addDoc(collection(db, "project3"), {
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
    console.log("Hallo");

    if(auth.currentUser?.getIdToken()){
      console.log("Hallo");
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
