'use client';

import { useCallback, useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';

interface CSVUploaderProps {
  onFileLoad: (data: string[][], filename: string) => void;
}

export function CSVUploader({ onFileLoad }: CSVUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

  const parseCSV = (text: string): string[][] => {
    const lines = text.split('\n').filter(line => line.trim());
    return lines.map(line => {
      const values: string[] = [];
      let current = '';
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      
      values.push(current.trim());
      return values;
    });
  };

  const handleFile = useCallback((file: File) => {
    setError('');
    
    // Validate file type
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setFile(file);

    // Read file
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = parseCSV(text);
        
        if (data.length === 0) {
          setError('CSV file is empty');
          return;
        }

        onFileLoad(data, file.name);
      } catch (err) {
        console.error('CSV parse error:', err);
        setError('Failed to parse CSV file');
      }
    };
    reader.readAsText(file);
  }, [onFileLoad]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFile(droppedFile);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFile(selectedFile);
    }
  }, [handleFile]);

  const handleRemove = () => {
    setFile(null);
    setError('');
  };

  return (
    <div>
      {!file ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            isDragging
              ? 'border-[#e9a589] bg-[#e9a589]/5'
              : 'border-[#e8e7e5] hover:border-[#3d3d3a]'
          }`}
        >
          <div className="flex flex-col items-center">
            <Upload className={`w-12 h-12 mb-4 ${isDragging ? 'text-[#e9a589]' : 'text-[#6b6b6b]'}`} />
            <p className="text-lg font-medium text-[#3d3d3a] mb-2">
              Drop your CSV file here
            </p>
            <p className="text-sm text-[#6b6b6b] mb-4">
              or click to browse
            </p>
            <label className="px-6 py-2.5 bg-[#141413] text-white rounded-lg hover:bg-[#3d3d3a] cursor-pointer transition-colors">
              Choose File
              <input
                type="file"
                accept=".csv"
                onChange={handleFileInput}
                className="hidden"
              />
            </label>
            <p className="text-xs text-[#6b6b6b] mt-4">
              Maximum file size: 10MB
            </p>
          </div>
        </div>
      ) : (
        <div className="border-2 border-green-200 bg-green-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-green-600" />
              <div>
                <p className="font-medium text-[#3d3d3a]">{file.name}</p>
                <p className="text-sm text-[#6b6b6b]">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <button
              onClick={handleRemove}
              className="p-2 text-[#6b6b6b] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
    </div>
  );
}

