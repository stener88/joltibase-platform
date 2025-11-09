'use client';

import { useState, useEffect } from 'react';
import { TagSelector } from './TagSelector';
import { MetadataEditor } from './MetadataEditor';
import { AlertCircle } from 'lucide-react';

import type { ContactStatus } from '@/lib/types/contact';

interface ContactFormData {
  email: string;
  firstName: string;
  lastName: string;
  status: ContactStatus;
  tags: string[];
  metadata: Record<string, any>;
}

interface ContactFormProps {
  initialData?: Partial<ContactFormData>;
  onSubmit: (data: ContactFormData) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export function ContactForm({ 
  initialData, 
  onSubmit, 
  onCancel,
  submitLabel = 'Save Contact'
}: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    email: '',
    firstName: '',
    lastName: '',
    status: 'subscribed',
    tags: [],
    metadata: {},
    ...initialData,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState('');

  // Check for duplicates when email changes
  useEffect(() => {
    const checkDuplicate = async () => {
      if (!formData.email || !formData.email.includes('@')) {
        setDuplicateWarning('');
        return;
      }

      try {
        const response = await fetch(`/api/contacts?search=${encodeURIComponent(formData.email)}&limit=1`);
        const result = await response.json();
        
        if (result.success && result.data.contacts.length > 0) {
          const existing = result.data.contacts[0];
          // Only show warning if it's a different contact (not editing the same one)
          if (!initialData || existing.email !== initialData.email) {
            setDuplicateWarning(`A contact with this email already exists`);
          } else {
            setDuplicateWarning('');
          }
        } else {
          setDuplicateWarning('');
        }
      } catch (error) {
        console.error('Error checking duplicate:', error);
      }
    };

    const timer = setTimeout(checkDuplicate, 500);
    return () => clearTimeout(timer);
  }, [formData.email, initialData]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#1a1aff] focus:border-transparent ${
            errors.email ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="contact@example.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
        {duplicateWarning && !errors.email && (
          <div className="mt-2 flex items-center gap-2 text-sm text-yellow-700 bg-yellow-50 p-3 rounded-lg">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{duplicateWarning}</span>
          </div>
        )}
      </div>

      {/* First Name */}
      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
          First Name
        </label>
        <input
          type="text"
          id="firstName"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1aff] focus:border-transparent"
          placeholder="John"
        />
      </div>

      {/* Last Name */}
      <div>
        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
          Last Name
        </label>
        <input
          type="text"
          id="lastName"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1aff] focus:border-transparent"
          placeholder="Doe"
        />
      </div>

      {/* Status */}
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <select
          id="status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as ContactStatus })}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1aff] focus:border-transparent bg-white"
        >
          <option value="subscribed">Subscribed</option>
          <option value="unsubscribed">Unsubscribed</option>
          <option value="bounced">Bounced</option>
          <option value="complained">Complained</option>
        </select>
      </div>

      {/* Tags */}
      <TagSelector
        tags={formData.tags}
        onChange={(tags) => setFormData({ ...formData, tags })}
      />

      {/* Custom Metadata */}
      <MetadataEditor
        metadata={formData.metadata}
        onChange={(metadata) => setFormData({ ...formData, metadata })}
      />

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 bg-white border-2 border-gray-200 text-gray-900 rounded-lg hover:border-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !!duplicateWarning}
          className="px-6 py-2.5 bg-[#1a1aff] text-white rounded-lg hover:bg-[#0000cc] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}

