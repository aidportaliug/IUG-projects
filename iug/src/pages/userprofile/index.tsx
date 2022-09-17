import { useState, useEffect } from "react";
import "./user.css";
import Button from "@mui/material/Button";
import { auth, storage } from "../../services/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Avatar from '@mui/material/Avatar'
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { UserProfile } from "../../models/user";
import { deleteFromAuth, logOut } from "../../services/auth";
import getLoggedinUser, { deleteUserFromStore } from "../../services/userData";




export default function UserView() {


    const [user, setUser] = useState<UserProfile>();

    const nav = useNavigate();



    useEffect(() => {
        onAuthStateChanged(auth,  (currentUser) => {
            getLoggedinUser().then((user:any) => {
                if(user) setUser(user)
            })
           
            if (!currentUser) {
                console.log(auth.currentUser);
                nav("/");
            }
        });
    }, [auth.currentUser]);


    const logout = async () => {
        logOut();
        console.log("User signed out");
        nav("/");

    };

    const deleteUser = async () => {
        if(user) {

            deleteUserFromStore(user.email as string);
            deleteFromAuth(user.email as string);
        }
    }


    //TODO: flytt dette til userData.tsx
    const [image, setImage] = useState<Blob | Uint8Array | ArrayBuffer | undefined>();
    const [url, setUrl] = useState<string>("");
    const imageName = "/profile/" + auth.currentUser?.email + "ProfileImage";

    useEffect(() => {
        const getPicture = async () => {
            const imageRef = ref(storage, imageName);
            getDownloadURL(imageRef).then((url) => {
                setUrl(url);
            });
        }
        getPicture();
    })


    const handleImageChange = (e: any) => {
        if (e.target.files[0]) {
          setImage(e.target.files[0]);
        }
      };
    
      const handleSubmit = () => {
        const imageRef = ref(storage, imageName);
if(image) {
        uploadBytes(imageRef, image)
          .then(() => {
            getDownloadURL(imageRef)
              .then((url) => {
                setUrl(url);
              })
              .catch((error) => {
                console.log(error.message, "error getting the image url");
              });
            setImage(undefined);
          })
          .catch((error) => {
            console.log(error.message);
          });
          console.log(url);
console.log(setUrl);
      };
    }



    return (
        <>
            <div className="user">
                <div className="top-part">
                    <h1 className="username">{user? user.email: ""}</h1>
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
