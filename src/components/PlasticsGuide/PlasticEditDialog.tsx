import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import {
  createPlastic,
  deletePlasticImage,
  PlasticResponse,
  plasticImageHref,
  updatePlastic,
  uploadPlasticImage,
} from '../../services/plasticService';
import PicturePicker from '../PicturePicker/PicturePicker';
import { useI18n } from '../../i18n/I18nContext';

interface PlasticEditDialogProps {
  open: boolean;
  // The plastic to edit; undefined adds a new one.
  plastic?: PlasticResponse;
  onClose: () => void;
  // Called with the saved plastic's ID once everything (including the picture) is stored.
  onSaved: (plasticId: number) => void;
}

// Admin dialog for adding or editing a plastic: name, resin code, description and picture.
const PlasticEditDialog: React.FC<PlasticEditDialogProps> = ({ open, plastic, onClose, onSaved }) => {
  const { t } = useI18n();
  const [name, setName] = useState('');
  const [resinCode, setResinCode] = useState('');
  const [description, setDescription] = useState('');
  const [picture, setPicture] = useState<Blob | null>(null);
  const [pictureUrl, setPictureUrl] = useState<string | undefined>(undefined);
  const [removePicture, setRemovePicture] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Start from the plastic's current values each time the dialog opens.
  useEffect(() => {
    if (!open) return;
    setName(plastic?.name ?? '');
    setResinCode(plastic?.resinCode ? String(plastic.resinCode) : '');
    setDescription(plastic?.description ?? '');
    setPicture(null);
    setPictureUrl(undefined);
    setRemovePicture(false);
    setError('');
  }, [open, plastic]);

  // Free the preview's object URL when it is replaced or the dialog closes.
  useEffect(() => {
    return () => {
      if (pictureUrl) URL.revokeObjectURL(pictureUrl);
    };
  }, [pictureUrl]);

  const savedPicture = plastic ? plasticImageHref(plastic) : undefined;
  const shownPicture = pictureUrl ?? (removePicture ? undefined : savedPicture);

  const handleSave = async () => {
    if (!name.trim()) {
      setError(t.plasticsGuide.nameRequired);
      return;
    }
    const code = resinCode.trim() ? Number(resinCode) : undefined;
    if (code !== undefined && (!Number.isInteger(code) || code < 1 || code > 99)) {
      setError(t.plasticsGuide.resinCodeInvalid);
      return;
    }
    setSaving(true);
    setError('');
    try {
      const fields = { name: name.trim(), description: description.trim() };
      const saved = plastic
        ? await updatePlastic(plastic.id, { ...fields, resinCode: code ?? 0 })
        : await createPlastic({ ...fields, resinCode: code });
      if (picture) {
        await uploadPlasticImage(saved.id, picture);
      } else if (removePicture) {
        await deletePlasticImage(saved.id);
      }
      onSaved(saved.id);
    } catch (err: any) {
      setError(err.message || t.plasticsGuide.saveFailed);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => !saving && onClose()} fullWidth maxWidth="sm">
      <DialogTitle>{plastic ? t.plasticsGuide.editTitle : t.plasticsGuide.addTitle}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          required
          fullWidth
          margin="dense"
          label={t.plasticsGuide.name}
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setError('');
          }}
          error={!!error && !name.trim()}
        />
        <TextField
          fullWidth
          margin="dense"
          type="number"
          label={t.plasticsGuide.resinCode}
          helperText={t.plasticsGuide.resinCodeHelp}
          value={resinCode}
          onChange={(event) => {
            setResinCode(event.target.value);
            setError('');
          }}
          inputProps={{ min: 1, max: 99, step: 1 }}
        />
        <TextField
          fullWidth
          multiline
          minRows={4}
          margin="dense"
          label={t.plasticsGuide.description}
          helperText={t.plasticsGuide.descriptionHelp}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <PicturePicker
          label={t.plasticsGuide.picture}
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

export default PlasticEditDialog;
