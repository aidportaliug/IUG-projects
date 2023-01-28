
import { addDoc, collection, GeoPoint } from "firebase/firestore";
import firebase, { db } from "./firebaseConfig";
import { getAuth } from "firebase/auth";

const storeProject = async (
    title: string,
    location: GeoPoint,
    durationDays: number, //TODO: Days or credits?
    deadline: Date,
    field: string,
    status: string,
    professorId: string,
    description?: string,
  ) => {
    await addDoc(collection(db, "project2"), {
      title: title,
      location: location,
      durationDays: durationDays,
      deadline: deadline,
      field: field,
      status: status,
      professorId: professorId,
      description: description
    });
  };

  export default async function createProject( 
    title: string,
    location: GeoPoint,
    durationDays: number,
    deadline: Date,
    field: string,
    status: string,
    description?: string,
  ){
    const auth = getAuth(firebase);
    let newDate = new Date()
    let geoPoint : GeoPoint = new GeoPoint ( -34.85553195363169, -56.207280375137955 )

    if(auth.currentUser?.getIdToken()){
        storeProject("Test", geoPoint, 10 , newDate , "data", "open",  await auth.currentUser?.getIdToken(), "noe kult")
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          throw alert(errorCode + " " + errorMessage);
        });
    }
}
