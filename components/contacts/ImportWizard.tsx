'use client';

import { useState } from 'react';
import { CSVUploader } from './CSVUploader';
import { FieldMapper } from './FieldMapper';
import { ImportProgress } from './ImportProgress';
import { CheckCircle } from 'lucide-react';

interface ImportWizardProps {
  onComplete: () => void;
}

type Step = 'upload' | 'map' | 'import';

export function ImportWizard({ onComplete }: ImportWizardProps) {
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [filename, setFilename] = useState('');
  const [mapping, setMapping] = useState<Record<string, number>>({});
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);

  const handleFileLoad = (data: string[][], name: string) => {
    setCsvData(data);
    setFilename(name);
    
    // Auto-detect email column
    const headers = data[0].map(h => h.toLowerCase());
    const emailIdx = headers.findIndex(h => h.includes('email') || h.includes('e-mail'));
    const firstNameIdx = headers.findIndex(h => h.includes('first') && h.includes('name'));
    const lastNameIdx = headers.findIndex(h => h.includes('last') && h.includes('name'));
    
    const autoMapping: Record<string, number> = {};
    if (emailIdx !== -1) autoMapping.email = emailIdx;
    if (firstNameIdx !== -1) autoMapping.firstName = firstNameIdx;
    if (lastNameIdx !== -1) autoMapping.lastName = lastNameIdx;
    
    setMapping(autoMapping);
    setCurrentStep('map');
  };

  const handleImport = async () => {
    if (!mapping.email) {
      alert('Email field mapping is required');
      return;
    }

    setCurrentStep('import');
    setIsImporting(true);

    try {
      // Skip header row, process data rows
      const dataRows = csvData.slice(1);
      
      const contacts = dataRows.map(row => {
        const contact: any = {
          email: row[mapping.email]?.trim(),
        };
        
        if (mapping.firstName !== undefined) {
          contact.firstName = row[mapping.firstName]?.trim() || '';
        }
        if (mapping.lastName !== undefined) {
          contact.lastName = row[mapping.lastName]?.trim() || '';
        }
        if (mapping.tags !== undefined) {
          const tagsStr = row[mapping.tags]?.trim() || '';
          contact.tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(Boolean) : [];
        }
        
        return contact;
      }).filter(c => c.email); // Filter out rows without email

      const response = await fetch('/api/contacts/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contacts,
          duplicateHandling: 'skip',
        }),
      });

      const result = await response.json();

      if (result.success) {
        setImportResult(result.data);
      } else {
        setImportResult({
          imported: 0,
          updated: 0,
          skipped: 0,
          total: contacts.length,
          errors: [result.error || 'Import failed'],
        });
      }
    } catch (error) {
      console.error('Import error:', error);
      setImportResult({
        imported: 0,
        updated: 0,
        skipped: 0,
        total: 0,
        errors: ['An unexpected error occurred'],
      });
    } finally {
      setIsImporting(false);
    }
  };

  const steps = [
    { key: 'upload', label: 'Upload CSV', completed: currentStep !== 'upload' },
    { key: 'map', label: 'Map Fields', completed: currentStep === 'import' },
    { key: 'import', label: 'Import', completed: false },
  ];

  return (
    <div>
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {steps.map((step, idx) => (
            <div key={step.key} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  step.completed || currentStep === step.key
                    ? 'bg-[#141413] border-[#141413] text-white'
                    : 'bg-card border-[#e8e7e5] text-[#6b6b6b]'
                }`}>
                  {step.completed ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-semibold">{idx + 1}</span>
                  )}
                </div>
                <span className={`text-sm mt-2 font-medium ${
                  currentStep === step.key ? 'text-[#3d3d3a]' : 'text-[#6b6b6b]'
                }`}>
                  {step.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`h-0.5 flex-1 -mt-8 ${
                  step.completed ? 'bg-[#141413]' : 'bg-[#e8e7e5]'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-card rounded-lg border border-[#e8e7e5] p-8">
        {currentStep === 'upload' && (
          <div>
            <h2 className="text-2xl font-bold text-[#3d3d3a] mb-4">Upload CSV File</h2>
            <p className="text-[#6b6b6b] mb-6">
              Upload a CSV file containing your contacts. The file should include at least an email column.
            </p>
            <CSVUploader onFileLoad={handleFileLoad} />
          </div>
        )}

        {currentStep === 'map' && csvData.length > 0 && (
          <div>
            <FieldMapper
              headers={csvData[0]}
              previewData={csvData.slice(1)}
              mapping={mapping}
              onMappingChange={setMapping}
            />
            
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#e8e7e5]">
              <button
                onClick={() => setCurrentStep('upload')}
                className="px-6 py-2.5 bg-card border-2 border-[#e8e7e5] text-[#3d3d3a] rounded-lg hover:border-[#3d3d3a] transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleImport}
                disabled={!mapping.email}
                className="px-6 py-2.5 bg-[#141413] text-white rounded-lg hover:bg-[#3d3d3a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Import {csvData.length - 1} Contacts
              </button>
            </div>
          </div>
        )}

        {currentStep === 'import' && (
          <div>
            <ImportProgress isImporting={isImporting} result={importResult} />
            
            {!isImporting && importResult && (
              <div className="flex justify-center">
                <button
                  onClick={onComplete}
                  className="px-8 py-3 bg-[#141413] text-white rounded-lg hover:bg-[#3d3d3a] transition-colors"
                >
                  View Contacts
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

