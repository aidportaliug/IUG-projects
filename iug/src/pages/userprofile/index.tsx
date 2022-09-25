import { useState, useEffect } from "react";
import "./user.css";
import Button from "@mui/material/Button";
import { auth } from "../../services/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Avatar from '@mui/material/Avatar'
import { UserProfile } from "../../models/user";
import { deleteFromAuth, logOut } from "../../services/auth";
import getLoggedinUser, { deleteUserFromStore, getPicture, uploadImage } from "../../services/userData";
import UserProfileComponent from "../../components/UserProfile";



export default function UserView() {





    return (
        <>
        <UserProfileComponent/>
        </>
            
    );
};
