'use client';

import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

interface List {
  id: string;
  name: string;
  contact_count: number;
}

interface AudienceStepProps {
  data: {
    list_ids: string[];
  };
  onUpdate: (updates: any) => void;
  onNext: () => void;
  onBack: () => void;
  onSaveDraft: () => void;
}

export function AudienceStep({ data, onUpdate, onNext, onBack, onSaveDraft }: AudienceStepProps) {
  const [lists, setLists] = useState<List[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalRecipients, setTotalRecipients] = useState(0);

  useEffect(() => {
    loadLists();
  }, []);

  useEffect(() => {
    calculateRecipients();
  }, [data.list_ids, lists]);

  const loadLists = async () => {
    try {
      // This endpoint needs to be created
      const response = await fetch('/api/lists');
      const result = await response.json();
      if (result.success) {
        setLists(result.data || []);
      }
    } catch (error) {
      console.error('Failed to load lists:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateRecipients = () => {
    const count = lists
      .filter(list => data.list_ids.includes(list.id))
      .reduce((sum, list) => sum + list.contact_count, 0);
    setTotalRecipients(count);
  };

  const toggleList = (listId: string) => {
    const newListIds = data.list_ids.includes(listId)
      ? data.list_ids.filter(id => id !== listId)
      : [...data.list_ids, listId];
    onUpdate({ list_ids: newListIds });
  };

  const handleNext = () => {
    if (data.list_ids.length === 0) {
      alert('Please select at least one list');
      return;
    }
    onNext();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Audience</h2>
      <p className="text-gray-600 mb-6">Choose which contacts will receive this campaign</p>

      {/* Recipient Count */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-blue-600" />
          <div>
            <p className="text-sm text-blue-900 font-medium">Estimated Recipients</p>
            <p className="text-2xl font-bold text-blue-900">{totalRecipients.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Lists Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Contact Lists <span className="text-red-500">*</span>
        </label>

        {isLoading ? (
          <div className="text-center py-8 text-gray-500">
            Loading lists...
          </div>
        ) : lists.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No contact lists found</p>
            <a
              href="/dashboard/contacts"
              className="text-[#1a1aff] hover:text-[#0000cc] font-medium"
            >
              Create a list first
            </a>
          </div>
        ) : (
          lists.map((list) => (
            <label
              key={list.id}
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#1a1aff] transition-colors"
            >
              <input
                type="checkbox"
                checked={data.list_ids.includes(list.id)}
                onChange={() => toggleList(list.id)}
                className="w-5 h-5 text-[#1a1aff] border-gray-300 rounded focus:ring-[#1a1aff]"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">{list.name}</p>
                <p className="text-sm text-gray-500">
                  {list.contact_count.toLocaleString()} contact{list.contact_count !== 1 ? 's' : ''}
                </p>
              </div>
            </label>
          ))
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-6 py-2.5 bg-white border-2 border-gray-200 text-gray-900 rounded-lg hover:border-gray-300 transition-colors"
          >
            Back
          </button>
          <button
            onClick={onSaveDraft}
            className="px-6 py-2.5 bg-white border-2 border-gray-200 text-gray-900 rounded-lg hover:border-gray-300 transition-colors"
          >
            Save as Draft
          </button>
        </div>
        <button
          onClick={handleNext}
          className="px-6 py-2.5 bg-[#1a1aff] text-white rounded-lg hover:bg-[#0000cc] transition-colors"
        >
          Continue to Review
        </button>
      </div>
    </div>
  );
}

