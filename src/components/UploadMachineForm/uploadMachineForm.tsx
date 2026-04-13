import React, { useState, useRef, useEffect } from 'react';
import { Button, Box, TextField, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { getPlastics, PlasticResponse } from '../../services/plasticService';
import { createMachine } from '../../services/machineService';
import { useNavigate } from 'react-router-dom';

const UploadMachineForm: React.FC = () => {
    const [machineName, setMachineName] = useState('');
    const [whatItDoes, setWhatItDoes] = useState('');
    const [howItWorksAndAcquired, setHowItWorksAndAcquired] = useState('');
    const [operationComplicationsAndLessons, setOperationComplicationsAndLessons] = useState('');
    const [selectedPlastics, setSelectedPlastics] = useState<number[]>([]);
    const [plastics, setPlastics] = useState<PlasticResponse[]>([]);
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

    const handleMachineNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMachineName(event.target.value);
    };

    const handleWhatItDoesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setWhatItDoes(event.target.value);
    };

    const handleHowItWorksAndAcquiredChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setHowItWorksAndAcquired(event.target.value);
    };

    const handleOperationComplicationsAndLessonsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOperationComplicationsAndLessons(event.target.value);
    };

    const handlePlasticsChange = (event: SelectChangeEvent<typeof selectedPlastics>) => {
        const value = event.target.value;
        const values = Array.isArray(value) ? value : [value];
        setSelectedPlastics(values.map((id) => (typeof id === 'string' ? Number(id) : id)));
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

        // TODO: Implement machine upload API call
        try {
            await createMachine({
                name: machineName,
                whatItDoes: whatItDoes,
                howItWorksAndAcquired: howItWorksAndAcquired,
                operationComplicationsAndLessons: operationComplicationsAndLessons,
                plasticIds: selectedPlastics.length > 0 ? selectedPlastics : undefined,
            });

            alert('Successfully uploaded machine');
            navigate('/plasticProjects');
        } catch (error: any) {
            console.error('Upload error:', error);
            alert(error.message || 'Failed to upload machine');
        }
    };

    return (
        <Box component="form" noValidate onSubmit={handleUpload} sx={{ margin: '0 auto', width: 500 }}>
            <TextField
                required
                fullWidth
                id="machineName"
                label="Machine Name"
                name="machineName"
                value={machineName}
                onChange={handleMachineNameChange}
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
                id="whatItDoes"
                label="What it does"
                name="whatItDoes"
                value={whatItDoes}
                onChange={handleWhatItDoesChange}
                multiline
                minRows={3}
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
                id="howItWorksAndAcquired"
                label="How it works and how it was acquired"
                name="howItWorksAndAcquired"
                value={howItWorksAndAcquired}
                onChange={handleHowItWorksAndAcquiredChange}
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

            <TextField
                fullWidth
                id="operationComplicationsAndLessons"
                label="Operation complications and important lessons"
                name="operationComplicationsAndLessons"
                value={operationComplicationsAndLessons}
                onChange={handleOperationComplicationsAndLessonsChange}
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
                    <em>Select plastics this machine processes</em>
                </MenuItem>
                {plastics.map((plastic) => (
                    <MenuItem key={plastic.id} value={plastic.id}>
                        {plastic.name}
                    </MenuItem>
                ))}
            </Select>

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
                Upload Machine
            </Button>
        </Box>
    );
};

export default UploadMachineForm;