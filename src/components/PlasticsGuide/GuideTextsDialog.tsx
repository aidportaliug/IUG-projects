import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { saveSiteTexts, SiteTexts } from '../../services/plasticService';
import { useI18n } from '../../i18n/I18nContext';
import { en } from '../../i18n/en';
import { nb } from '../../i18n/nb';

// The editable texts of the identification guide, per language.
const FIELDS = [
  { key: 'plastic-identification.title.nb', kind: 'title', lang: 'nb', standard: nb.plasticsGuide.identifyTitle },
  { key: 'plastic-identification.text.nb', kind: 'text', lang: 'nb', standard: nb.plasticsGuide.identifyHint },
  { key: 'plastic-identification.title.en', kind: 'title', lang: 'en', standard: en.plasticsGuide.identifyTitle },
  { key: 'plastic-identification.text.en', kind: 'text', lang: 'en', standard: en.plasticsGuide.identifyHint },
] as const;

interface GuideTextsDialogProps {
  open: boolean;
  texts: SiteTexts;
  onClose: () => void;
  onSaved: (texts: SiteTexts) => void;
}

// Admin dialog for the title and text of "How to identify plastics", in Norwegian and English.
// An empty field means the standard (built-in) text is shown.
const GuideTextsDialog: React.FC<GuideTextsDialogProps> = ({ open, texts, onClose, onSaved }) => {
  const { t } = useI18n();
  const [values, setValues] = useState<SiteTexts>({});
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setValues(Object.fromEntries(FIELDS.map((field) => [field.key, texts[field.key] ?? ''])));
    setError('');
  }, [open, texts]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      onSaved(await saveSiteTexts(values));
    } catch (err: any) {
      setError(err.message || t.plasticsGuide.textsFailed);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => !saving && onClose()} fullWidth maxWidth="sm">
      <DialogTitle>{t.plasticsGuide.textsTitle}</DialogTitle>
      <DialogContent>
        <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem', mb: 1 }}>{t.plasticsGuide.textsHint}</Typography>
        {FIELDS.map((field) => (
          <TextField
            key={field.key}
            fullWidth
            margin="dense"
            multiline={field.kind === 'text'}
            minRows={field.kind === 'text' ? 3 : undefined}
            label={`${field.kind === 'title' ? t.plasticsGuide.textsFieldTitle : t.plasticsGuide.textsFieldText} (${
              field.lang === 'nb' ? t.language.nb : t.language.en
            })`}
            placeholder={field.standard}
            InputLabelProps={{ shrink: true }}
            inputProps={{ maxLength: field.kind === 'title' ? 200 : 2000 }}
            value={values[field.key] ?? ''}
            onChange={(event) => setValues((current) => ({ ...current, [field.key]: event.target.value }))}
          />
        ))}
        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={saving} sx={{ color: '#3D7844', textTransform: 'none' }}>
          {t.plasticsGuide.cancel}
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          sx={{ backgroundColor: '#3D7844', textTransform: 'none', '&:hover': { backgroundColor: '#2f5f35' } }}
        >
          {t.plasticsGuide.save}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GuideTextsDialog;
