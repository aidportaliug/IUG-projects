import React from 'react';

import './profile.css';
import Button from '@mui/material/Button';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Avatar } from '@mui/material';
import { Link } from 'react-router-dom';


const Profile = () => {
    return (
<div className='profile'>
<h1 className="profilename"> NAME HERE</h1>
<Avatar variant='circular'
sx={{ width: 54, height: 54 }}
>H</Avatar>


<AccountCircleIcon 
sx={{ width: 86, height: 86 }}> 
</AccountCircleIcon>

<Button variant="contained">Log out</Button>
<Link to="./login"></Link>

</div>
)};

export default Profile;