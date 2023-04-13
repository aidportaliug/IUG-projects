import React from "react";
import "../styles/uploadProject.css";
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  TextFieldProps,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { SetStateAction, useState } from "react";
import createProject from "../services/createProject";
import { allowedLocations, allowedStudyFields } from "../models/allowedValues";
import { useNavigate } from "react-router-dom";
const UploadExperienceReport = () => {
  const [value, setValue] = useState<string | null>(Date());
  const [studyField, setStudyField] = useState("study_field");
  const [location, setLocation] = useState("location");
  const navigate = useNavigate();

  const handleStudyFieldChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setStudyField(event.target.value);
  };
  const handleLocationChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setLocation(event.target.value);
  };
  const handleUpload = async (event: {
    preventDefault: () => void;
    currentTarget: HTMLFormElement | undefined;
  }) => {
    event.preventDefault();
    const form = event.currentTarget;
    const inputs = form?.elements as unknown as {
      [key: string]: HTMLInputElement & { required: boolean };
    };
    const emptyFields = Object.values(inputs).filter((input) => {
      return input.required && !input.value;
    });

    if (emptyFields.length > 0) {
      const fieldNames = emptyFields
        .slice(0, emptyFields.length / 2)
        .map((element) => `"${element.name}"`);
      console.log("navn", fieldNames);
      alert(
        `Please fill in the following required fields: ${fieldNames.join(", ")}`
      );
      return;
    }
    const data = new FormData(event.currentTarget);
    const duration = parseInt(data.get("duration") as string);
    if (Number.isNaN(duration)) {
      alert(`Duration must be a number`);
      return;
    }
    const location = data.get("location") as string;
    const studyField = data.get("studyField") as string;
    if (!allowedLocations.includes(location)) {
      alert("You must choose a location from the list.");
      return;
    }
    if (!allowedStudyFields.includes(studyField)) {
      alert("You must choose a studyfield drom the list.");
      return;
    }

    try {
      const shortTitle = data.get("shortTitle") as string;
      const projectTitle = data.get("projectTitle") as string;

      const dateStr = data.get("date") as string;
      const dateParts = dateStr.split("/");
      const year = parseInt(dateParts[2], 10);
      const month = parseInt(dateParts[1], 10) - 1; // January is 0, so subtract 1
      const day = parseInt(dateParts[0], 10);

      const deadline = new Date(year, month, day);
      const description = data.get("description") as string;
      const summaryDescription = data.get("summaryDescription") as string;

      createProject(
        projectTitle,
        shortTitle,
        studyField,
        location,
        deadline,
        description,
        duration,
        summaryDescription
      );
      console.log("Successfull upload");
    } catch (error) {
      console.log(error as string);
      return;
    }
    navigate("/");
  };
  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleUpload}
      sx={{ margin: "0 auto", maxWidth: "60%" }}
    >
      <Box display={"flex"} sx={{ marginBottom: "1em", marginTop: "1em" }}>
        <TextField
          fullWidth
          id="shortTitle"
          label="Project short title"
          name="shortTitle"
          sx={{ marginRight: "1em" }}
        />
        <Select
          labelId="studyField"
          id="studyField"
          label="Study field"
          value={studyField}
          name="studyField"
          onChange={handleStudyFieldChange}
          sx={{ width: "100%", marginLeft: "1em" }}
        >
          <MenuItem value="study_field">Study field</MenuItem>
          <MenuItem value="it">IT</MenuItem>
          <MenuItem value="construction_and_infrastructure">
            Construction and infrastructure
          </MenuItem>
          <MenuItem value="geotechnics">Geotechnics</MenuItem>
          <MenuItem value="machine_and_process_engineering">
            Machine and process engineering
          </MenuItem>
          <MenuItem value="clean_energy">Clean Energy</MenuItem>
          <MenuItem value="water_and_sanitation">Water and sanitation</MenuItem>
        </Select>
      </Box>
      <Box display={"flex"} sx={{ marginBottom: "1em" }}>
        <Select
          id="location"
          label="Location"
          value={location}
          name="location"
          onChange={handleLocationChange}
          sx={{ width: "100%", marginRight: "1em" }}
        >
          <MenuItem value="location">Location</MenuItem>
          <MenuItem value="europe">Europe</MenuItem>
          <MenuItem value="asia">Asia</MenuItem>
          <MenuItem value="africa">Africa</MenuItem>
          <MenuItem value="south_america">South America</MenuItem>
          <MenuItem value="north_america">North America</MenuItem>
        </Select>
        <TextField
          required
          fullWidth
          id="year"
          label="Year"
          name="year"
          sx={{ marginLeft: "1em" }}
        />
      </Box>
      <TextField
        required
        fullWidth
        id="projectTitle"
        label="Project Title"
        name="projectTitle"
        sx={{ marginBottom: "1em" }}
      />
      <TextField
        required
        fullWidth
        id="description"
        label="Description"
        name="description"
        sx={{ marginBottom: "1em" }}
      />
      <TextField
        fullWidth
        id="summaryDescription"
        label="Summary description"
        name="summaryDescription"
        sx={{ marginBottom: "1em" }}
      />

      <Box display={"flex"} sx={{ marginBottom: "1em" }}>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ marginLeft: "1em" }}
        >
          Upload
        </Button>
      </Box>
    </Box>
  );
};

export default UploadExperienceReport;
