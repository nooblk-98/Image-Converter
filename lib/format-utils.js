// Supported formats metadata
export const FORMATS = {
  PNG: 'png',
  JPG: 'jpg',
  JPEG: 'jpeg',
  WEBP: 'webp',
  GIF: 'gif',
  HEIC: 'heic',
  SVG: 'svg',
  AVIF: 'avif',
};

export const EXTENSION_TO_MIME = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  gif: 'image/gif',
  heic: 'image/heic',
  heif: 'image/heif',
  svg: 'image/svg+xml',
  avif: 'image/avif',
};

export const MIME_TO_EXTENSION = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/heic': 'heic',
  'image/heif': 'heic',
  'image/svg+xml': 'svg',
  'image/avif': 'avif',
};

// Map of what each input format can be converted to
// SVG is input-only (canvas cannot produce SVG)
export const SUPPORTED_CONVERSIONS = {
  png: ['webp', 'jpg', 'avif'],
  jpg: ['webp', 'png', 'avif'],
  jpeg: ['webp', 'png', 'avif'],
  webp: ['png', 'jpg', 'avif'],
  gif: ['webp', 'png', 'jpg', 'avif'],
  heic: ['jpg', 'webp', 'png', 'avif'],
  heif: ['jpg', 'webp', 'png', 'avif'],
  svg: ['png', 'jpg', 'webp', 'avif'],
  avif: ['png', 'jpg', 'webp'],
};

/**
 * Returns extension from file name
 * @param {string} filename 
 */
export function getFileExtension(filename) {
  if (!filename) return '';
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : '';
}

/**
 * Normalizes format name for display
 * @param {string} format 
 */
export function formatDisplayLabel(format) {
  if (!format) return '';
  const upper = format.toUpperCase();
  if (upper === 'JPEG') return 'JPG';
  return upper;
}

/**
 * Check if the input file format is supported
 * @param {string} extension 
 */
export function isFormatSupported(extension) {
  if (!extension) return false;
  const ext = extension.toLowerCase();
  return Object.values(FORMATS).includes(ext) || ext === 'heif';
}

/**
 * Returns true for formats that require special rendering (not raw canvas load)
 * @param {string} extension
 */
export function isSvgFormat(extension) {
  return extension?.toLowerCase() === 'svg';
}
