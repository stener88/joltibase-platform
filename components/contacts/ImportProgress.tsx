'use client';

import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface ImportProgressProps {
  isImporting: boolean;
  result?: {
    imported: number;
    updated: number;
    skipped: number;
    total: number;
    errors?: string[];
  };
}

export function ImportProgress({ isImporting, result }: ImportProgressProps) {
  if (isImporting) {
    return (
      <div className="text-center py-12">
        <svg
          className="animate-spin h-16 w-16 text-[#1a1aff] mx-auto mb-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Importing Contacts...
        </h3>
        <p className="text-gray-600">
          This may take a moment. Please don't close this page.
        </p>
      </div>
    );
  }

  if (result) {
    const hasErrors = result.errors && result.errors.length > 0;
    const isSuccess = result.imported + result.updated > 0;

    return (
      <div className="text-center py-12">
        <div className="mb-6">
          {isSuccess ? (
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
          ) : (
            <XCircle className="w-16 h-16 text-red-600 mx-auto" />
          )}
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Import {isSuccess ? 'Complete' : 'Failed'}
        </h3>

        <div className="max-w-md mx-auto space-y-3 mb-8">
          {result.imported > 0 && (
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <span className="text-sm font-medium text-green-900">Imported</span>
              <span className="text-lg font-bold text-green-900">{result.imported}</span>
            </div>
          )}
          
          {result.updated > 0 && (
            <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <span className="text-sm font-medium text-blue-900">Updated</span>
              <span className="text-lg font-bold text-blue-900">{result.updated}</span>
            </div>
          )}
          
          {result.skipped > 0 && (
            <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <span className="text-sm font-medium text-yellow-900">Skipped</span>
              <span className="text-lg font-bold text-yellow-900">{result.skipped}</span>
            </div>
          )}
        </div>

        {hasErrors && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-left">
                  <h4 className="text-sm font-semibold text-red-900 mb-2">
                    {result.errors!.length} Error{result.errors!.length !== 1 ? 's' : ''} Occurred
                  </h4>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {result.errors!.map((error, idx) => (
                      <p key={idx} className="text-xs text-red-800">
                        {error}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}

