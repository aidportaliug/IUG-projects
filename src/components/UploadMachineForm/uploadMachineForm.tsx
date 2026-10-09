import React, { useState, useEffect } from 'react';
import {
  Button,
  Box,
  Chip,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import { getPlastics, PlasticResponse } from '../../services/plasticService';
import {
  createMachine,
  deleteMachineImage,
  getMachine,
  updateMachine,
  uploadMachineImage,
} from '../../services/machineService';
import { getMachineImage, machinePicture } from '../../models/machineImages';
import PicturePicker from '../PicturePicker/PicturePicker';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';
import imageMachineCard from '../../images/plasticProject.png';
// Same layout and styles as the project upload form.
import '../UploadPlasticProjectForm/uploadPlasticProjectForm.css';
import '../../pages/plasticPage/plasticPage.css';

type RequiredField = 'name' | 'whatItDoes' | 'howItWorks';

interface UploadMachineFormProps {
  // When set, the form edits this machine instead of creating a new one.
  machineId?: number;
}

const UploadMachineForm: React.FC<UploadMachineFormProps> = ({ machineId }) => {
  const isEdit = machineId !== undefined;
  const { t } = useI18n();
  const navigate = useNavigate();
  const [machineName, setMachineName] = useState('');
  const [whatItDoes, setWhatItDoes] = useState('');
  const [howItWorksAndAcquired, setHowItWorksAndAcquired] = useState('');
  const [operationComplicationsAndLessons, setOperationComplicationsAndLessons] = useState('');
  const [selectedPlastics, setSelectedPlastics] = useState<number[]>([]);
  const [plastics, setPlastics] = useState<PlasticResponse[]>([]);
  const [formError, setFormError] = useState('');
  // Missing fields are highlighted only after the first submit attempt.
  const [showMissing, setShowMissing] = useState(false);
  const [saving, setSaving] = useState(false);
  // A picked picture waits here until the machine exists, then it is uploaded.
  const [picture, setPicture] = useState<Blob | null>(null);
  const [pictureUrl, setPictureUrl] = useState<string | undefined>(undefined);
  // Edit mode: the uploaded picture the machine has now, and whether the admin removed it.
  const [savedPicture, setSavedPicture] = useState<string | undefined>(undefined);
  const [removePicture, setRemovePicture] = useState(false);
  const [loadingMachine, setLoadingMachine] = useState(isEdit);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Free the preview's object URL when it is replaced or the form closes.
  useEffect(() => {
    return () => {
      if (pictureUrl) URL.revokeObjectURL(pictureUrl);
    };
  }, [pictureUrl]);

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

  // Edit mode: fill the form with the machine's current values.
  useEffect(() => {
    if (machineId === undefined) return;
    const loadMachine = async () => {
      try {
        const machine = await getMachine(machineId);
        setMachineName(machine.name);
        setWhatItDoes(machine.whatItDoes);
        setHowItWorksAndAcquired(machine.howItWorksAndAcquired);
        setOperationComplicationsAndLessons(machine.operationComplicationsAndLessons);
        setSelectedPlastics(machine.plastics.map((plastic) => plastic.id));
        setSavedPicture(machine.imageUrl ? machinePicture(machine) : undefined);
      } catch (error: any) {
        setLoadError(error.message || '');
      } finally {
        setLoadingMachine(false);
      }
    };
    loadMachine();
  }, [machineId]);

  // The picture shown in the form and preview: a newly picked one, else the uploaded one unless removed.
  const shownPicture = pictureUrl ?? (removePicture ? undefined : savedPicture);

  const plasticNames = selectedPlastics
    .map((id) => plastics.find((plastic) => plastic.id === id)?.name)
    .filter((plasticName): plasticName is string => !!plasticName);

  const fieldLabels: Record<RequiredField, string> = {
    name: t.machineForm.name,
    whatItDoes: t.machineForm.whatItDoes,
    howItWorks: t.machineForm.howItWorks,
  };
  const filled: Record<RequiredField, boolean> = {
    name: !!machineName.trim(),
    whatItDoes: !!whatItDoes.trim(),
    howItWorks: !!howItWorksAndAcquired.trim(),
  };
  const missingFields = (Object.keys(filled) as RequiredField[]).filter((field) => !filled[field]);
  const isMissing = (field: RequiredField) => showMissing && !filled[field];

  const handlePlasticsChange = (event: SelectChangeEvent<typeof selectedPlastics>) => {
    const value = event.target.value;
    const values = Array.isArray(value) ? value : [value];
    setSelectedPlastics(values.map((id) => (typeof id === 'string' ? Number(id) : id)));
  };

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');
    setShowMissing(true);
    if (missingFields.length > 0) {
      setFormError(t.projectForm.missingFields(missingFields.map((field) => fieldLabels[field]).join(', ')));
      return;
    }

    setSaving(true);
    try {
      const fields = {
        name: machineName.trim(),
        whatItDoes: whatItDoes.trim(),
        howItWorksAndAcquired: howItWorksAndAcquired.trim(),
        operationComplicationsAndLessons: operationComplicationsAndLessons.trim(),
      };
      const machine =
        machineId !== undefined
          ? await updateMachine(machineId, { ...fields, plasticIds: selectedPlastics })
          : await createMachine({ ...fields, plasticIds: selectedPlastics.length > 0 ? selectedPlastics : undefined });
      try {
        if (picture) {
          await uploadMachineImage(machine.id, picture);
        } else if (removePicture) {
          await deleteMachineImage(machine.id);
        }
      } catch (pictureError) {
        // The machine is saved; the machine page shows the warning and the admin can try again by editing.
        console.error('Failed to save the machine picture:', pictureError);
        navigate(`/machine/${machine.id}`, { state: { uploadWarning: t.machineForm.pictureFailed } });
        return;
      }
      navigate(isEdit ? `/machine/${machine.id}` : '/plasticProjects');
    } catch (error: any) {
      console.error('Upload error:', error);
      setFormError(error.message || t.machineForm.uploadFailed);
    } finally {
      setSaving(false);
    }
  };

  if (loadingMachine) {
    return <p style={{ textAlign: 'center' }}>{t.common.loading}</p>;
  }
  if (loadError !== null) {
    return (
      <Typography color="error" textAlign="center">
        {loadError || t.machineDetail.loadFailed}
      </Typography>
    );
  }

  return (
    <div className="projectFormLayout">
      <Box component="form" noValidate onSubmit={handleUpload} className="projectFormCard">
        <p className="projectFormRequiredNote">{t.projectForm.requiredNote}</p>

        {/* 1. What the machine card shows */}
        <h2 className="projectFormSection">{t.machineForm.sectionCard}</h2>
        <TextField
          required
          fullWidth
          id="machineName"
          label={t.machineForm.name}
          value={machineName}
          onChange={(event) => setMachineName(event.target.value)}
          error={isMissing('name')}
          margin="dense"
        />
        <PicturePicker
          label={t.machineForm.picture}
          image={shownPicture}
          pickedSize={picture?.size}
          onPicked={(picked) => {
            setPicture(picked);
            setPictureUrl(URL.createObjectURL(picked));
            setRemovePicture(false);
          }}
          onRemove={() => {
            setPicture(null);
            setPictureUrl(undefined);
            setRemovePicture(!!savedPicture);
          }}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel id="machine-plastics-label">{t.projectForm.plastics}</InputLabel>
          <Select
            labelId="machine-plastics-label"
            id="plastics"
            multiple
            value={selectedPlastics}
            onChange={handlePlasticsChange}
            input={<OutlinedInput label={t.projectForm.plastics} />}
            renderValue={() => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {plasticNames.map((plasticName) => (
                  <Chip key={plasticName} label={plasticName} size="small" />
                ))}
              </Box>
            )}
          >
            {plastics.map((plastic) => (
              <MenuItem key={plastic.id} value={plastic.id}>
                {plastic.name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{t.machineForm.selectPlasticsHint}</FormHelperText>
        </FormControl>
        <TextField
          required
          fullWidth
          id="whatItDoes"
          label={t.machineForm.whatItDoes}
          value={whatItDoes}
          onChange={(event) => setWhatItDoes(event.target.value)}
          error={isMissing('whatItDoes')}
          helperText={t.machineForm.whatItDoesHelp}
          multiline
          minRows={2}
          margin="dense"
        />

        {/* 2. More details, shown on the machine's own page */}
        <h2 className="projectFormSection">{t.machineForm.sectionDetails}</h2>
        <TextField
          required
          fullWidth
          id="howItWorksAndAcquired"
          label={t.machineForm.howItWorks}
          value={howItWorksAndAcquired}
          onChange={(event) => setHowItWorksAndAcquired(event.target.value)}
          error={isMissing('howItWorks')}
          helperText={t.machineForm.howItWorksHelp}
          multiline
          minRows={4}
          margin="dense"
        />
        <TextField
          fullWidth
          id="operationComplicationsAndLessons"
          label={t.machineForm.lessons}
          value={operationComplicationsAndLessons}
          onChange={(event) => setOperationComplicationsAndLessons(event.target.value)}
          helperText={t.machineForm.lessonsHelp}
          multiline
          minRows={4}
          margin="dense"
        />

        {formError && (
          <Typography color="error" sx={{ mt: 2 }}>
            {formError}
          </Typography>
        )}
        <Button type="submit" variant="contained" fullWidth disabled={saving} className="projectFormSubmit">
          {isEdit ? t.projectForm.submitEdit : t.machineForm.submit}
        </Button>
      </Box>

      {/* Live preview of the machine card, as in the machine list */}
      <aside className="projectFormPreview">
        <h2 className="projectFormSection">{t.projectForm.preview}</h2>
        <p className="projectFormPreviewHint">{t.machineForm.previewHint}</p>
        <div className="plasticCard">
          <div className="plasticCardOutline">
            <div className="plasticCardBody">
              <div className="machineCardTitle">{machineName.trim() || t.machineForm.name}</div>
              <img
                className="machineCardImage"
                src={shownPicture ?? getMachineImage(machineName) ?? imageMachineCard}
                alt=""
              />
              <div className="plasticCardTags">
                <b>{t.plastic.plasticTypes} </b>
                {plasticNames.map((plasticName) => (
                  <span key={plasticName} className="plasticTag">
                    {plasticName}
                  </span>
                ))}
              </div>
              <div className="plasticCardTags">
                <b>{t.plastic.whatItDoes} </b>
                {whatItDoes.trim() || t.machineForm.whatItDoesHelp}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default UploadMachineForm;
