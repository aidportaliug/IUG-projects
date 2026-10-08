// Shrinks a picture in the browser before upload, so project pictures stay small (typically a few hundred KB).

const MAX_SIDE = 1600;
// Must not be larger than MAX_IMAGE_MB on the backend (default 2).
export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
// Larger originals are refused before decoding, to avoid freezing the browser.
const MAX_ORIGINAL_BYTES = 15 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export type ImageErrorCode = 'notImage' | 'tooLarge' | 'unreadable';

export class ImageError extends Error {
  constructor(public readonly code: ImageErrorCode) {
    super(code);
  }
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new ImageError('unreadable'));
    };
    image.src = url;
  });
}

function toJpeg(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new ImageError('unreadable'))), 'image/jpeg', quality);
  });
}

/**
 * Returns the picture scaled to fit 1600×1600 px and re-encoded as JPEG (transparent areas become white).
 * Throws ImageError for files that are not JPEG/PNG/WebP, cannot be read, or stay above MAX_IMAGE_BYTES.
 */
export async function prepareImage(file: File): Promise<Blob> {
  if (!ACCEPTED_TYPES.includes(file.type)) throw new ImageError('notImage');
  if (file.size > MAX_ORIGINAL_BYTES) throw new ImageError('tooLarge');

  const image = await loadImage(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(image.naturalWidth, image.naturalHeight));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  const context = canvas.getContext('2d');
  if (!context) throw new ImageError('unreadable');
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  for (const quality of [0.82, 0.7, 0.55]) {
    const blob = await toJpeg(canvas, quality);
    if (blob.size <= MAX_IMAGE_BYTES) return blob;
  }
  throw new ImageError('tooLarge');
}

export function formatBytes(bytes: number): string {
  return bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
