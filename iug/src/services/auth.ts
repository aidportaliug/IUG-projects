import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import firebase from "./firebaseConfig";

const auth = getAuth(firebase);
export default async function logIn(email: string, password: string) {
  if (email === "" || password === "") {
    return false;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log(userCredential.user);
      console.log("logged inn succesfully");
      return true;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
      throw alert(errorCode + " " + errorMessage);
      // return false
    });
}

export async function logOut() {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
    })
    .catch((error) => {
      // An error happened.
      throw error(error.errorMessage);
    });
}

export async function deleteFromAuth(id: string) {
  const res = await fetch(
    "https://europe-west3-no-dcsandbox-tst-c062.cloudfunctions.net/deleteUser",
    {
      body: JSON.stringify({
        uid: id,
      }),
      headers: {
        "Content-Type": "application/json",
        // 'Accept': 'application/json',
      },
      mode: "no-cors",
      method: "POST",
    }
  );
  return res.json();

  //   auth.currentUser?.delete().then(() => {
  //     logout(); //This is probably not needed
  // }).catch((error) => {
  //     console.log("Error in deletion");
  // });
}
