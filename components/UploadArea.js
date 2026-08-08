'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { getFileExtension, formatDisplayLabel } from '../lib/format-utils';

export default function UploadArea({ onFilesSelected, acceptFormat }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

  // Reset error when format changes
  useEffect(() => {
    setError(null);
  }, [acceptFormat]);

  // Determine standard file extensions based on selected source format
  const getAcceptedExtensions = () => {
    const format = acceptFormat?.toLowerCase();
    if (format === 'jpg' || format === 'jpeg') {
      return ['jpg', 'jpeg'];
    }
    if (format === 'heic') {
      return ['heic', 'heif'];
    }
    return [format];
  };

  const validateAndProcessFiles = (files) => {
    setError(null);
    const validFiles = [];
    const errors = [];
    const allowedExts = getAcceptedExtensions();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const extension = getFileExtension(file.name);

      if (!allowedExts.includes(extension)) {
        errors.push(`Unsupported file format. Please upload ${formatDisplayLabel(acceptFormat)}.`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        errors.push(`"${file.name}" exceeds the 20 MB file size limit.`);
        continue;
      }

      validFiles.push(file);
    }

    if (errors.length > 0) {
      setError(errors[0]); // Show the first error
    }

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFiles(e.target.files);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  const formatAcceptStr = getAcceptedExtensions().map(ext => `.${ext}`).join(',');

  return (
    <div className="w-full">
      <div
        className={`relative flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? 'border-indigo-500 bg-indigo-50/30 scale-[0.99] shadow-inner'
            : 'border-gray-200 hover:border-indigo-400 bg-white hover:bg-gray-50/50 shadow-sm'
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple
          accept={formatAcceptStr}
          onChange={handleFileChange}
          key={acceptFormat} // reset DOM element on format switch
        />

        <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-indigo-50 text-indigo-600 mb-6 shadow-sm">
          <Upload className="h-8 w-8" />
        </div>

        <p className="text-xl font-bold text-gray-900 mb-2">
          Drag & drop your {formatDisplayLabel(acceptFormat)} images here
        </p>
        <p className="text-sm text-gray-400 mb-6 font-medium">or</p>
        
        <button
          type="button"
          className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow transition duration-150"
        >
          Choose Images
        </button>

        <div className="mt-8 pt-6 border-t border-gray-100 w-full max-w-md flex flex-col space-y-1.5 text-xs text-gray-400 font-medium">
          <p>Supported input format: {formatDisplayLabel(acceptFormat)}</p>
          <p>Maximum file size: 20 MB per image</p>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start space-x-3 text-rose-700 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <span className="font-semibold">{error}</span>
        </div>
      )}
    </div>
  );
}
