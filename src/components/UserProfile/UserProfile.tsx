import { Avatar, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { CustomUser } from '../../models/user';
import { logOut, deleteFromAuth } from '../../services/auth';
import { useFirebaseAuth } from '../../services/AuthContext';
import { useGetUser } from '../../services/useGetUser';
import { deleteUserFromStore, getPicture, uploadImage } from '../../services/userData';

import FileUpload from '../DragDrop/DragDrop';

function UserProfileComponent() {
  const { user } = useFirebaseAuth();
  const [customUser, setCustomUser] = useState<CustomUser | null>(null);
  const [image, setImage] = useState<Blob | Uint8Array | ArrayBuffer | undefined>();
  const [url, setUrl] = useState<string>('');
  const [userUpdatet, setUserUpdatet] = useState<boolean>(false);
  const imageName = '/profile/' + user?.email + 'ProfileImage';
  const nav = useNavigate();

  const logout = async () => {
    logOut();
    console.log('User signed out');
    nav('/');
  };

  const deleteUser = async () => {
    if (user) {
      deleteUserFromStore(user.email as string);
      deleteFromAuth(user.email as string);
    }
  };

  async function CallGetUser(userId: string) {
    return await useGetUser(userId);
  }

  useEffect(() => {
    if (imageName !== '') {
      getPicture(imageName).then((url) => {
        url && setUrl(url);
      });
    }
    if (user !== null && !userUpdatet) {
      CallGetUser(user.uid).then((response) => setCustomUser(response));
      setUserUpdatet(true);
    }
  }, [customUser, imageName, user, userUpdatet]);

  const handleSubmit = () => {
    uploadImage(image as File, imageName).then((url) => {
      setUrl(url);
    });
  };
  if (user != null) {
    return (
      <>
        <div className="user">
          <div className="top-part">
            <h1 className="username">{user ? user.email : ''}</h1>
          </div>
          <div className="profileIcon">
            <Avatar src={url} sx={{ width: 150, height: 150 }} />
            <FileUpload handleSubmit={handleSubmit} setImage={setImage} />
          </div>
          <div className="interests">
            <h3>My information:</h3>
            <div className="myInterests">
              <p>Mail: {customUser?.email}</p>
              <p>First name: {customUser?.firstName}</p>
              <p>Last name: {customUser?.lastName}</p>
              <p>Phone number: {customUser?.phoneNumber}</p>
              <p>University: {customUser?.university}</p>
              <p>Institute: {customUser?.institute} </p>
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
  } else {
    return <Navigate to="/" />;
  }
}
export default UserProfileComponent;
