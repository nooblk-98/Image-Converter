import JSZip from 'jszip';

/**
 * Formats a size in bytes to a human-readable string (e.g. 2.4 MB)
 * @param {number} bytes 
 * @param {number} decimals 
 */
export function formatBytes(bytes, decimals = 1) {
  if (bytes === 0) return '0 Bytes';
  if (!bytes) return 'N/A';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Helper to download a single file in the browser
 * @param {Blob} blob 
 * @param {string} filename 
 */
export function downloadFile(blob, filename) {
  if (typeof window === 'undefined') return;
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Helper to zip and download multiple files in the browser
 * @param {Array<{blob: Blob, name: string}>} filesList 
 * @param {string} zipFilename 
 */
export async function downloadZip(filesList, zipFilename = 'converted-images.zip') {
  const zip = new JSZip();
  filesList.forEach((file) => {
    zip.file(file.name, file.blob);
  });
  const content = await zip.generateAsync({ type: 'blob' });
  downloadFile(content, zipFilename);
}

/**
 * Replaces extension of a filename
 * @param {string} filename 
 * @param {string} newExt 
 */
export function renameExtension(filename, newExt) {
  if (!filename) return '';
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1) return `${filename}.${newExt}`;
  return `${filename.substring(0, lastDotIndex)}.${newExt}`;
}
