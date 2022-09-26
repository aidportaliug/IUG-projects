import { Avatar, Button } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserProfile } from "../models/user";
import { logOut, deleteFromAuth } from "../services/auth";
import { auth } from "../services/firebaseConfig";
import getLoggedinUser, { deleteUserFromStore, getPicture, uploadImage } from "../services/userData";


function UserProfileComponent( ) {



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
    }, [nav]);
    // }, [auth.currentUser, nav]);


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


    
    
    const [image, setImage] = useState<Blob | Uint8Array | ArrayBuffer | undefined>();
    const [url, setUrl] = useState<string>("");
    const imageName = "/profile/" + auth.currentUser?.email + "ProfileImage";
    
    useEffect(() => {
        
        getPicture(imageName).then((url) => {setUrl(url)})
    })
    
    
    const handleImageChange = (e: any) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };
    
    const handleSubmit = () => {
        
        uploadImage(image as File, imageName).then((url) => {setUrl(url)})
        
    };
    
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
            )
    }

    export default UserProfileComponent;