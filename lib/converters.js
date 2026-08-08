import { EXTENSION_TO_MIME } from './format-utils';

/**
 * Helper to load an image from a URL
 * @param {string} url 
 * @returns {Promise<HTMLImageElement>}
 */
function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image. The file might be corrupted.'));
    img.src = url;
  });
}

/**
 * Converts a standard image file (PNG, JPG, WEBP, GIF) using Canvas
 * @param {File} file 
 * @param {string} targetFormat 
 * @param {number} quality (0 to 100)
 * @returns {Promise<Blob>}
 */
async function convertViaCanvas(file, targetFormat, quality) {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get 2D context from canvas');
    }

    // Handle transparent background when converting to JPEG/JPG (defaults to white background)
    if (targetFormat === 'jpg' || targetFormat === 'jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.drawImage(img, 0, 0);

    const mimeType = EXTENSION_TO_MIME[targetFormat] || `image/${targetFormat}`;
    const qValue = quality / 100; // Convert 0-100 to 0-1

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Image conversion failed. Canvas export returned null.'));
        }
      }, mimeType, qValue);
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * Converts a HEIC file using heic2any
 * @param {File} file 
 * @param {string} targetFormat 
 * @param {number} quality (0 to 100)
 * @returns {Promise<Blob>}
 */
async function convertHeic(file, targetFormat, quality) {
  // Dynamically import heic2any only when needed
  const heic2anyModule = await import('heic2any');
  const heic2any = heic2anyModule.default || heic2anyModule;

  const mimeType = EXTENSION_TO_MIME[targetFormat] || `image/${targetFormat}`;
  const qValue = quality / 100;

  const result = await heic2any({
    blob: file,
    toType: mimeType,
    quality: qValue,
  });

  if (Array.isArray(result)) {
    return result[0];
  }
  return result;
}

/**
 * Orchestrates the conversion of any supported image file
 * @param {File} file 
 * @param {string} targetFormat 
 * @param {number} quality (0 to 100)
 * @returns {Promise<Blob>}
 */
export async function convertImage(file, targetFormat, quality = 80) {
  const extension = file.name.split('.').pop().toLowerCase();
  
  if (extension === 'heic' || extension === 'heif') {
    return convertHeic(file, targetFormat, quality);
  } else {
    return convertViaCanvas(file, targetFormat, quality);
  }
}
