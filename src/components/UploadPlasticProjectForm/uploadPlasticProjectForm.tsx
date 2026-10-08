import React, { SetStateAction, useState, useRef, useEffect } from 'react';
import './uploadPlasticProjectForm.css';
import { Box, Button, MenuItem, Select, SelectChangeEvent, TextField, TextFieldProps, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import {
  addPlasticProjectLink,
  createPlasticProject,
  deletePlasticProjectDocument,
  DocumentLinkRequest,
  getPlasticProject,
  getPlastics,
  PlasticProjectDocument,
  PlasticResponse,
  updatePlasticProject,
  uploadPlasticProjectPdf,
} from '../../services/plasticService';
import { countries, country as countryLabels } from '../../models/allowedValues';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';

// Must match MAX_UPLOAD_MB on the backend.
const MAX_PDF_MB = 25;
const isHttpUrl = (value: string) => /^https?:\/\/\S+$/i.test(value.trim());
// yyyy-mm-dd in local time; toISOString() would shift dates picked at local midnight to the day before.
const toIsoDate = (value: string | Date) => {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const date = new Date(value);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};
// Select value for a stored country that is not in the country list (e.g. "Somaliland").
const CURRENT_COUNTRY = '__current__';

interface UploadPlasticProjectFormProps {
  // When set, the form edits this project instead of creating a new one.
  projectId?: number;
}

const UploadPlasticProjectForm: React.FC<UploadPlasticProjectFormProps> = ({ projectId }) => {
  const isEdit = projectId !== undefined;
  const { t } = useI18n();
  const [name, setName] = useState('');
  const [product, setProduct] = useState('');
  const [summary, setSummary] = useState('');
  const [customCountry, setCustomCountry] = useState('');
  const [existingDocuments, setExistingDocuments] = useState<PlasticProjectDocument[]>([]);
  const [loadingProject, setLoadingProject] = useState(isEdit);
  const [loadError, setLoadError] = useState<string | null>(null);
  // Shown next to the submit button and the reports section instead of popups.
  const [formError, setFormError] = useState('');
  const [filesError, setFilesError] = useState('');
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [country, setCountry] = useState('country');
  const [selectedPlastics, setSelectedPlastics] = useState<number[]>([]);
  const [plastics, setPlastics] = useState<PlasticResponse[]>([]);
  const [financing, setFinancing] = useState('');
  const [businessModel, setBusinessModel] = useState('');
  const [wasteCollected, setWasteCollected] = useState<number>(0);
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [links, setLinks] = useState<DocumentLinkRequest[]>([]);
  const navigate = useNavigate();
  const pdfInputRef = useRef<HTMLInputElement>(null);

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

  // Edit mode: fill the form with the project's current values.
  useEffect(() => {
    if (projectId === undefined) return;
    const loadProject = async () => {
      try {
        const project = await getPlasticProject(projectId);
        setName(project.name);
        setProduct(project.product);
        setSummary(project.summary ?? '');
        setStartDate(project.startDate);
        setEndDate(project.endDate);
        setFinancing(project.financing);
        setBusinessModel(project.businessModel);
        setWasteCollected(project.wasteCollected);
        setSelectedPlastics(project.plastics.map((plastic) => plastic.id));
        setExistingDocuments(project.documents ?? []);
        const countryKey = countries.find(
          (key) => countryLabels[key as keyof typeof countryLabels] === project.country
        );
        if (countryKey) {
          setCountry(countryKey);
        } else {
          setCustomCountry(project.country);
          setCountry(CURRENT_COUNTRY);
        }
      } catch (error: any) {
        setLoadError(error.message || '');
      } finally {
        setLoadingProject(false);
      }
    };
    loadProject();
  }, [projectId]);

  const removeExistingDocument = async (document: PlasticProjectDocument) => {
    if (projectId === undefined || !window.confirm(t.projectForm.confirmRemoveDocument(document.title))) return;
    setFilesError('');
    try {
      await deletePlasticProjectDocument(projectId, document.id);
      setExistingDocuments((current) => current.filter((d) => d.id !== document.id));
    } catch (error: any) {
      setFilesError(error.message || t.projectForm.removeFailed);
    }
  };

  // Helper function to format country names
  const formatCountryName = (countryName: string): string => {
    return countryName
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
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

  const handlePdfChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    const tooLarge = selected.filter((file) => file.size > MAX_PDF_MB * 1024 * 1024);
    const notPdf = selected.filter((file) => file.type !== 'application/pdf');
    const problems: string[] = [];
    if (tooLarge.length > 0) {
      problems.push(t.projectForm.tooLarge(MAX_PDF_MB, tooLarge.map((file) => file.name).join(', ')));
    }
    if (notPdf.length > 0) {
      problems.push(t.projectForm.notPdf(notPdf.map((file) => file.name).join(', ')));
    }
    setFilesError(problems.join('. '));
    const accepted = selected.filter((file) => !tooLarge.includes(file) && !notPdf.includes(file));
    setPdfFiles((current) => [...current, ...accepted]);
    event.target.value = '';
  };

  const removePdf = (index: number) => {
    setPdfFiles((current) => current.filter((_, i) => i !== index));
  };

  const updateLink = (index: number, field: keyof DocumentLinkRequest, value: string) => {
    setLinks((current) => current.map((link, i) => (i === index ? { ...link, [field]: value } : link)));
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
    const value = parseFloat(event.target.value);
    setWasteCollected(isNaN(value) ? 0 : value);
  };

  const handleUpload = async (event: { preventDefault: () => void; currentTarget: HTMLFormElement | undefined }) => {
    event.preventDefault();
    setFormError('');
    const form = event.currentTarget;
    const inputs = form?.elements as unknown as {
      [key: string]: HTMLInputElement & { required: boolean };
    };
    const emptyFields = Object.values(inputs).filter((input) => {
      return input.required && !input.value;
    });

    if (emptyFields.length > 0) {
      const fieldNames = emptyFields.slice(0, emptyFields.length / 2).map((element) => `"${element.name}"`);
      setFormError(t.common.requiredFields(fieldNames.join(', ')));
      return;
    }

    // Validate required fields
    if (!name.trim() || !product.trim() || !country || country === 'country') {
      setFormError(t.projectForm.fillRequired);
      return;
    }

    if (!countries.includes(country) && country !== CURRENT_COUNTRY) {
      setFormError(t.projectForm.chooseCountry);
      return;
    }

    if (wasteCollected < 0) {
      setFormError(t.projectForm.wasteNegative);
      return;
    }

    const filledLinks = links
      .map((link) => ({ title: link.title.trim(), url: link.url.trim() }))
      .filter((link) => link.title || link.url);
    if (filledLinks.some((link) => !link.title || !isHttpUrl(link.url))) {
      setFormError(t.projectForm.invalidLinks);
      return;
    }

    try {
      // Format dates
      let startDateISO: string | undefined;
      let endDateISO: string | undefined;

      if (startDate) {
        startDateISO = toIsoDate(startDate);
      }

      if (endDate) {
        endDateISO = toIsoDate(endDate);
      }

      // Store the display name (e.g. "Kenya") like the rest of the platform data, not the form key.
      const countryName =
        country === CURRENT_COUNTRY
          ? customCountry
          : countryLabels[country as keyof typeof countryLabels] || formatCountryName(country);

      let savedProjectId: number;
      if (projectId !== undefined) {
        await updatePlasticProject(projectId, {
          name: name.trim(),
          startDate: startDateISO,
          endDate: endDateISO,
          country: countryName,
          product: product.trim(),
          financing,
          businessModel,
          wasteCollected,
          summary: summary.trim() || undefined,
          plasticIds: selectedPlastics,
        });
        for (const link of filledLinks) {
          await addPlasticProjectLink(projectId, link);
        }
        savedProjectId = projectId;
      } else {
        const createdProject = await createPlasticProject({
          name: name.trim(),
          startDate: startDateISO || new Date().toISOString().split('T')[0],
          endDate: endDateISO,
          country: countryName,
          product: product.trim(),
          financing: financing,
          businessModel: businessModel,
          wasteCollected: wasteCollected,
          summary: summary.trim() || undefined,
          plasticIds: selectedPlastics.length > 0 ? selectedPlastics : undefined,
          links: filledLinks.length > 0 ? filledLinks : undefined,
        });
        savedProjectId = createdProject.id;
      }

      // PDFs are attached after the project exists; one failing file should not hide the others.
      const failedPdfs: string[] = [];
      for (const file of pdfFiles) {
        try {
          await uploadPlasticProjectPdf(savedProjectId, file);
        } catch (uploadError) {
          console.error(`Failed to upload ${file.name}:`, uploadError);
          failedPdfs.push(file.name);
        }
      }

      // The detail page shows this warning once (see plasticProjectDetailPage).
      const uploadWarning = failedPdfs.length > 0 ? t.projectForm.pdfsFailed(isEdit, failedPdfs.join(', ')) : undefined;
      navigate(`/plastic-project/${savedProjectId}`, { state: uploadWarning ? { uploadWarning } : undefined });
    } catch (error: any) {
      console.error('Upload error:', error);
      setFormError(error.message || t.projectForm.uploadFailed);
    }
  };

  if (loadingProject) {
    return <p style={{ textAlign: 'center' }}>{t.projectForm.loadingProject}</p>;
  }
  if (loadError !== null) {
    return (
      <Typography color="error" textAlign="center">
        {loadError || t.projectForm.loadFailed}
      </Typography>
    );
  }

  return (
    <Box component="form" noValidate onSubmit={handleUpload} sx={{ margin: '0 auto', width: 500 }}>
      <TextField
        required
        fullWidth
        id="projectTitle"
        label={t.projectForm.name}
        name="projectTitle"
        value={name}
        onChange={(event) => setName(event.target.value)}
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
        label={t.projectForm.product}
        name="product"
        value={product}
        onChange={(event) => setProduct(event.target.value)}
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
          label={t.filters.country}
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
          <MenuItem value="country">{t.projectForm.selectCountry}</MenuItem>
          {customCountry && <MenuItem value={CURRENT_COUNTRY}>{customCountry}</MenuItem>}
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
          label={t.projectForm.wasteCollected}
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
            return <span style={{ color: '#666' }}>{t.common.selectPlastics}</span>;
          }
          return selected.map((id) => plastics.find((p) => p.id === id)?.name).join(', ');
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
          <em>{t.projectForm.selectPlasticsHint}</em>
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
          label={t.projectForm.financing}
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
          label={t.projectForm.businessModel}
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
          label={t.projectForm.startDate}
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
          label={t.projectForm.endDate}
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
        label={t.projectForm.summary}
        name="summary"
        value={summary}
        onChange={(event) => setSummary(event.target.value)}
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

      {isEdit && existingDocuments.length > 0 && (
        <Box sx={{ marginBottom: '1em' }}>
          <b>{t.projectForm.currentDocuments}</b>
          {existingDocuments.map((document) => (
            <Box key={document.id} display="flex" alignItems="center" justifyContent="space-between">
              <span>
                {document.title} ({document.kind === 'FILE' ? t.projectForm.pdf : t.projectForm.link})
              </span>
              <Button size="small" color="error" onClick={() => removeExistingDocument(document)}>
                {t.common.remove}
              </Button>
            </Box>
          ))}
        </Box>
      )}

      <input
        type="file"
        accept="application/pdf"
        multiple
        style={{ display: 'none' }}
        ref={pdfInputRef}
        onChange={handlePdfChange}
      />
      <Button
        size="large"
        variant="outlined"
        onClick={() => pdfInputRef.current?.click()}
        style={{
          width: '100%',
          color: 'black',
          textTransform: 'none',
          border: '1px solid grey',
          marginBottom: '0.5em',
          backgroundColor: '#e0e0e0',
        }}
      >
        {t.projectForm.addReports(MAX_PDF_MB)}
      </Button>
      {filesError && (
        <Typography color="error" sx={{ mb: 1 }}>
          {filesError}
        </Typography>
      )}
      {pdfFiles.length > 0 && (
        <Box sx={{ marginBottom: '1em' }}>
          {pdfFiles.map((file, index) => (
            <Box key={`${file.name}-${index}`} display="flex" alignItems="center" justifyContent="space-between">
              <span>
                {file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)
              </span>
              <Button size="small" onClick={() => removePdf(index)}>
                {t.common.remove}
              </Button>
            </Box>
          ))}
        </Box>
      )}

      {links.map((link, index) => (
        <Box key={index} display="flex" alignItems="center" sx={{ marginBottom: '0.5em' }}>
          <TextField
            label={t.projectForm.linkTitle}
            value={link.title}
            onChange={(event) => updateLink(index, 'title', event.target.value)}
            sx={{ width: '40%', marginRight: '0.5em', backgroundColor: '#e0e0e0' }}
          />
          <TextField
            label={t.projectForm.linkUrl}
            value={link.url}
            onChange={(event) => updateLink(index, 'url', event.target.value)}
            sx={{ flex: 1, backgroundColor: '#e0e0e0' }}
          />
          <Button size="small" onClick={() => setLinks((current) => current.filter((_, i) => i !== index))}>
            {t.common.remove}
          </Button>
        </Box>
      ))}
      <Button
        size="large"
        variant="outlined"
        onClick={() => setLinks((current) => [...current, { title: '', url: '' }])}
        style={{
          width: '100%',
          color: 'black',
          textTransform: 'none',
          border: '1px solid grey',
          marginBottom: '1em',
          backgroundColor: '#e0e0e0',
        }}
      >
        {t.projectForm.addLink}
      </Button>

      <input type="file" accept="image/*" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileChange} />
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
        {t.common.uploadPicture}
      </Button>

      {imageUrl && (
        <div style={{ marginBottom: '1em' }}>
          <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: 200 }} />
        </div>
      )}

      {formError && (
        <Typography color="error" sx={{ mb: 2 }}>
          {formError}
        </Typography>
      )}
      <Button type="submit" variant="contained" style={{ width: 200, height: 50, margin: '1em' }}>
        {isEdit ? t.projectForm.submitEdit : t.projectForm.submitCreate}
      </Button>
    </Box>
  );
};

export default UploadPlasticProjectForm;
