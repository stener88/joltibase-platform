'use client';

import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ContactForm } from '@/components/contacts/ContactForm';
import { ArrowLeft } from 'lucide-react';

export default function NewContactPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        // Show success message (you could use a toast notification here)
        router.push('/dashboard/contacts');
      } else {
        alert(result.error || 'Failed to create contact');
      }
    } catch (error) {
      console.error('Failed to create contact:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add Contact</h1>
          <p className="text-gray-600">Add a new contact to your list</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <ContactForm
            onSubmit={handleSubmit}
            onCancel={() => router.back()}
            submitLabel="Add Contact"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

