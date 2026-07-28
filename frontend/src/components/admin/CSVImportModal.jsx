import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { UploadCloud, FileType, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

export default function CSVImportModal({ isOpen, onClose, onImport, entityType }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      parseCSV(selectedFile);
    }
  };

  const parseCSV = (file) => {
    setIsProcessing(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Send to backend for validation in a real app, but for now we simulate preview format
        const mockPreview = {
          totalRows: results.data.length,
          validRows: results.data.length,
          errorRows: 0,
          duplicateRows: 0,
          preview: results.data.map((row, idx) => ({
            _raw: row,
            index: idx,
            title: row.title || 'Untitled',
            isValid: !!row.title,
            errors: row.title ? [] : ['Title is required'],
            isDuplicate: false,
            action: 'Import'
          }))
        };
        setPreview(mockPreview);
        setIsProcessing(false);
      },
      error: (error) => {
        console.error("CSV Parse Error", error);
        setIsProcessing(false);
      }
    });
  };

  const handleActionChange = (index, newAction) => {
    const newPreviewData = [...preview.preview];
    newPreviewData[index].action = newAction;
    setPreview({ ...preview, preview: newPreviewData });
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleConfirm = () => {
    if (preview) {
      onImport(preview.preview);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Import ${entityType} via CSV`}
      className="max-w-4xl"
      footer={
        <div className="flex justify-between w-full">
          <Button onClick={reset} variant="secondary" disabled={!file || isProcessing}>Start Over</Button>
          <div className="flex gap-3">
            <Button onClick={handleClose} variant="secondary">Cancel</Button>
            <Button onClick={handleConfirm} disabled={!preview || isProcessing} className="bg-purple-600 hover:bg-purple-500 text-white">
              {isProcessing ? 'Processing...' : 'Confirm & Import'}
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {!file && (
          <div 
            className="border-2 border-dashed border-zinc-800 rounded-xl p-12 flex flex-col items-center justify-center text-center hover:border-purple-500/50 hover:bg-zinc-900/50 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloud size={48} className="text-zinc-600 mb-4" />
            <h3 className="text-base font-semibold text-zinc-200 mb-1">Click or drag CSV to upload</h3>
            <p className="text-sm text-zinc-500 max-w-sm">
              Your CSV must include headers. The first row will be treated as the header row.
            </p>
            <input 
              type="file" 
              accept=".csv" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
            />
          </div>
        )}

        {isProcessing && (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-sm text-zinc-400">Validating CSV data...</p>
          </div>
        )}

        {preview && !isProcessing && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg border border-zinc-800">
              <div className="flex items-center gap-3">
                <FileType size={24} className="text-purple-400" />
                <div>
                  <h4 className="text-sm font-semibold text-zinc-200">{file.name}</h4>
                  <p className="text-xs text-zinc-500">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
              <div className="flex gap-4 text-sm">
                <span className="text-green-400 flex items-center gap-1"><CheckCircle2 size={14}/> {preview.validRows} Valid</span>
                {preview.duplicateRows > 0 && <span className="text-amber-400 flex items-center gap-1"><AlertCircle size={14}/> {preview.duplicateRows} Conflicts</span>}
                {preview.errorRows > 0 && <span className="text-red-400 flex items-center gap-1"><XCircle size={14}/> {preview.errorRows} Errors</span>}
              </div>
            </div>

            <div className="border border-zinc-800 rounded-lg overflow-hidden max-h-[40vh] overflow-y-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-zinc-900 sticky top-0 z-10 border-b border-zinc-800 text-zinc-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Row</th>
                    <th className="px-4 py-3 font-medium">Title</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium text-right">Action (Conflicts)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {preview.preview.map((row, idx) => (
                    <tr key={idx} className={`hover:bg-zinc-900/30 ${!row.isValid ? 'bg-red-500/5 hover:bg-red-500/10' : row.isDuplicate ? 'bg-amber-500/5 hover:bg-amber-500/10' : ''}`}>
                      <td className="px-4 py-3 text-zinc-500">{row.index + 1}</td>
                      <td className="px-4 py-3 text-zinc-200">{row.title}</td>
                      <td className="px-4 py-3">
                        {!row.isValid ? (
                          <span className="text-xs text-red-400">{row.errors.join(', ')}</span>
                        ) : row.isDuplicate ? (
                          <span className="text-xs text-amber-400">Duplicate</span>
                        ) : (
                          <span className="text-xs text-green-400">Ready</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {row.isDuplicate ? (
                          <select 
                            value={row.action} 
                            onChange={(e) => handleActionChange(idx, e.target.value)}
                            className="bg-zinc-950 border border-amber-500/30 text-amber-400 text-xs rounded px-2 py-1 outline-none"
                          >
                            <option value="Skip">Skip</option>
                            <option value="Replace">Replace</option>
                            <option value="Duplicate">Import as Duplicate</option>
                          </select>
                        ) : (
                          <span className="text-xs text-zinc-500">Import</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
