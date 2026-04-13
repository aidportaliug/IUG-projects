import React, { SetStateAction, useState, useRef, useEffect } from 'react';
import './uploadPlasticProjectForm.css';
import { Box, Button, MenuItem, Select, SelectChangeEvent, TextField, TextFieldProps } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { createPlasticProject, getPlastics, PlasticResponse } from '../../services/plasticService';
import { countries } from '../../models/allowedValues';
import { useNavigate } from 'react-router-dom';

const UploadPlasticProjectForm: React.FC = () => {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [country, setCountry] = useState('country');
  const [selectedPlastics, setSelectedPlastics] = useState<number[]>([]);
  const [plastics, setPlastics] = useState<PlasticResponse[]>([]);
  const [financing, setFinancing] = useState('');
  const [businessModel, setBusinessModel] = useState('');
  const [wasteCollected, setWasteCollected] = useState<number>(0);
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Fetch plastics on component mount
  useEffect(() => {
    const fetchPlastics = async () => {
      try {
        const response = await getPlastics();
        setPlastics(response.plastics);
      } catch (error) {
        console.error('Failed to fetch plastics:', error);
      }
    };
    fetchPlastics();
  }, []);

  // Helper function to format country names
  const formatCountryName = (countryName: string): string => {
    return countryName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      .replace(/\bAnd\b/g, '&');
  };

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

  const handleCountryChange = (event: { target: { value: SetStateAction<string> } }) => {
    setCountry(event.target.value);
  };

  const handlePlasticsChange = (event: SelectChangeEvent<typeof selectedPlastics>) => {
    const value = event.target.value;
    const values = Array.isArray(value) ? value : [value];
    setSelectedPlastics(values.map((id) => (typeof id === 'string' ? Number(id) : id)));
  };

  const handleFinancingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFinancing(event.target.value);
  };

  const handleBusinessModelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBusinessModel(event.target.value);
  };

  const handleWasteCollectedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    setWasteCollected(isNaN(value) ? 0 : value);
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
      alert(`Please fill in the following required fields: ${fieldNames.join(', ')}`);
      return;
    }

    const data = new FormData(event.currentTarget);

    // Validate required fields
    const name = data.get('projectTitle') as string;
    const product = data.get('product') as string;
    const summary = data.get('summary') as string;

    if (!name || !product || !country || country === 'country') {
      alert('Please fill in all required fields');
      return;
    }

    if (!countries.includes(country)) {
      alert('You must choose a country from the list.');
      return;
    }

    if (wasteCollected < 0) {
      alert('Waste collected must be a positive number');
      return;
    }

    try {
      // Format dates
      let startDateISO: string | undefined;
      let endDateISO: string | undefined;

      if (startDate) {
        const startDateObj = new Date(startDate);
        startDateISO = startDateObj.toISOString().split('T')[0];
      }

      if (endDate) {
        const endDateObj = new Date(endDate);
        endDateISO = endDateObj.toISOString().split('T')[0];
      }

      await createPlasticProject({
        name: name,
        startDate: startDateISO || new Date().toISOString().split('T')[0],
        endDate: endDateISO,
        country: country,
        product: product,
        financing: financing,
        businessModel: businessModel,
        wasteCollected: wasteCollected,
        summary: summary || undefined,
        plasticIds: selectedPlastics.length > 0 ? selectedPlastics : undefined,
      });

      alert('Successfully uploaded plastic project');
      navigate('/plasticProjects');
    } catch (error: any) {
      console.error('Upload error:', error);
      alert(error.message || 'Failed to upload plastic project');
    }
  };

  return (
    <Box component="form" noValidate onSubmit={handleUpload} sx={{ margin: '0 auto', width: 500 }}>
      <TextField
        required
        fullWidth
        id="projectTitle"
        label="Project Name"
        name="projectTitle"
        sx={{
          marginBottom: '1em',
          backgroundColor: '#e0e0e0',
          '&:focus-within': {
            backgroundColor: 'white',
          },
        }}
      />

      <TextField
        required
        fullWidth
        id="product"
        label="Product"
        name="product"
        sx={{
          marginBottom: '1em',
          backgroundColor: '#e0e0e0',
          '&:focus-within': {
            backgroundColor: 'white',
          },
        }}
      />

      <Box display={'flex'} sx={{ marginBottom: '1em' }}>
        <Select
          id="country"
          label="Country"
          value={country}
          name="country"
          onChange={handleCountryChange}
          sx={{
            width: '100%',
            marginRight: '1em',
            '& .MuiSelect-select': {
              backgroundColor: '#e0e0e0',
            },
            '&.Mui-focused .MuiSelect-select': {
              backgroundColor: 'white',
            },
            '& fieldset': {
              legend: { display: 'none' },
            },
          }}
        >
          <MenuItem value='country'>Select Country</MenuItem>
          {countries.map((c) => (
            <MenuItem key={c} value={c}>
              {formatCountryName(c)}
            </MenuItem>
          ))}
        </Select>

        <TextField
          type="number"
          fullWidth
          id="wasteCollected"
          label="Waste Collected (tons)"
          name="wasteCollected"
          value={wasteCollected}
          onChange={handleWasteCollectedChange}
          sx={{
            backgroundColor: '#e0e0e0',
            '&:focus-within': {
              backgroundColor: 'white',
            },
          }}
        />
      </Box>

      <Select
        multiple
        displayEmpty
        id="plastics"
        value={selectedPlastics}
        onChange={handlePlasticsChange}
        renderValue={(selected) => {
          if (selected.length === 0) {
            return <span style={{ color: '#666' }}>Select plastics...</span>;
          }
          return selected.map(id => plastics.find(p => p.id === id)?.name).join(', ');
        }}
        sx={{
          width: '100%',
          marginBottom: '1em',
          '& .MuiSelect-select': {
            backgroundColor: '#e0e0e0',
            padding: '16px',
            minHeight: '1.4375em',
          },
          '&.Mui-focused .MuiSelect-select': {
            backgroundColor: 'white',
          },
          '& fieldset': {
            legend: { display: 'none' },
          },
        }}
      >
        <MenuItem disabled>
          <em>Select plastics used in this project</em>
        </MenuItem>
        {plastics.map((plastic) => (
          <MenuItem key={plastic.id} value={plastic.id}>
            {plastic.name}
          </MenuItem>
        ))}
      </Select>

      <Box display={'flex'} sx={{ marginBottom: '1em' }}>
        <TextField
          fullWidth
          id="financing"
          label="Financing"
          name="financing"
          value={financing}
          onChange={handleFinancingChange}
          sx={{
            marginRight: '1em',
            backgroundColor: '#e0e0e0',
            '&:focus-within': {
              backgroundColor: 'white',
            },
          }}
        />

        <TextField
          fullWidth
          id="businessModel"
          label="Business Model"
          name="businessModel"
          value={businessModel}
          onChange={handleBusinessModelChange}
          sx={{
            backgroundColor: '#e0e0e0',
            '&:focus-within': {
              backgroundColor: 'white',
            },
          }}
        />
      </Box>

      <Box display={'flex'} sx={{ marginBottom: '1em' }}>
        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={(newValue) => setStartDate(newValue)}
          renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
            <TextField
              {...params}
              sx={{
                width: '100%',
                marginRight: '1em',
                backgroundColor: '#e0e0e0',
                '&:focus-within': {
                  backgroundColor: 'white',
                },
              }}
            />
          )}
        />

        <DatePicker
          label="End Date (Optional)"
          value={endDate}
          onChange={(newValue) => setEndDate(newValue)}
          renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
            <TextField
              {...params}
              sx={{
                width: '100%',
                backgroundColor: '#e0e0e0',
                '&:focus-within': {
                  backgroundColor: 'white',
                },
              }}
            />
          )}
        />
      </Box>

      <TextField
        fullWidth
        id="summary"
        label="Summary"
        name="summary"
        multiline
        minRows={4}
        sx={{
          marginBottom: '1em',
          backgroundColor: '#e0e0e0',
          '&:focus-within': {
            backgroundColor: 'white',
          },
        }}
      />

      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <Button
        size="large"
        variant="outlined"
        onClick={handleButtonClick}
        style={{
          width: '100%',
          color: 'black',
          textTransform: 'none',
          border: '1px solid grey',
          marginBottom: '1em',
          backgroundColor: '#e0e0e0',
        }}
      >
        Upload Picture (Optional)
      </Button>

      {imageUrl && (
        <div style={{ marginBottom: '1em' }}>
          <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: 200 }} />
        </div>
      )}

      <Button type="submit" variant="contained" style={{ width: 200, height: 50, margin: '1em' }}>
        Upload Plastic Project
      </Button>
    </Box>
  );
};

export default UploadPlasticProjectForm;
