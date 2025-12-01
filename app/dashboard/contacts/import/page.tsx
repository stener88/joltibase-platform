'use client';

import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ImportWizard } from '@/components/contacts/ImportWizard';

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
          <h1 className="text-3xl font-bold text-foreground mb-2">Import Contacts</h1>
          <p className="text-muted-foreground">Upload a CSV file to import your contacts</p>
        </div>

        {/* Wizard */}
        <ImportWizard onComplete={handleComplete} />
      </div>
    </DashboardLayout>
  );
}

