'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ContactInfo } from '@/components/contacts/ContactInfo';
import { ActivityTimeline } from '@/components/contacts/ActivityTimeline';
import { ArrowLeft } from 'lucide-react';
import type { ContactWithEmailHistory } from '@/lib/types/contact';

type Contact = ContactWithEmailHistory & {
  updated_at: string;
};

export default function ContactDetailPage() {
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

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this contact? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/contacts/${contactId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/dashboard/contacts');
      } else {
        alert('Failed to delete contact');
      }
    } catch (err) {
      console.error('Failed to delete contact:', err);
      alert('An error occurred');
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <svg
              className="animate-spin h-12 w-12 text-foreground mx-auto mb-4"
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
          <div className="bg-card rounded-lg border border-border p-12 text-center">
            <div className="text-6xl mb-4">😞</div>
            <h1 className="text-2xl font-bold text-foreground mb-2">{error || 'Contact not found'}</h1>
            <p className="text-muted-foreground mb-6">
              The contact you're looking for doesn't exist or has been deleted.
            </p>
            <button
              onClick={() => router.push('/dashboard/contacts')}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
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
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard/contacts')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Contacts
          </button>
          <h1 className="text-3xl font-bold text-foreground">Contact Details</h1>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Contact Info */}
          <div className="lg:col-span-1">
            <ContactInfo
              contact={contact}
              onEdit={() => router.push(`/dashboard/contacts/${contactId}/edit`)}
              onDelete={handleDelete}
            />
          </div>

          {/* Right Column - Activity Timeline */}
          <div className="lg:col-span-2">
            <ActivityTimeline emailHistory={contact.emailHistory || []} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

