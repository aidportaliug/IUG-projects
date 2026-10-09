import React, { useRef, useState } from 'react';
import { Button, FormHelperText, Typography } from '@mui/material';
import { formatBytes, ImageError, prepareImage } from '../../services/imageResize';
import { useI18n } from '../../i18n/I18nContext';
import '../UploadPlasticProjectForm/uploadPlasticProjectForm.css';

interface PicturePickerProps {
  // Field label; omit when the picture is already shown nearby (e.g. on the machine page).
  label?: string;
  // The picture shown right now (URL); undefined shows "Choose picture" instead of "Replace".
  image?: string;
  showThumbnail?: boolean;
  // Called with the shrunk picture (JPEG, at most 1600 px and 2 MB).
  onPicked: (picture: Blob) => void | Promise<void>;
  onRemove?: () => void | Promise<void>;
  busy?: boolean;
  // Byte size of a picked picture, shown instead of the hint.
  pickedSize?: number;
  error?: string;
}

// Choose / replace / remove a picture. Pictures are shrunk in the browser before they are handed on.
const PicturePicker: React.FC<PicturePickerProps> = (props) => {
  const { label, image, showThumbnail = true, onPicked, onRemove, busy, pickedSize } = props;
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preparing, setPreparing] = useState(false);
  const [pickError, setPickError] = useState('');

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setPickError('');
    setPreparing(true);
    try {
      await onPicked(await prepareImage(file));
    } catch (error) {
      const code = error instanceof ImageError ? error.code : null;
      setPickError(
        code === 'notImage'
          ? t.projectForm.pictureNotImage
          : code === 'tooLarge'
          ? t.projectForm.pictureTooLarge
          : code === 'unreadable'
          ? t.projectForm.pictureUnreadable
          : (error as Error).message
      );
    } finally {
      setPreparing(false);
    }
  };

  const working = preparing || !!busy;
  const error = pickError || props.error;

  return (
    <div className="projectFormPicture">
      {label && <span className="projectFormPictureLabel">{label}</span>}
      {showThumbnail && image && <img className="projectFormPictureThumb" src={image} alt="" />}
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: 'none' }}
        ref={inputRef}
        onChange={handleChange}
      />
      <div className="projectFormPictureButtons">
        <Button
          variant="outlined"
          className="projectFormAddButton"
          disabled={working}
          onClick={() => inputRef.current?.click()}
          sx={{ color: '#3D7844', borderColor: '#9fc4a3', textTransform: 'none' }}
        >
          {working
            ? t.projectForm.preparingPicture
            : image
            ? t.projectForm.replacePicture
            : t.projectForm.choosePicture}
        </Button>
        {image && onRemove && (
          <Button color="error" disabled={working} onClick={() => onRemove()} sx={{ textTransform: 'none' }}>
            {t.projectForm.removePicture}
          </Button>
        )}
      </div>
      <FormHelperText>
        {pickedSize !== undefined ? t.projectForm.pictureSize(formatBytes(pickedSize)) : t.projectForm.pictureHint}
      </FormHelperText>
      {error && <Typography color="error">{error}</Typography>}
    </div>
  );
};

export default PicturePicker;
