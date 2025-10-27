import React, { useState, useEffect } from 'react';
import { Avatar, Button } from '@mui/material';
import { Navigate, useNavigate } from 'react-router-dom';
import { CustomUser } from '../../models/user';
import { logOut, deleteFromAuth } from '../../services/auth';
import { useFirebaseAuth } from '../../services/AuthContext';
import { useGetUser } from '../../services/useGetUser';
import { deleteUserFromStore, getPicture, uploadImage } from '../../services/userData';

import FileUpload from '../DragDrop/DragDrop';

const UserProfileComponent: React.FC = () => {
  const { user } = useFirebaseAuth();
  const [customUser, setCustomUser] = useState<CustomUser | null>(null);
  const [image, setImage] = useState<Blob | Uint8Array | ArrayBuffer | undefined>();
  const [url, setUrl] = useState<string>('');
  const [userUpdated, setUserUpdated] = useState<boolean>(false);
  const imageName = '/profile/' + user?.email + 'ProfileImage';
  const navigate = useNavigate();

  const logout = async () => {
    await logOut();
    console.log('User signed out');
    navigate('/');
  };

  const deleteUser = async () => {
    if (user) {
      await deleteUserFromStore(user.email as string);
      await deleteFromAuth(user.email as string);
      navigate('/');
    }
  };

  const CallGetUser = async (userId: string) => {
    return await useGetUser(userId);
  };

  useEffect(() => {
    if (imageName) {
      getPicture(imageName).then((url) => {
        if (url) setUrl(url);
      });
    }
    if (user && !userUpdated) {
      CallGetUser(user.uid).then((response) => setCustomUser(response));
      setUserUpdated(true);
    }
  }, [imageName, user, userUpdated]);

  const handleSubmit = () => {
    if (image) {
      uploadImage(image as File, imageName).then((url) => {
        setUrl(url);
      });
    }
  };

  if (user) {
    return (
      <div className="user">
        <div className="top-part">
          <h1 className="username">{user.email}</h1>
        </div>
        <div className="profileIcon">
          <Avatar src={url} sx={{ width: 150, height: 150 }} />
          <FileUpload handleSubmit={handleSubmit} setImage={setImage} />
        </div>
        <div className="interests">
          <h3>My information:</h3>
          <div className="myInterests">
            <p>Email: {customUser?.email}</p>
            <p>First Name: {customUser?.firstName}</p>
            <p>Last Name: {customUser?.lastName}</p>
            <p>Phone Number: {customUser?.phoneNumber}</p>
            <p>University: {customUser?.university}</p>
            <p>Institute: {customUser?.institute}</p>
          </div>
          <Button variant="contained" id="btnLogOut" onClick={() => navigate('/editProfile')}>
            Edit
          </Button>
        </div>
        <Button variant="contained" id="btnLogOut" onClick={logout}>
          Log out
        </Button>
        <Button variant="contained" id="btnDeleteUser" onClick={deleteUser}>
          Delete User
        </Button>
      </div>
    );
  } else {
    return <Navigate to="/" />;
  }
};

export default UserProfileComponent;
