import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import firebase, { db } from './firebaseConfig';
interface ContributionIds {
  experienceID: string[];
  projectID: string[];
}
const storeUser = async (
  userID: string,
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: number,
  institue: string,
  university: string
) => {
  const contributionIds: ContributionIds = { experienceID: [], projectID: [] };
  await addDoc(collection(db, 'userProfile'), {
    userID: userID,
    firstName: firstName,
    lastName: lastName,
    phoneNumber: phoneNumber,
    institute: institue,
    university: university,
    admin: false,
    email: email,
    contributionIds: contributionIds,
  });
};

export default function signUp(
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: number,
  institue: string,
  university: string,
  password: string
) {
  if (firstName === '' || lastName === '' || email === '' || password === '') {
    return false;
  }

  const auth = getAuth(firebase);
  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      console.log(userCredential);
      const userID = userCredential.user.uid;
      await storeUser(userID, firstName, lastName, email, phoneNumber, institue, university);
    })
    .catch((error: Error) => {
      //const errorCode:string = error.code;
      const errorMessage: string = error.message;
      throw alert(errorMessage);
    });
}
