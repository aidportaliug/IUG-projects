import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import firebase, { db } from './firebaseConfig';


const storeUser = async (firstName: string, lastName: string, gender: string, age: string, mail: string) => {
    await setDoc(doc(db, "profile", mail), {
      name: firstName,
      email: mail,
      lastname: lastName,
      gender: gender,
      age: age,
    });
  }


export default async function signUp(firstName: string, lastName: string, email: string, password: string, gender:string, age: string) {
    if (firstName === '' || lastName === '' || email === '' || password === '' || gender === '' || age === '') {
        return false;
    }
    
    const auth = getAuth(firebase);
    createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {

        storeUser(
            firstName,
            lastName,
            gender,
            age,
            email,
          );
          
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            throw alert(errorCode + " " + errorMessage);
        }
        );
    
    }
