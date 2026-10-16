import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { createPlastic, getPlastics, PlasticResponse, updatePlastic } from '../../services/plasticService';
import { useAuth } from '../../services/AuthContext';
import { useI18n } from '../../i18n/I18nContext';
import identificationGuide from '../../images/plastic-identification.png';
import './plasticsGuide.css';

// Resin identification codes (the number in the recycling triangle) of the standard plastics.
const resinCodes: Record<string, number> = { PET: 1, HDPE: 2, PVC: 3, LDPE: 4, PP: 5, PS: 6, OTHER: 7 };

// A plastic's resin code: the standard one for its name, else "resin code N" in its description, else none.
function resinCode(plastic: PlasticResponse): number | undefined {
  const known = resinCodes[plastic.name.trim().toUpperCase()];
  if (known !== undefined) return known;
  const match = plastic.description?.match(/resin code (\d+)/i);
  return match ? Number(match[1]) : undefined;
}

// Sorted by resin code (1 PET … 7 Other); plastics without a code come last, alphabetically.
function byResinCode(a: PlasticResponse, b: PlasticResponse): number {
  const codeA = resinCode(a) ?? Number.MAX_SAFE_INTEGER;
  const codeB = resinCode(b) ?? Number.MAX_SAFE_INTEGER;
  return codeA - codeB || a.name.localeCompare(b.name);
}

// The admin's add/edit dialog: a new plastic, or the plastic being edited.
type DialogState = { mode: 'add' } | { mode: 'edit'; plastic: PlasticResponse } | null;

// Plastics tab: how to identify plastics, and every plastic in the database with its description.
const PlasticsGuide: React.FC = () => {
  const { t } = useI18n();
  const { user } = useAuth();
  const isAdmin = !!user?.isAdmin;
  const [plastics, setPlastics] = useState<PlasticResponse[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [dialog, setDialog] = useState<DialogState>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dialogError, setDialogError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadPlastics = useCallback(async (selectId?: number) => {
    try {
      const response = await getPlastics(undefined, 1, 100);
      const sorted = [...response.plastics].sort(byResinCode);
      setPlastics(sorted);
      setSelectedId((current) => selectId ?? current ?? sorted[0]?.id ?? null);
      setLoadError(null);
    } catch (error: any) {
      setLoadError(error.message || '');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlastics();
  }, [loadPlastics]);

  const selected = plastics.find((plastic) => plastic.id === selectedId);

  const openDialog = (state: DialogState) => {
    setDialog(state);
    setName(state?.mode === 'edit' ? state.plastic.name : '');
    setDescription(state?.mode === 'edit' ? state.plastic.description ?? '' : '');
    setDialogError('');
  };

  const handleSave = async () => {
    if (!dialog) return;
    if (!name.trim()) {
      setDialogError(t.plasticsGuide.nameRequired);
      return;
    }
    setSaving(true);
    setDialogError('');
    try {
      const fields = { name: name.trim(), description: description.trim() };
      const saved =
        dialog.mode === 'edit' ? await updatePlastic(dialog.plastic.id, fields) : await createPlastic(fields);
      setDialog(null);
      await loadPlastics(saved.id);
    } catch (error: any) {
      setDialogError(error.message || t.plasticsGuide.saveFailed);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="plasticsGuide">
      <section className="plasticsGuideCard">
        <h2>{t.plasticsGuide.identifyTitle}</h2>
        <p className="plasticsGuideHint">{t.plasticsGuide.identifyHint}</p>
        <a href={identificationGuide} target="_blank" rel="noopener noreferrer" title={t.plasticsGuide.openFull}>
          <img className="plasticsGuideImage" src={identificationGuide} alt={t.plasticsGuide.identifyAlt} />
        </a>
      </section>

      <section className="plasticsGuideCard">
        <div className="plasticsGuideHeader">
          <h2>{t.plasticsGuide.listTitle}</h2>
          {isAdmin && (
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => openDialog({ mode: 'add' })}
              sx={{ color: '#3D7844', borderColor: '#3D7844', textTransform: 'none', borderRadius: '8px' }}
            >
              {t.plasticsGuide.add}
            </Button>
          )}
        </div>

        {loading ? (
          <CircularProgress size={24} />
        ) : loadError !== null ? (
          <Typography color="error">{loadError || t.plasticsGuide.loadFailed}</Typography>
        ) : (
          <>
            <div className="plasticsGuideButtons">
              {plastics.map((plastic) => (
                <Button
                  key={plastic.id}
                  variant={plastic.id === selectedId ? 'contained' : 'outlined'}
                  onClick={() => setSelectedId(plastic.id)}
                  sx={{ textTransform: 'none', borderRadius: '999px', minWidth: 72, fontWeight: 600 }}
                >
                  {resinCode(plastic) !== undefined && <span className="plasticsGuideCode">{resinCode(plastic)}</span>}
                  {plastic.name}
                </Button>
              ))}
            </div>

            {selected && (
              <div className="plasticsGuideDetail">
                <div className="plasticsGuideDetailHeader">
                  <h3>{selected.name}</h3>
                  {isAdmin && (
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => openDialog({ mode: 'edit', plastic: selected })}
                      sx={{ color: '#3D7844', textTransform: 'none' }}
                    >
                      {t.plasticsGuide.edit}
                    </Button>
                  )}
                </div>
                <p className={selected.description ? '' : 'plasticsGuideEmpty'}>
                  {selected.description || t.plasticsGuide.noDescription}
                </p>
              </div>
            )}
          </>
        )}
      </section>

      <Dialog open={dialog !== null} onClose={() => !saving && setDialog(null)} fullWidth maxWidth="sm">
        <DialogTitle>{dialog?.mode === 'edit' ? t.plasticsGuide.editTitle : t.plasticsGuide.addTitle}</DialogTitle>
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
              setDialogError('');
            }}
            error={!!dialogError && !name.trim()}
          />
          <TextField
            fullWidth
            multiline
            minRows={5}
            margin="dense"
            label={t.plasticsGuide.description}
            helperText={t.plasticsGuide.descriptionHelp}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          {dialogError && (
            <Typography color="error" sx={{ mt: 1 }}>
              {dialogError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialog(null)} disabled={saving} sx={{ color: '#3D7844', textTransform: 'none' }}>
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
    </div>
  );
};

export default PlasticsGuide;
