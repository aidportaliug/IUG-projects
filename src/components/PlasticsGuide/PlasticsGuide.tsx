import React, { useCallback, useEffect, useState } from 'react';
import { Button, CircularProgress, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { Link } from 'react-router-dom';
import {
  deleteSiteImage,
  getPlastics,
  getSiteImageHref,
  getSiteTexts,
  SiteTexts,
  PlasticResponse,
  plasticImageHref,
  uploadSiteImage,
} from '../../services/plasticService';
import { useAuth } from '../../services/AuthContext';
import { useI18n } from '../../i18n/I18nContext';
import guideEn from '../../images/plastic-identification-en.svg';
import guideNb from '../../images/plastic-identification-nb.svg';
import GuideTextsDialog from './GuideTextsDialog';
import PlasticEditDialog from './PlasticEditDialog';
import ImageZoom from './ImageZoom';
import PicturePicker from '../PicturePicker/PicturePicker';
import './plasticsGuide.css';

// Plastics tab: every plastic in the database (by resin code), then how to identify plastics.
const PlasticsGuide: React.FC = () => {
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const isAdmin = !!user?.isAdmin;
  const [plastics, setPlastics] = useState<PlasticResponse[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  // Admin dialog: closed, adding (undefined plastic) or editing a plastic.
  const [dialog, setDialog] = useState<{ plastic?: PlasticResponse } | null>(null);

  // Identification guide: the admin's uploaded picture, or the built-in chart.
  const [guideUrl, setGuideUrl] = useState<string | undefined>(undefined);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [savingGuide, setSavingGuide] = useState(false);
  const [guideError, setGuideError] = useState('');
  // Title and text of the guide as changed by the admin (per language); missing ones use the translations.
  const [guideTexts, setGuideTexts] = useState<SiteTexts>({});
  const [editingTexts, setEditingTexts] = useState(false);

  const loadPlastics = useCallback(async (selectId?: number) => {
    try {
      // The API returns the plastics sorted by resin code.
      const response = await getPlastics(undefined, 1, 100);
      setPlastics(response.plastics);
      setSelectedId((current) => selectId ?? current ?? response.plastics[0]?.id ?? null);
      setLoadError(null);
    } catch (error: any) {
      setLoadError(error.message || '');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlastics();
    getSiteImageHref('plastic-identification')
      .then(setGuideUrl)
      .catch(() => setGuideUrl(undefined));
    getSiteTexts()
      .then(setGuideTexts)
      .catch(() => setGuideTexts({}));
  }, [loadPlastics]);

  const selected = plastics.find((plastic) => plastic.id === selectedId);
  // An uploaded chart replaces the built-in one (a sharp vector drawing in the page's language).
  const guideSrc = guideUrl ?? (lang === 'nb' ? guideNb : guideEn);
  const guideTitle = guideTexts[`plastic-identification.title.${lang}`] || t.plasticsGuide.identifyTitle;
  const guideText = guideTexts[`plastic-identification.text.${lang}`] || t.plasticsGuide.identifyHint;
  const selectedPicture = selected ? plasticImageHref(selected) : undefined;

  const changeGuide = async (change: () => Promise<string | undefined>) => {
    setGuideError('');
    setSavingGuide(true);
    try {
      setGuideUrl(await change());
    } catch (error: any) {
      setGuideError(error.message || t.plasticsGuide.guideFailed);
    } finally {
      setSavingGuide(false);
    }
  };

  return (
    <div className="plasticsGuide">
      {/* 1. The plastics in the database */}
      <section className="plasticsGuideCard">
        <div className="plasticsGuideHeader">
          <h2>{t.plasticsGuide.listTitle}</h2>
          {isAdmin && (
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setDialog({})}
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
                  {plastic.resinCode ? <span className="plasticsGuideCode">{plastic.resinCode}</span> : null}
                  {plastic.name}
                </Button>
              ))}
            </div>

            {selected && (
              <div className="plasticsGuideDetail">
                {selectedPicture && (
                  <img className="plasticsGuideDetailImage" src={selectedPicture} alt={selected.name} />
                )}
                <div className="plasticsGuideDetailText">
                  <div className="plasticsGuideDetailHeader">
                    <h3>{selected.name}</h3>
                    {isAdmin && (
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => setDialog({ plastic: selected })}
                        sx={{ color: '#3D7844', textTransform: 'none' }}
                      >
                        {t.plasticsGuide.edit}
                      </Button>
                    )}
                  </div>
                  {selected.resinCode ? (
                    <p className="plasticsGuideMeta">{t.plasticsGuide.resinCodeValue(selected.resinCode)}</p>
                  ) : null}
                  <p className={selected.description ? '' : 'plasticsGuideEmpty'}>
                    {selected.description || t.plasticsGuide.noDescription}
                  </p>
                  <Link className="plasticsGuideLink" to={`/plastic/${selected.id}`}>
                    {t.plasticsGuide.openPage}
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* 2. How to identify plastics */}
      <section className="plasticsGuideCard">
        <h2>{guideTitle}</h2>
        <p className="plasticsGuideHint">{guideText}</p>
        <button
          type="button"
          className="plasticsGuideImageButton"
          onClick={() => setZoomOpen(true)}
          title={t.plasticsGuide.zoom}
        >
          <img className="plasticsGuideImage" src={guideSrc} alt={t.plasticsGuide.identifyAlt} />
          <span className="plasticsGuideZoomHint">
            <ZoomInIcon fontSize="small" /> {t.plasticsGuide.zoom}
          </span>
        </button>
        {isAdmin && (
          <div className="plasticsGuideAdmin">
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => setEditingTexts(true)}
              sx={{ color: '#3D7844', borderColor: '#3D7844', textTransform: 'none', borderRadius: '8px', mb: '22px' }}
            >
              {t.plasticsGuide.editTexts}
            </Button>
            <PicturePicker
              label={t.plasticsGuide.replaceGuide}
              image={guideUrl}
              showThumbnail={false}
              busy={savingGuide}
              error={guideError}
              onPicked={(picked) => changeGuide(() => uploadSiteImage('plastic-identification', picked))}
            />
            {guideUrl && (
              <Button
                disabled={savingGuide}
                onClick={() =>
                  changeGuide(async () => {
                    await deleteSiteImage('plastic-identification');
                    return undefined;
                  })
                }
                sx={{ color: '#3D7844', textTransform: 'none' }}
              >
                {t.plasticsGuide.useDefaultGuide}
              </Button>
            )}
          </div>
        )}
      </section>

      <GuideTextsDialog
        open={editingTexts}
        texts={guideTexts}
        onClose={() => setEditingTexts(false)}
        onSaved={(texts) => {
          setGuideTexts(texts);
          setEditingTexts(false);
        }}
      />

      <ImageZoom src={guideSrc} alt={t.plasticsGuide.identifyAlt} open={zoomOpen} onClose={() => setZoomOpen(false)} />

      <PlasticEditDialog
        open={dialog !== null}
        plastic={dialog?.plastic}
        onClose={() => setDialog(null)}
        onSaved={(plasticId) => {
          setDialog(null);
          loadPlastics(plasticId);
        }}
      />
    </div>
  );
};

export default PlasticsGuide;
