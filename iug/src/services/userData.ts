import { getAuth, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { collection, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { useState } from 'react';
import { UserProfile } from '../models/user';
import firebase, { db } from './firebaseConfig';


const profileCollectionReference = collection(db, "profile")

async function getUserInfo(userId: string): Promise<UserProfile> {
    let user: UserProfile;
    const docRef = doc(db, 'profile', userId);
    const docSnap = await getDoc(docRef);
    user = docSnap.data() as UserProfile;
    user.userId = userId;
    if (!user) throw Error('No user with given userid exists!');
    return user;
    
}

export default async function getLoggedinUser()  {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (user?.email) {
        return await getUserInfo(user.email);


      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      // ...
      
    } else {
      // No user is signed in.
      console.log("no user is signed in")
    }
}


export async function deleteUserFromStore(email: string) {
    await deleteDoc(doc(db, "profile", email));
//   const res = await fetch(
//     'https://europe-west3-no-dcsandbox-tst-c062.cloudfunctions.net/deleteUser',
//     {
//       body: JSON.stringify({
//         uid: id,
//       }),
//       headers: {
//         'Content-Type': 'application/json',
//         // 'Accept': 'application/json',
//       },
//       mode: 'no-cors',
//       method: 'POST',
//     },
//   );
//   return (res.json());
}

