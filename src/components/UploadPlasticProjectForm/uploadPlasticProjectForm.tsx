import React, { useState, useRef, useEffect } from 'react';
import './uploadPlasticProjectForm.css';
import {
  Box,
  Button,
  Chip,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
  TextFieldProps,
  Typography,
} from '@mui/material';
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
import PlasticProjectCard from '../PlasticProjectCards/PlasticProjectCard';

// Must match MAX_UPLOAD_MB on the backend.
const MAX_PDF_MB = 25;
const isHttpUrl = (value: string) => /^https?:\/\/\S+$/i.test(value.trim());
// yyyy-mm-dd in local time; toISOString() would shift dates picked at local midnight to the day before.
// Returns undefined for empty or half-typed dates.
const toIsoDate = (value: unknown): string | undefined => {
  if (!value) return undefined;
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const date = new Date(value as string);
  if (isNaN(date.getTime())) return undefined;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};
// Select value for a stored country that is not in the country list (e.g. "Somaliland").
const CURRENT_COUNTRY = '__current__';
const NO_COUNTRY = 'country';

// Fields that every project card shows, in the card's order.
type RequiredField =
  | 'name'
  | 'summary'
  | 'startDate'
  | 'country'
  | 'plastics'
  | 'product'
  | 'financing'
  | 'businessModel';

