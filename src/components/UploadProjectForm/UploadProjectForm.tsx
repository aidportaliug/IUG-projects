import React, { SetStateAction, useState, useRef } from 'react';
import './uploadProjectForm.css';
import { Box, Button, MenuItem, Select, TextField, TextFieldProps } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import createProject from '../../services/createProject';
import { allowedLocations, allowedStudyFields } from '../../models/allowedValues';
import { useNavigate } from 'react-router-dom';

const UploadProjectForm: React.FC = () => {
  const [value, setValue] = useState<string | null>(Date());
  const [studyField, setStudyField] = useState('study_field');
  const [location, setLocation] = useState('location');
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  const handleStudyFieldChange = (event: { target: { value: SetStateAction<string> } }) => {
    setStudyField(event.target.value);
  };
  const handleLocationChange = (event: { target: { value: SetStateAction<string> } }) => {
    setLocation(event.target.value);
  };
  const handleUpload = async (event: { preventDefault: () => void; currentTarget: HTMLFormElement | undefined }) => {
    event.preventDefault();
    const form = event.currentTarget;
    const inputs = form?.elements as unknown as {
      [key: string]: HTMLInputElement & { required: boolean };
    };
    const emptyFields = Object.values(inputs).filter((input) => {
      return input.required && !input.value;
    });

    if (emptyFields.length > 0) {
      const fieldNames = emptyFields.slice(0, emptyFields.length / 2).map((element) => `"${element.name}"`);
      console.log('navn', fieldNames);
      alert(`Please fill in the following required fields: ${fieldNames.join(', ')}`);
      return;
    }
    const data = new FormData(event.currentTarget);
    const duration = parseInt(data.get('duration') as string);
    if (Number.isNaN(duration)) {
      alert(`Duration must be a number`);
      return;
    }
    const location = data.get('location') as string;
    const studyField = data.get('studyField') as string;
    if (!allowedLocations.includes(location)) {
      alert('You must choose a location from the list.');
      return;
    }
    if (!allowedStudyFields.includes(studyField)) {
      alert('You must choose a studyfield drom the list.');
      return;
    }

    try {
      const shortTitle = data.get('shortTitle') as string;
      const projectTitle = data.get('projectTitle') as string;

      const dateStr = data.get('date') as string;
      const dateParts = dateStr.split('/');
      const year = parseInt(dateParts[2], 10);
      const month = parseInt(dateParts[1], 10) - 1; // January is 0, so subtract 1
      const day = parseInt(dateParts[0], 10);

      const deadline = new Date(year, month, day);
      const description = data.get('description') as string;
      const summaryDescription = data.get('summaryDescription') as string;

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
      console.log('Successfull upload');
    } catch (error) {
      console.log(error as string);
      return;
    }
    navigate('/');
  };

  return (
    <Box component="form" noValidate onSubmit={handleUpload} sx={{ margin: '0 auto', width: 500 }}>
      <Box display={'flex'} sx={{ marginBottom: '1em', marginTop: '1em' }}>
        <TextField
          fullWidth
          id="shortTitle"
          label="Project short title"
          name="shortTitle"
          sx={{ marginRight: '1em', backgroundColor: '#e0e0e0',
          '&:focus-within': {
            backgroundColor: 'white',
          }}}
        />
        <Select
          labelId="studyField"
          id="studyField"
          label="Study field"
          value={studyField}
          name="studyField"
          onChange={handleStudyFieldChange}
          sx={{ width: '100%', marginLeft: '1em', backgroundColor: '#e0e0e0',
          '&:focus-within': {
            backgroundColor: 'white',
          }}}
        >
          <MenuItem value="study_field">Study field</MenuItem>
          <MenuItem value="it">IT</MenuItem>
          <MenuItem value="construction_and_infrastructure">Construction and infrastructure</MenuItem>
          <MenuItem value="geotechnics">Geotechnics</MenuItem>
          <MenuItem value="machine_and_process_engineering">Machine and process engineering</MenuItem>
          <MenuItem value="clean_energy">Clean Energy</MenuItem>
          <MenuItem value="water_and_sanitation">Water and sanitation</MenuItem>
        </Select>
      </Box>
      <TextField
        required
        fullWidth
        id="projectTitle"
        label="Project Title"
        name="projectTitle"
        sx={{ marginBottom: '1em', backgroundColor: '#e0e0e0',
          '&:focus-within': {
            backgroundColor: 'white',
        }}}
      />
      <Box display={'flex'} sx={{ marginBottom: '1em' }}>
        <Select
          id="location"
          label="Location"
          value={location}
          name="location"
          onChange={handleLocationChange}
          sx={{ width: '100%', marginRight: '1em', backgroundColor: '#e0e0e0',
          '&:focus-within': {
            backgroundColor: 'white',
          }}}
        >
          <MenuItem value="location">Location</MenuItem>
          <MenuItem value="europe">Europe</MenuItem>
          <MenuItem value="asia">Asia</MenuItem>
          <MenuItem value="africa">Africa</MenuItem>
          <MenuItem value="south_america">South America</MenuItem>
          <MenuItem value="north_america">North America</MenuItem>
        </Select>
        <TextField required fullWidth id="duration" label="Duration" name="duration" sx={{ marginLeft: '1em', backgroundColor: '#e0e0e0',
          '&:focus-within': {
            backgroundColor: 'white',
          }}} />
      </Box>
      
      <TextField
        required
        fullWidth
        id="description"
        label="Description"
        name="description"
        multiline
        minRows={6}
        sx={{ marginBottom: '1em', backgroundColor: '#e0e0e0',
        '&:focus-within': {
          backgroundColor: 'white',
        }}}
      />
      <TextField
        fullWidth
        id="summaryDescription"
        label="Summary description"
        name="summaryDescription"
        multiline
        minRows={4}
        sx={{ marginBottom: '1em', backgroundColor: '#e0e0e0',
        '&:focus-within': {
          backgroundColor: 'white',
        }}}
      />

      <div>Application deadline</div>
      <Box display={'flex'} sx={{ marginBottom: '1em',  }}>
        <DatePicker
          disablePast
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
            <TextField id="date" name="date" InputLabelProps={{ shrink: false }} {...params} 
              sx={{ width: '100%',  marginRight: '1em', backgroundColor: '#e0e0e0',
              '&:focus-within': {
                backgroundColor: 'white',
              }}}/>
          )}
          inputFormat="DD/MM/YYYY"
        ></DatePicker>
        
        <input
        type='file'
        accept='image/*'
        style={{ display: 'none'}}
        ref={fileInputRef}
        onChange={handleFileChange}/>
        <Button 
          size="large"
          variant="contained"
          onClick={handleButtonClick} 
          style={{ width: '300px', color: 'black', textTransform: "none", border: '1px solid grey',
            marginLeft: '1em', backgroundColor: '#e0e0e0'}}
          onFocus={e => e.target.style.backgroundColor = 'white'}
          onBlur={e => e.target.style.backgroundColor = '#e0e0e0'}>
          Upload Picture
        </Button>
        
{/*        {imageUrl && (
          <div style={{ marginTop: '1em' }}>
            <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: 300 }} />
          </div>
        )}
*/}

      </Box>
      <Button type="submit" variant='contained' style={{ width: 200, height: 50, margin: '1em' }}>
          Upload Form
      </Button>
    </Box>
  );
};

export default UploadProjectForm;
