'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Calendar, Send } from 'lucide-react';

interface ReviewStepProps {
  data: {
    name: string;
    type: string;
    from_name: string;
    from_email: string;
    subject_line: string;
    preview_text: string;
    html_content: string;
    list_ids: string[];
  };
  onBack: () => void;
  onSaveDraft: () => void;
}

export function ReviewStep({ data, onBack, onSaveDraft }: ReviewStepProps) {
  const router = useRouter();
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendNow = async () => {
    if (!confirm('Send this campaign now? This action cannot be undone.')) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Create campaign
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success) {
        // Send campaign
        const sendResponse = await fetch(`/api/campaigns/${result.data.id}/send`, {
          method: 'POST',
        });

        if (sendResponse.ok) {
          router.push(`/dashboard/campaigns/${result.data.id}/analytics`);
        }
      }
    } catch (error) {
      console.error('Failed to send campaign:', error);
      alert('Failed to send campaign. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSchedule = async () => {
    if (!scheduledDate) {
      alert('Please select a date and time');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          scheduled_at: scheduledDate,
        }),
      });

      const result = await response.json();
      if (result.success) {
        router.push('/dashboard/campaigns');
      }
    } catch (error) {
      console.error('Failed to schedule campaign:', error);
      alert('Failed to schedule campaign. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Send</h2>
      <p className="text-gray-600 mb-6">Review your campaign details before sending</p>

      {/* Campaign Summary */}
      <div className="space-y-6 mb-8">
        {/* Campaign Details */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Campaign Details</h3>
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="text-sm text-gray-600">Campaign Name:</dt>
              <dd className="text-sm font-medium text-gray-900">{data.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-600">Type:</dt>
              <dd className="text-sm font-medium text-gray-900 capitalize">{data.type}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-600">From:</dt>
              <dd className="text-sm font-medium text-gray-900">{data.from_name} &lt;{data.from_email}&gt;</dd>
            </div>
          </dl>
        </div>

        {/* Email Content */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Email Content</h3>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm text-gray-600 mb-1">Subject:</dt>
              <dd className="text-sm font-medium text-gray-900">{data.subject_line}</dd>
            </div>
            {data.preview_text && (
              <div>
                <dt className="text-sm text-gray-600 mb-1">Preview:</dt>
                <dd className="text-sm text-gray-500">{data.preview_text}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Audience */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Audience</h3>
          <p className="text-sm text-gray-600">
            {data.list_ids.length} list{data.list_ids.length !== 1 ? 's' : ''} selected
          </p>
        </div>
      </div>

      {/* Schedule or Send */}
      <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg mb-6">
        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            id="schedule"
            checked={isScheduling}
            onChange={(e) => setIsScheduling(e.target.checked)}
            className="w-4 h-4 text-[#1a1aff] border-gray-300 rounded focus:ring-[#1a1aff]"
          />
          <label htmlFor="schedule" className="text-sm font-medium text-gray-900">
            Schedule for later
          </label>
        </div>

        {isScheduling && (
          <div>
            <label htmlFor="scheduled_date" className="block text-sm font-medium text-gray-700 mb-2">
              Send Date & Time
            </label>
            <input
              type="datetime-local"
              id="scheduled_date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1aff] focus:border-transparent"
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-8 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-white border-2 border-gray-200 text-gray-900 rounded-lg hover:border-gray-300 transition-colors disabled:opacity-50"
          >
            Back
          </button>
          <button
            onClick={onSaveDraft}
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-white border-2 border-gray-200 text-gray-900 rounded-lg hover:border-gray-300 transition-colors disabled:opacity-50"
          >
            Save as Draft
          </button>
        </div>
        
        {isScheduling ? (
          <button
            onClick={handleSchedule}
            disabled={isSubmitting || !scheduledDate}
            className="px-6 py-2.5 bg-[#1a1aff] text-white rounded-lg hover:bg-[#0000cc] transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Calendar className="w-5 h-5" />
            {isSubmitting ? 'Scheduling...' : 'Schedule Campaign'}
          </button>
        ) : (
          <button
            onClick={handleSendNow}
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Send className="w-5 h-5" />
            {isSubmitting ? 'Sending...' : 'Send Now'}
          </button>
        )}
      </div>
    </div>
  );
}