const formatCountryName = (countryName: string): string =>
  countryName
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace(/\bAnd\b/g, '&');

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
  // Missing fields are highlighted only after the first submit attempt.
  const [showMissing, setShowMissing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [country, setCountry] = useState(NO_COUNTRY);
  const [selectedPlastics, setSelectedPlastics] = useState<number[]>([]);
  const [plastics, setPlastics] = useState<PlasticResponse[]>([]);
  const [financing, setFinancing] = useState('');
  const [businessModel, setBusinessModel] = useState('');
  const [wasteCollected, setWasteCollected] = useState<number>(0);
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [links, setLinks] = useState<DocumentLinkRequest[]>([]);
  const navigate = useNavigate();
  const pdfInputRef = useRef<HTMLInputElement>(null);

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

  // Store the display name (e.g. "Kenya") like the rest of the platform data, not the form key.
  const countryName =
    country === CURRENT_COUNTRY
      ? customCountry
      : country === NO_COUNTRY
      ? ''
      : countryLabels[country as keyof typeof countryLabels] || formatCountryName(country);
  const plasticNames = selectedPlastics
    .map((id) => plastics.find((plastic) => plastic.id === id)?.name)
    .filter((plasticName): plasticName is string => !!plasticName);
  const startDateIso = toIsoDate(startDate);
  const endDateIso = toIsoDate(endDate);

  const fieldLabels: Record<RequiredField, string> = {
    name: t.projectForm.name,
    summary: t.projectForm.summary,
    startDate: t.projectForm.startDate,
    country: t.filters.country,
    plastics: t.projectForm.plastics,
    product: t.projectForm.product,
    financing: t.projectForm.financing,
    businessModel: t.projectForm.businessModel,
  };
  const filled: Record<RequiredField, boolean> = {
    name: !!name.trim(),
    summary: !!summary.trim(),
    startDate: !!startDateIso,
    country: !!countryName,
    plastics: selectedPlastics.length > 0,
    product: !!product.trim(),
    financing: !!financing.trim(),
    businessModel: !!businessModel.trim(),
  };
  const missingFields = (Object.keys(filled) as RequiredField[]).filter((field) => !filled[field]);
  const isMissing = (field: RequiredField) => showMissing && !filled[field];

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

  const handlePlasticsChange = (event: SelectChangeEvent<typeof selectedPlastics>) => {
    const value = event.target.value;
    const values = Array.isArray(value) ? value : [value];
    setSelectedPlastics(values.map((id) => (typeof id === 'string' ? Number(id) : id)));
  };

  const handleWasteCollectedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    setWasteCollected(isNaN(value) ? 0 : value);
  };

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');
    setShowMissing(true);

    if (missingFields.length > 0) {
      setFormError(t.projectForm.missingFields(missingFields.map((field) => fieldLabels[field]).join(', ')));
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

    setSaving(true);
    try {
      const fields = {
        name: name.trim(),
        startDate: startDateIso as string,
        endDate: endDateIso,
        country: countryName,
        product: product.trim(),
        financing: financing.trim(),
        businessModel: businessModel.trim(),
        wasteCollected,
        summary: summary.trim(),
        plasticIds: selectedPlastics,
      };

      let savedProjectId: number;
      if (projectId !== undefined) {
        await updatePlasticProject(projectId, fields);
        for (const link of filledLinks) {
          await addPlasticProjectLink(projectId, link);
        }
        savedProjectId = projectId;
      } else {
        const createdProject = await createPlasticProject({
          ...fields,
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
    } finally {
      setSaving(false);
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
    <div className="projectFormLayout">
      <Box component="form" noValidate onSubmit={handleUpload} className="projectFormCard">
        <p className="projectFormRequiredNote">{t.projectForm.requiredNote}</p>

        {/* 1. The card's title and text */}
        <h2 className="projectFormSection">{t.projectForm.sectionAbout}</h2>
        <TextField
          required
          fullWidth
          id="projectTitle"
          label={t.projectForm.name}
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={isMissing('name')}
          margin="dense"
        />
        <TextField
          required
          fullWidth
          id="summary"
          label={t.projectForm.summary}
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          error={isMissing('summary')}
          helperText={t.projectForm.summaryHelp}
          multiline
          minRows={4}
          margin="dense"
        />

        {/* 2. The facts listed on the detailed card, in the same order */}
        <h2 className="projectFormSection">{t.projectForm.sectionCard}</h2>
        <div className="projectFormRow">
          <DatePicker
            label={`${t.projectForm.startDate} *`}
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
              <TextField {...params} fullWidth margin="dense" error={isMissing('startDate')} />
            )}
          />
          <DatePicker
            label={t.projectForm.endDate}
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
              <TextField {...params} fullWidth margin="dense" helperText={t.projectForm.endDateHelp} />
            )}
          />
        </div>

        <FormControl fullWidth margin="dense" required error={isMissing('country')}>
          <InputLabel id="country-label">{t.filters.country}</InputLabel>
          <Select
            labelId="country-label"
            id="country"
            label={t.filters.country}
            value={country}
            onChange={(event) => setCountry(event.target.value)}
          >
            <MenuItem value={NO_COUNTRY}>
              <em>{t.projectForm.selectCountry}</em>
            </MenuItem>
            {customCountry && <MenuItem value={CURRENT_COUNTRY}>{customCountry}</MenuItem>}
            {countries.map((c) => (
              <MenuItem key={c} value={c}>
                {formatCountryName(c)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="dense" required error={isMissing('plastics')}>
          <InputLabel id="plastics-label">{t.projectForm.plastics}</InputLabel>
          <Select
            labelId="plastics-label"
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
          <FormHelperText>{t.projectForm.selectPlasticsHint}</FormHelperText>
        </FormControl>

        <TextField
          required
          fullWidth
          id="product"
          label={t.projectForm.product}
          value={product}
          onChange={(event) => setProduct(event.target.value)}
          error={isMissing('product')}
          margin="dense"
        />
        <TextField
          required
          fullWidth
          id="financing"
          label={t.projectForm.financing}
          value={financing}
          onChange={(event) => setFinancing(event.target.value)}
          error={isMissing('financing')}
          margin="dense"
        />
        <TextField
          required
          fullWidth
          id="businessModel"
          label={t.projectForm.businessModel}
          value={businessModel}
          onChange={(event) => setBusinessModel(event.target.value)}
          error={isMissing('businessModel')}
          margin="dense"
        />
        <TextField
          type="number"
          fullWidth
          id="wasteCollected"
          label={t.projectForm.wasteCollected}
          value={wasteCollected}
          onChange={handleWasteCollectedChange}
          helperText={t.projectForm.wasteHelp}
          inputProps={{ min: 0, step: 'any' }}
          margin="dense"
        />

        {/* 3. Reports and links, shown on the project page */}
        <h2 className="projectFormSection">{t.projectForm.sectionDocuments}</h2>
        {isEdit && existingDocuments.length > 0 && (
          <Box sx={{ mb: 1 }}>
            <b>{t.projectForm.currentDocuments}</b>
            {existingDocuments.map((document) => (
              <div key={document.id} className="projectFormListRow">
                <span>
                  {document.title} ({document.kind === 'FILE' ? t.projectForm.pdf : t.projectForm.link})
                </span>
                <Button size="small" color="error" onClick={() => removeExistingDocument(document)}>
                  {t.common.remove}
                </Button>
              </div>
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
          fullWidth
          variant="outlined"
          className="projectFormAddButton"
          onClick={() => pdfInputRef.current?.click()}
        >
          {t.projectForm.addReports(MAX_PDF_MB)}
        </Button>
        {filesError && (
          <Typography color="error" sx={{ mb: 1 }}>
            {filesError}
          </Typography>
        )}
        {pdfFiles.map((file, index) => (
          <div key={`${file.name}-${index}`} className="projectFormListRow">
            <span>
              {file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)
            </span>
            <Button size="small" onClick={() => removePdf(index)}>
              {t.common.remove}
            </Button>
          </div>
        ))}

        {links.map((link, index) => (
          <div key={index} className="projectFormRow projectFormLinkRow">
            <TextField
              label={t.projectForm.linkTitle}
              value={link.title}
              onChange={(event) => updateLink(index, 'title', event.target.value)}
              margin="dense"
            />
            <TextField
              label={t.projectForm.linkUrl}
              value={link.url}
              onChange={(event) => updateLink(index, 'url', event.target.value)}
              margin="dense"
            />
            <Button size="small" onClick={() => setLinks((current) => current.filter((_, i) => i !== index))}>
              {t.common.remove}
            </Button>
          </div>
        ))}
        <Button
          fullWidth
          variant="outlined"
          className="projectFormAddButton"
          onClick={() => setLinks((current) => [...current, { title: '', url: '' }])}
        >
          {t.projectForm.addLink}
        </Button>

        {formError && (
          <Typography color="error" sx={{ mt: 2 }}>
            {formError}
          </Typography>
        )}
        <Button type="submit" variant="contained" fullWidth disabled={saving} className="projectFormSubmit">
          {isEdit ? t.projectForm.submitEdit : t.projectForm.submitCreate}
        </Button>
      </Box>

      {/* Live preview of the detailed project card */}
      <aside className="projectFormPreview">
        <h2 className="projectFormSection">{t.projectForm.preview}</h2>
        <p className="projectFormPreviewHint">{t.projectForm.previewHint}</p>
        <PlasticProjectCard
          variant="detailed"
          name={name.trim() || t.projectForm.name}
          summary={summary.trim() || t.projectForm.summaryHelp}
          startDate={startDateIso}
          endDate={endDateIso}
          country={countryName}
          plastics={plasticNames}
          product={product}
          financing={financing}
          businessModel={businessModel}
          wasteCollected={wasteCollected}
        />
      </aside>
    </div>
  );
};

export default UploadPlasticProjectForm;
