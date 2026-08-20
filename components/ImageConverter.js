'use client';

import { useState, useEffect } from 'react';
import { 
  FileImage, Trash2, Download, CheckCircle, 
  RefreshCw, Play, FolderArchive, ArrowRight, ArrowRightLeft 
} from 'lucide-react';
import UploadArea from './UploadArea';
import { convertImage } from '../lib/converters';
import { formatBytes, downloadFile, downloadZip, renameExtension } from '../lib/file-utils';
import { SUPPORTED_CONVERSIONS, getFileExtension, formatDisplayLabel } from '../lib/format-utils';

export default function ImageConverter() {
  const [sourceFormat, setSourceFormat] = useState('png');
  const [targetFormat, setTargetFormat] = useState('webp');
  const [files, setFiles] = useState([]);
  const [quality, setQuality] = useState(80);
  const [isConvertingAll, setIsConvertingAll] = useState(false);

  // Get available target formats based on source format selection
  const availableTargets = SUPPORTED_CONVERSIONS[sourceFormat] || [];

  // Sync target format if selected source format changes and current target is no longer supported
  useEffect(() => {
    if (!availableTargets.includes(targetFormat)) {
      setTargetFormat(availableTargets[0] || 'webp');
    }
    // Clear existing files since the input type changed
    clearAll();
  }, [sourceFormat]);

  const handleFilesSelected = (newFiles) => {
    const formatted = Array.from(newFiles).map((file) => {
      const extension = getFileExtension(file.name);
      const isHeic = extension === 'heic' || extension === 'heif';
      const previewUrl = isHeic ? null : URL.createObjectURL(file);

      return {
        id: Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
        size: file.size,
        extension,
        status: 'idle', // idle, converting, success, error
        errorMsg: null,
        convertedBlob: null,
        convertedSize: null,
        reduction: null,
        previewUrl
      };
    });

    setFiles((prev) => [...prev, ...formatted]);
  };

  const removeFile = (id) => {
    setFiles((prev) => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove && fileToRemove.previewUrl) {
        URL.revokeObjectURL(fileToRemove.previewUrl);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const clearAll = () => {
    files.forEach(f => {
      if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
    });
    setFiles([]);
  };

  const convertSingle = async (id) => {
    const fileItem = files.find(f => f.id === id);
    if (!fileItem) return;

    setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'converting', errorMsg: null } : f));

    try {
      const blob = await convertImage(fileItem.file, targetFormat, quality);
      const reduction = fileItem.size > blob.size 
        ? ((fileItem.size - blob.size) / fileItem.size * 100).toFixed(1)
        : 0;

      let updatedPreview = fileItem.previewUrl;
      if (fileItem.extension === 'heic' || fileItem.extension === 'heif') {
        updatedPreview = URL.createObjectURL(blob);
      }

      setFiles(prev => prev.map(f => f.id === id ? {
        ...f,
        status: 'success',
        convertedBlob: blob,
        convertedSize: blob.size,
        reduction: parseFloat(reduction),
        previewUrl: updatedPreview
      } : f));
    } catch (err) {
      setFiles(prev => prev.map(f => f.id === id ? {
        ...f,
        status: 'error',
        errorMsg: err.message || 'Conversion failed'
      } : f));
    }
  };

  const convertAll = async () => {
    setIsConvertingAll(true);
    const unconverted = files.filter(f => f.status !== 'success');
    for (const f of unconverted) {
      await convertSingle(f.id);
    }
    setIsConvertingAll(false);
  };

  const downloadSingle = (fileItem) => {
    if (!fileItem.convertedBlob) return;
    const outputName = renameExtension(fileItem.name, targetFormat);
    downloadFile(fileItem.convertedBlob, outputName);
  };

  const downloadAll = async () => {
    const convertedFiles = files.filter(f => f.status === 'success' && f.convertedBlob);
    if (convertedFiles.length === 0) return;

    if (convertedFiles.length === 1) {
      downloadSingle(convertedFiles[0]);
      return;
    }

    const zipList = convertedFiles.map(f => ({
      blob: f.convertedBlob,
      name: renameExtension(f.name, targetFormat)
    }));

    await downloadZip(zipList, `converted-${sourceFormat}-to-${targetFormat}.zip`);
  };

  const showQualityControl = ['webp', 'jpg', 'jpeg', 'avif'].includes(targetFormat);
  const totalConverted = files.filter(f => f.status === 'success').length;
  const hasFiles = files.length > 0;

  return (
    <div className="w-full max-w-4xl mx-auto">
      
      {/* Format Selection Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-6 sm:p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
          
          {/* Source Format Dropdown */}
          <div className="w-full md:w-auto flex-1 max-w-xs">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Convert From</label>
            <select
              value={sourceFormat}
              onChange={(e) => setSourceFormat(e.target.value)}
              className="block w-full rounded-2xl border-2 border-gray-100 bg-white py-3.5 px-4 text-base font-bold text-gray-800 focus:border-indigo-500 focus:outline-none transition"
            >
              <option value="png">PNG</option>
              <option value="jpg">JPG / JPEG</option>
              <option value="webp">WEBP</option>
              <option value="gif">GIF</option>
              <option value="heic">HEIC</option>
              <option value="svg">SVG</option>
              <option value="avif">AVIF</option>
            </select>
          </div>

          {/* Indicator Icon */}
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-50 text-indigo-600 mt-4 md:mt-6">
            <ArrowRightLeft className="h-5 w-5" />
          </div>

          {/* Target Format Dropdown */}
          <div className="w-full md:w-auto flex-1 max-w-xs">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Convert To</label>
            <select
              value={targetFormat}
              onChange={(e) => setTargetFormat(e.target.value)}
              className="block w-full rounded-2xl border-2 border-gray-100 bg-white py-3.5 px-4 text-base font-bold text-gray-800 focus:border-indigo-500 focus:outline-none transition"
            >
              {availableTargets.map((target) => (
                <option key={target} value={target}>
                  {target.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Quality control inside selection card */}
        {showQualityControl && (
          <div className="max-w-md mx-auto mt-6 pt-6 border-t border-gray-100">
            <div className="flex justify-between mb-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Quality</label>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{quality}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={quality}
              onChange={(e) => setQuality(parseInt(e.target.value))}
              className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] font-semibold text-gray-400 mt-1">
              <span>High Compression (Small File)</span>
              <span>High Quality (Large File)</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Workspace */}
      {!hasFiles ? (
        <UploadArea onFilesSelected={handleFilesSelected} acceptFormat={sourceFormat} />
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden transition-all duration-300">
          
          {/* Action Header */}
          <div className="p-6 bg-gray-50/70 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs font-bold text-gray-500 font-mono">
              Selected files: {files.length}
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center px-4 py-2 border border-gray-200 text-sm font-semibold rounded-xl text-gray-600 bg-white hover:bg-gray-50 shadow-sm transition"
              >
                Clear All
              </button>
              
              {totalConverted < files.length ? (
                <button
                  type="button"
                  disabled={isConvertingAll}
                  onClick={convertAll}
                  className="inline-flex items-center px-5 py-2.5 text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg disabled:bg-indigo-400 transition"
                >
                  {isConvertingAll ? (
                    <>
                      <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Converting...
                    </>
                  ) : (
                    <>
                      <Play className="-ml-1 mr-2 h-4 w-4 fill-current" />
                      Convert All
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={downloadAll}
                  className="inline-flex items-center px-5 py-2.5 text-sm font-semibold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 shadow-md hover:shadow-lg transition"
                >
                  <FolderArchive className="-ml-1 mr-2 h-4 w-4" />
                  Download All ({files.length})
                </button>
              )}
            </div>
          </div>

          {/* Files list */}
          <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
            {files.map((fileItem) => (
              <div key={fileItem.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/30 transition">
                
                {/* Thumbnail & Info */}
                <div className="flex items-center space-x-4 min-w-0">
                  <div className="relative h-14 w-14 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                    {fileItem.previewUrl ? (
                      <img 
                        src={fileItem.previewUrl} 
                        alt={fileItem.name} 
                        className="h-full w-full object-cover" 
                      />
                    ) : (
                      <FileImage className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                      {fileItem.name}
                    </p>
                    <div className="flex items-center space-x-2 mt-1 text-xs text-gray-400 font-medium">
                      <span className="uppercase text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                        {formatDisplayLabel(fileItem.extension)}
                      </span>
                      <span>•</span>
                      <span>{formatBytes(fileItem.size)}</span>
                    </div>
                  </div>
                </div>

                {/* Conversion Status & Action */}
                <div className="flex items-center justify-between sm:justify-end gap-6">
                  {fileItem.status === 'success' ? (
                    <div className="text-right text-xs shrink-0 font-semibold">
                      <div className="flex items-center text-emerald-600 font-bold mb-1">
                        <CheckCircle className="h-4 w-4 mr-1.5 shrink-0" />
                        Converted successfully
                      </div>
                      <div className="text-gray-500">
                        Size: <span className="text-gray-900 font-bold">{formatBytes(fileItem.convertedSize)}</span>
                        {fileItem.reduction > 0 && (
                          <span className="text-emerald-600 font-bold ml-1.5 bg-emerald-50 px-1.5 py-0.5 rounded">
                            Reduced {fileItem.reduction}%
                          </span>
                        )}
                      </div>
                    </div>
                  ) : fileItem.status === 'error' ? (
                    <div className="text-xs text-rose-600 font-semibold max-w-[180px]">
                      <p className="font-bold">Conversion failed</p>
                      <p className="text-[10px] text-rose-500 line-clamp-2 mt-0.5">{fileItem.errorMsg}</p>
                    </div>
                  ) : (
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Ready for conversion
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    {fileItem.status === 'success' ? (
                      <button
                        type="button"
                        onClick={() => downloadSingle(fileItem)}
                        className="inline-flex items-center p-2 rounded-xl text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border border-emerald-100 shadow-sm transition"
                        title="Download file"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={fileItem.status === 'converting'}
                        onClick={() => convertSingle(fileItem.id)}
                        className="inline-flex items-center p-2 rounded-xl text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 border border-indigo-100 shadow-sm disabled:opacity-50 transition"
                        title="Convert file"
                      >
                        {fileItem.status === 'converting' ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <ArrowRight className="h-4 w-4" />
                        )}
                      </button>
                    )}

                    <button
                      type="button"
                      disabled={fileItem.status === 'converting'}
                      onClick={() => removeFile(fileItem.id)}
                      className="inline-flex items-center p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition"
                      title="Remove file"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Quick upload slot */}
          <div className="p-4 bg-gray-50/30 border-t border-gray-100 text-center">
            <label className="inline-flex items-center justify-center px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 bg-white hover:bg-gray-50 shadow-sm cursor-pointer transition">
              <input
                type="file"
                className="hidden"
                multiple
                accept={
                  sourceFormat === 'jpg' ? '.jpg,.jpeg' 
                  : sourceFormat === 'heic' ? '.heic,.heif' 
                  : `.${sourceFormat}`
                }
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFilesSelected(e.target.files);
                  }
                }}
              />
              Add More Images
            </label>
          </div>

        </div>
      )}
    </div>
  );
}
