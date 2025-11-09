'use client';

import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ImportWizard } from '@/components/contacts/ImportWizard';
import { ArrowLeft } from 'lucide-react';

export default function ImportContactsPage() {
  const router = useRouter();

  const handleComplete = () => {
    router.push('/dashboard/contacts');
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Import Contacts</h1>
          <p className="text-gray-600">Upload a CSV file to import your contacts</p>
        </div>

        {/* Wizard */}
        <ImportWizard onComplete={handleComplete} />
      </div>
    </DashboardLayout>
  );
}

