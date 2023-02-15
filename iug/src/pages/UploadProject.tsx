import "../styles/uploadProject.css"
import { Box, Button, TextField, TextFieldProps } from "@mui/material";
import { DatePicker} from "@mui/x-date-pickers";
import { useState } from "react";
import createProject from "../services/createProject";

// const CssTextField = styled(TextField)({
//     '& label.Mui-focused': {
//       color: '#727171',
//       background: "#E3E3E3",
//     },
//     '& .MuiInput-underline:after': {
//       borderBottomColor: '#727171',
//     },
//     '& .MuiOutlinedInput-root': {
//       '& fieldset': {
//         border: "none",
//         borderRadius: "15px",
//         background: "#E3E3E3",
//         zIndex: "-1",
//         height: "3em",
//         width: "100%",
//       },
//       '&:hover fieldset': {
//         borderColor: '#727171',
//       },
//       '&.Mui-focused fieldset': {
//         borderColor: '#727171',
//       },
//     },
//   });


const UploadProject = () => {
    const [value, setValue]= useState(Date())
    const handleUpload = async (event: { preventDefault: () => void; currentTarget: HTMLFormElement | undefined; }) => {
      event.preventDefault();
      try {
        const data = new FormData(event.currentTarget);
        const shortTitle = data.get("shortTitle") as string;
        const studyField= data.get("studyField") as string;
        const projectTitle = data.get("projectTitle") as string;
        const location = data.get("location") as string;
        const dateStr = data.get("date") as string;
        const dateParts = dateStr.split("/");
        const year = parseInt(dateParts[2], 10);
        const month = parseInt(dateParts[1], 10) - 1; // January is 0, so subtract 1
        const day = parseInt(dateParts[0], 10);
        const deadline = new Date(year, month, day);
        const description = data.get("description") as string;
        const summaryDescription = data.get("summaryDescription") as string;
        const duration = parseInt(data.get("duartion") as string);

        createProject(projectTitle,shortTitle, studyField, location, deadline, description,duration, summaryDescription)
      } catch (error) {
        console.log(error as string);
      }
    };
    return(
        <div className="outline">
            <div className="title"> Upload Project </div>
            <Box component="form" noValidate onSubmit={handleUpload} sx={{ mt: 3 }}>
              <TextField
                required
                fullWidth
                id="shortTitle"
                label="Project short title"
                name="shortTitle"/>
              <TextField
                required
                fullWidth
                id="studyField"
                label="Study field"
                name="studyField"/>
              <TextField
                required
                fullWidth
                id="projectTitle"
                label="Project Title"
                name="projectTitle"/>
              <TextField
                required
                fullWidth
                id="location"
                label="Location"
                name="location"/>
              <DatePicker
                    disablePast
                    value={value}
                    onChange={(newValue: any) => {
                        setValue(newValue);
                    }}
                    renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => <TextField id="date" name="date" InputLabelProps={{shrink: false}} {...params} />}
                    inputFormat="DD/MM/YYYY"></DatePicker>
               <TextField
                required
                fullWidth
                id="description"
                label="Description"
                name="description"/>
              <TextField
                required
                fullWidth
                id="summaryDescription"
                label="Summary description"
                name="summaryDescription"/>
               <TextField
                required
                fullWidth
                id="duartion"
                label="Duration"
                name="duartion"/>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              style={{ backgroundColor: '#3D7844', color: '#FFFFFF' }}

            >
              Sign Up
            </Button>
            </Box>

          
        </div>

    )
}

export default UploadProject

