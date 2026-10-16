import React from 'react';
import { Dialog, IconButton, useMediaQuery } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useI18n } from '../../i18n/I18nContext';

interface ImageZoomProps {
  src: string;
  alt: string;
  open: boolean;
  onClose: () => void;
}

// Shows a picture large on the same page (no new window). Closes with the button, a click or Esc.
const ImageZoom: React.FC<ImageZoomProps> = ({ src, alt, open, onClose }) => {
  const { t } = useI18n();
  const isPhone = useMediaQuery('(max-width:600px)');

  return (
    <Dialog open={open} onClose={onClose} maxWidth={false} fullScreen={isPhone} aria-label={alt}>
      <IconButton
        onClick={onClose}
        aria-label={t.plasticsGuide.closeZoom}
        title={t.plasticsGuide.closeZoom}
        sx={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(255,255,255,0.85)', zIndex: 1 }}
      >
        <CloseIcon />
      </IconButton>
      {/* Full size, scrollable when larger than the screen */}
      <div className="imageZoomBody" onClick={onClose}>
        <img src={src} alt={alt} className="imageZoomImage" />
      </div>
    </Dialog>
  );
};

export default ImageZoom;
