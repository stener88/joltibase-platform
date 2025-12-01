'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';

interface ExportButtonProps {
  label: string;
  endpoint: string;
  filename?: string;
}

export function ExportButton({ label, endpoint, filename }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error('Export failed');
      }

      // Get the blob data
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `export-${new Date().toISOString().split('T')[0]}.csv`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center gap-2 px-4 py-2 bg-card border border-border text-foreground700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Download className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
      {isExporting ? 'Exporting...' : label}
    </button>
  );
}

