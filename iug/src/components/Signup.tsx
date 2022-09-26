import { Container, CssBaseline, Box, Typography, Grid, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "../services/firebaseConfig";
import signUp from "../services/signup";



function SignUpComponent() {

  const nav = useNavigate();


  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log(auth.currentUser);
        console.log("success!!!");
        nav("/User");
      }
      console.log("not current user");
    });
  }, [nav]);

  const handleSignUp = async (event: { preventDefault: () => void; currentTarget: HTMLFormElement | undefined; }) => {
    event.preventDefault();
    try {
      const data = new FormData(event.currentTarget);
      const firstName = data.get("firstName") as string;
      const lastName = data.get("lastName") as string;
      const gender = data.get("gender") as string;
      const age = data.get("age") as string;
      const email = data.get("email") as string;
      const password = data.get("password") as string;

      if (firstName && lastName && gender && age && email && password) signUp(firstName, lastName, email, password, gender, age,)

    } catch (error) {
      console.log(error as string);
    }
  };





  return (
    <>


      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSignUp} sx={{ mt: 3 }}>
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

              <Grid item xs={12}>
                <FormControl >
                  <FormLabel >Gender</FormLabel>
                  <RadioGroup name="gender" row>
                    <FormControlLabel value="Male" control={<Radio />} label="Male" />
                    <FormControlLabel value="Female" control={<Radio />} label="Female" />
                    <FormControlLabel value="Other" control={<Radio />} label="Other" />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="age"
                  label="Age"
                  id="age"
                  autoComplete='age'
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
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
              style={{ backgroundColor: '#3D7844', color: '#FFFFFF' }}

            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <NavLink to="/">
                  Already have an account? Sign in
                </NavLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>

    </>
  );
}

export default SignUpComponent;