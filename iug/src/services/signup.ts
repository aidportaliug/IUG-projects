import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import firebase, { db } from "./firebaseConfig";
interface ContributionIds{
  experienceID: string[],
  projectID: string[]
}
const storeUser = async (
  userID: string,
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: number,
  institue: string,
  university: string,
  professor: boolean,
) => {
  var contributionIds: ContributionIds = {experienceID :[],
                                          projectID : []}
  await addDoc(collection(db, "userProfile"), {
    userID: userID,
    firstName: firstName,
    lastName: lastName,
    phoneNumber: phoneNumber,
    institute: institue,
    university: university,
    professor: professor,
    admin: false,
    email: email,
    contributionIds: contributionIds,
  });
};

export default async function signUp(
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: number,
  institue: string,
  university: string,
  professor: boolean,
  password: string,
) {
  if (
    firstName === "" ||
    lastName === "" ||
    email === "" ||
    password === "" ||
    professor === null
  ) {
    return false;
  }

  const auth = getAuth(firebase);
  console.log(professor);
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log(userCredential)
      const userID = userCredential.user.uid
      storeUser(userID, firstName, lastName, email, phoneNumber, institue,university, professor);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      throw alert(errorCode + " " + errorMessage);
    });
}
