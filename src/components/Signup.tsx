import {
  Container,
  Box,
  Typography,
  Grid,
  TextField,
  FormControl,
  Button,
} from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebaseConfig";
import signUp from "../services/signup";
import React from "react";

function SignUpComponent() {
  const nav = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log("success!!!");
        nav("/User");
      }
      console.log("not current user");
    });
  }, [nav]);

  const handleSignUp = async (event: {
    preventDefault: () => void;
    currentTarget: HTMLFormElement | undefined;
  }) => {
    event.preventDefault();
    try {
      const data = new FormData(event.currentTarget);
      const firstName = data.get("firstName") as string;
      const lastName = data.get("lastName") as string;
      const email = data.get("email") as string;
      const phoneNumer = data.get("phoneNumber") as string;
      const institute = data.get("institute") as string;
      const university = data.get("university") as string;
      const password = data.get("password") as string;
      if (firstName && lastName && email && password)
        signUp(
          firstName,
          lastName,
          email,
          Number(phoneNumer),
          institute,
          university,
          password
        );
    } catch (error) {
      console.log(error as string);
    }
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography className="loginHeader" component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSignUp}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl>
                  <TextField
                    fullWidth
                    id="phoneNumber"
                    label="Phone number"
                    name="phoneNumber"
                    autoComplete="Phone number"
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="institute"
                  label="Institute"
                  id="institute"
                  autoComplete="Institute"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="university"
                  label="University"
                  id="university"
                  autoComplete="University"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              style={{ backgroundColor: "#3D7844", color: "#FFFFFF" }}
            >
              Sign Up
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default SignUpComponent;
