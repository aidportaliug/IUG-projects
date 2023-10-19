import React, { FC, ReactElement } from "react";
import { Box, Container, Grid, Typography } from "@mui/material";
import NavLogo from "./Navbar/Navlogo";

export const Footer: FC = (): ReactElement => {
  return (
    <Box
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
      </Container>
      <Container>
        <h4>
          hello world2
        </h4>
      </Container>
      <Container>
        <h4>
          hello world3
        </h4>
      </Container>
    </Box>
  );
};

export default Footer;
