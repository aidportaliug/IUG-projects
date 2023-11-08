import React, { FC, ReactElement } from "react";
import { Box, Container, Grid, Typography } from "@mui/material";
import NavLogo from "./Navbar/Navlogo";
import "./../styles/Footer.css";
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { IconButton } from '@mui/material';

export const Footer: FC = (): ReactElement => {
  return (
    <Box className = "Footer"
      sx={{
        width: "100%",
        height: "148px",
        backgroundColor: "#dfe9de",
        paddingTop: "1rem",
        paddingBottom: "1rem",
      }}
    >
      <Container maxWidth="lg">
      <NavLogo /> {/* This is the EWB logo */}
      </Container>
      <Container>
        <h4>
          hello world1  
        </h4> 
        <a href="https://www.wikipedia.org">
          Link1 
        </a>
        <div>
        <a href="https://www.wikipedia.org">
          Link2
        </a> </div>
      </Container>

      <Container>
        <h4>
          hello world2
        </h4> 
        <div>
          <a href="https://www.wikipedia.org">
          Link3
        </a> </div>
        <div> 
        <a href="https://www.wikipedia.org">
          Link4
        </a> </div>
      </Container>
      
      <Container/>

      <Container> 
        <IconButton href = "https://www.facebook.com/iugntnu/?locale=nb_NO" style={{ color: '#3D7844' }}>
          <FacebookIcon fontSize="large"/>
        </IconButton>
        <IconButton href = "https://www.instagram.com/iugntnu/" style={{ color: '#3D7844' }}>
        <InstagramIcon fontSize="large"/>
        </IconButton>
        <IconButton href = "https://no.linkedin.com/company/ingeni%C3%B8rerutengrenserntnu">
        <LinkedInIcon fontSize="large" style={{ color: '#3D7844' }}/>
        </IconButton>
      </Container>
    </Box>
  );
};

export default Footer;
