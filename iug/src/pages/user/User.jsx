import { useState, useEffect } from "react";
import React from "react";
import "./user.css";
import Button from "@mui/material/Button";
import { auth, db, storage } from "../../firebase-config";
import { signOut, onAuthStateChanged, deleteUser } from "firebase/auth";
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore'
import { useNavigate } from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import Avatar from '@mui/material/Avatar'
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";




export default function User() {

    const profileCollectionReference = collection(db, "profile");
    const [profiles, setProfiles] = useState([]);
    const [user, setUser] = useState({});
    const [name, setName] = useState("");
    const nav = useNavigate();


    const getName = async (currentUser) => {
        const data = await getDocs(profileCollectionReference);
        data.forEach((t) => {
            if (t.id == currentUser.email) {
                setName(t.data().name + " " + t.data().lastname)
            }
        })
    }

    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);

            if (!currentUser) {
                console.log(auth.currentUser);
                nav("/");
            }

            getName(currentUser);
        });
    }, []);


    const logout = async () => {
        console.log("User signed out");
        await signOut(auth);
        nav("/");

    };

    const deleteUser = async () => {
        await deleteDoc(doc(db, "profile", user.email));
        auth.currentUser.delete().then(() => {
            logout(); //This is probably not needed
        }).catch((error) => {
            console.log("Error in deletion");
        });
    }

    const [image, setImage] = useState(null);
    const [url, setUrl] = useState(null);
    const imageName = "/profile/" + auth.currentUser.email + "ProfileImage";

    useEffect(() => {
        const getPicture = async () => {
            const imageRef = ref(storage, imageName);
            getDownloadURL(imageRef).then((url) => {
                setUrl(url);
            });
        }
        getPicture();
    })


    const handleImageChange = (e) => {
        if (e.target.files[0]) {
          setImage(e.target.files[0]);
        }
      };
    
      const handleSubmit = () => {
        const imageRef = ref(storage, imageName);

        uploadBytes(imageRef, image)
          .then(() => {
            getDownloadURL(imageRef)
              .then((url) => {
                setUrl(url);
              })
              .catch((error) => {
                console.log(error.message, "error getting the image url");
              });
            setImage(null);
          })
          .catch((error) => {
            console.log(error.message);
          });
          console.log(url);
console.log(setUrl);
      };



    return (
        <>
            <div className="user">
                <div className="top-part">
                    <h1 className="username">{name}</h1>
                </div>




<div className="profileIcon">
<Avatar src={url} sx={{ width: 150, height: 150 }} />
    <input type="file" onChange={handleImageChange} />
    <button onClick={handleSubmit}>Submit</button>
                </div>

                <div className="interests">
                    <h3>My information:</h3>
                    <div className="myInterests">
                        <p>mail:</p>
                        <p>year of study:</p>
                        <p>Study: </p>
                    </div>
                </div>
                <Button variant="contained" id="btnLogOut" onClick={logout}>
                    Log out
                </Button>
                <Button variant="contained" id="btnLogOut" onClick={deleteUser}>
                    Delete User
                </Button>

            </div>
            </>
    );
};
