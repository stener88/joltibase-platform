'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ContactForm } from '@/components/contacts/ContactForm';
import { ArrowLeft } from 'lucide-react';
import type { Contact } from '@/lib/types/contact';

export default function EditContactPage() {
  const router = useRouter();
  const params = useParams();
  const contactId = params.id as string;

  const [contact, setContact] = useState<Contact | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadContact();
  }, [contactId]);

  const loadContact = async () => {
    try {
      const response = await fetch(`/api/contacts/${contactId}`);
      const result = await response.json();

      if (result.success) {
        setContact(result.data);
      } else {
        setError(result.error || 'Failed to load contact');
      }
    } catch (err) {
      console.error('Failed to load contact:', err);
      setError('An error occurred while loading the contact');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch(`/api/contacts/${contactId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        router.push(`/dashboard/contacts/${contactId}`);
      } else {
        alert(result.error || 'Failed to update contact');
      }
    } catch (error) {
      console.error('Failed to update contact:', error);
      alert('An error occurred. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <svg
              className="animate-spin h-12 w-12 text-[#e9a589] mx-auto mb-4"
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
            <p className="text-gray-600">Loading contact...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !contact) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">😞</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{error || 'Contact not found'}</h1>
            <p className="text-gray-600 mb-6">
              The contact you're trying to edit doesn't exist or has been deleted.
            </p>
            <button
              onClick={() => router.push('/dashboard/contacts')}
              className="px-6 py-3 bg-[#1a1aff] text-white rounded-lg hover:bg-[#0000cc] transition-colors"
            >
              Back to Contacts
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push(`/dashboard/contacts/${contactId}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Contact
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Contact</h1>
          <p className="text-gray-600">Update contact information</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <ContactForm
            initialData={{
              email: contact.email,
              firstName: contact.first_name || '',
              lastName: contact.last_name || '',
              status: contact.status,
              tags: contact.tags || [],
              metadata: contact.metadata || {},
            }}
            onSubmit={handleSubmit}
            onCancel={() => router.push(`/dashboard/contacts/${contactId}`)}
            submitLabel="Save Changes"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

